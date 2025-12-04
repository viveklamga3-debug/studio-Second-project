"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Upload, Download, RefreshCw, Scissors, AspectRatio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";


const aspectRatios = [
    { name: 'Freeform', value: undefined },
    { name: '1:1 (Square)', value: 1 / 1 },
    { name: '4:3 (Standard)', value: 4 / 3 },
    { name: '3:2 (Photography)', value: 3 / 2 },
    { name: '16:9 (Widescreen)', value: 16 / 9 },
];

export default function ImageCropperPage() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>();
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setOriginalFile(e.target.files[0]);
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
     const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect || (width / height),
        width,
        height,
      ),
      width,
      height,
    );
    setCrop(newCrop);
    setCompletedCrop(newCrop);
  };
  
  const handleAspectChange = (value: string) => {
    const newAspect = value === 'Freeform' ? undefined : Number(value);
    setAspect(newAspect);

    if (imgRef.current) {
        const { width, height } = imgRef.current;
        const newCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                newAspect || (width / height),
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
        setCompletedCrop(newCrop);
    }
  }

  const handleDownload = async () => {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      throw new Error('No 2d context');
    }
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedor.height * scaleY,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    
    const blob = await offscreen.convertToBlob({
      type: originalFile?.type || 'image/png',
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const fileExtension = originalFile?.name.split('.').pop() || 'png';
    const name = originalFile?.name.replace(/\.[^/.]+$/, "") || 'image';
    link.download = `${name}-cropped.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setImgSrc('');
    setOriginalFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setAspect(undefined);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Image Cropper</h1>
        <p className="text-muted-foreground mt-1">
          Crop images with preset aspect ratios or freeform selection.
        </p>
      </header>

      {!imgSrc && (
        <div
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Click to select a file</p>
          <p className="text-muted-foreground">Upload an image to start cropping</p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onSelectFile}
          />
        </div>
      )}

      {imgSrc && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Crop Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[60vh]"
                >
                  <Image
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    width={800}
                    height={600}
                    onLoad={onImageLoad}
                    className="w-full h-auto"
                  />
                </ReactCrop>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aspect">Aspect Ratio</Label>
                  <Select onValueChange={handleAspectChange} value={aspect ? String(aspect) : 'Freeform'}>
                    <SelectTrigger id="aspect">
                       <AspectRatio className="mr-2"/>
                      <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                      {aspectRatios.map((ratio) => (
                        <SelectItem key={ratio.name} value={ratio.value ? String(ratio.value) : 'Freeform'}>
                          {ratio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
             <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <canvas
                        ref={previewCanvasRef}
                        className={cn("w-full h-auto border rounded-md", !completedCrop && "hidden")}
                        style={{
                            objectFit: 'contain',
                            width: completedCrop ? '100%' : 0,
                            height: completedCrop ? 'auto' : 0,
                            aspectRatio: completedCrop ? completedCrop.width / completedCrop.height : 1,
                        }}
                    />
                     {!completedCrop && <p className="text-muted-foreground text-center">Your cropped image will appear here.</p>}
                </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Button onClick={handleDownload} disabled={!completedCrop} className="w-full">
                <Download className="mr-2" />
                Download Cropped Image
              </Button>
              <Button onClick={handleReset} variant="outline" className="w-full">
                <RefreshCw className="mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Effect to draw on the preview canvas when the crop is complete
function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: any[],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dependencies = [...deps, waitTime, fn];
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = () => {
    fn();
  };

  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFn = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setTimeoutId(window.setTimeout(callback, waitTime));
  };
  
  useState(() => {
    debouncedFn();
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}


useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than img workflow.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
        )
      }
    },
    100,
    [completedCrop],
)

async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: Crop,
) {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.save()
  
  ctx.translate(-cropX, -cropY)
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  )

  ctx.restore()
}