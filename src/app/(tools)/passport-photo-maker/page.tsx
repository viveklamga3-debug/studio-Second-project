"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Upload, Download, RefreshCw, Scissors, Globe } from "lucide-react";
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
import { passportSpecs, mmToPixels, type PassportSpec } from "@/lib/passport-specs";

export default function PassportPhotoMakerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [country, setCountry] = useState<string>("United States");
  const [isProcessing, setIsProcessing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const selectedSpec = passportSpecs.find((s) => s.country === country) as PassportSpec;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setProcessedUrl(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select an image file.",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
       setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setProcessedUrl(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select an image file.",
      });
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  
  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setProcessedUrl(null);
    setCountry("United States");
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const generatePassportPhoto = () => {
    if (!imageRef.current || !canvasRef.current || !originalUrl) return;
    setIsProcessing(true);

    const image = imageRef.current;
    const canvas = canvasRef.current;
    
    const spec = selectedSpec;
    const targetWidth = mmToPixels(spec.width, spec.resolution);
    const targetHeight = mmToPixels(spec.height, spec.resolution);
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sourceWidth = image.naturalWidth;
    const sourceHeight = image.naturalHeight;

    const imageAspectRatio = sourceWidth / sourceHeight;
    const canvasAspectRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspectRatio > canvasAspectRatio) {
      drawHeight = targetHeight / zoom;
      drawWidth = drawHeight * imageAspectRatio;
    } else {
      drawWidth = targetWidth / zoom;
      drawHeight = drawWidth / imageAspectRatio;
    }

    // Center the crop
    drawX = (targetWidth - drawWidth) / 2 + crop.x * (targetWidth/2);
    drawY = (targetHeight - drawHeight) / 2 + crop.y * (targetHeight/2);
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    setProcessedUrl(canvas.toDataURL("image/jpeg", 0.95));
    setIsProcessing(false);
  };

  useEffect(() => {
    if (originalUrl) {
      generatePassportPhoto();
    }
  }, [country, zoom, crop, originalUrl]);

  return (
    <div className="space-y-8">
       <header>
        <h1 className="text-3xl font-bold tracking-tight">Passport Photo Maker</h1>
        <p className="text-muted-foreground mt-1">
          Create official passport-sized photos for various countries.
        </p>
      </header>

      {!originalFile && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Drag & drop your photo here</p>
          <p className="text-muted-foreground">or click to select a file</p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
          />
        </div>
      )}

      {originalFile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adjust Your Photo</CardTitle>
              </CardHeader>
              <CardContent className="relative w-full aspect-square overflow-hidden cursor-move bg-muted/20 border rounded-md">
                {originalUrl && (
                   <Image
                      ref={imageRef}
                      src={originalUrl}
                      alt="User photo"
                      fill
                      className="object-contain"
                      style={{
                        transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)`,
                        transition: 'transform 0.1s ease-out',
                      }}
                      onWheel={(e) => {
                          e.preventDefault();
                          const newZoom = zoom - e.deltaY * 0.001;
                          setZoom(Math.min(Math.max(newZoom, 0.5), 5));
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startY = e.clientY;
                        const startCrop = { ...crop };

                        const handleMouseMove = (moveEvent: MouseEvent) => {
                            const dx = moveEvent.clientX - startX;
                            const dy = moveEvent.clientY - startY;
                            setCrop({
                                x: startCrop.x + dx / zoom,
                                y: startCrop.y + dy / zoom,
                            });
                        };
                        
                        const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };

                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                      }}
                   />
                )}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Guidelines can be added here */}
                </div>
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
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger id="country">
                      <Globe className="mr-2" />
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {passportSpecs.map((spec) => (
                        <SelectItem key={spec.country} value={spec.country}>
                          {spec.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label>Zoom</Label>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>-</Button>
                        <Input type="range" min="0.5" max="5" step="0.05" value={zoom} onChange={e => setZoom(Number(e.target.value))} />
                        <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(5, z + 0.1))}>+</Button>
                    </div>
                </div>
                 <div className="text-sm text-muted-foreground border p-3 rounded-md">
                  <h4 className="font-semibold mb-2">{selectedSpec.country} Specs</h4>
                  <p>Size: {selectedSpec.width}mm x {selectedSpec.height}mm</p>
                  <p>Resolution: {selectedSpec.resolution} DPI</p>
                  {selectedSpec.notes && <p className="mt-2 text-xs">{selectedSpec.notes}</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Preview & Download</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <canvas ref={canvasRef} className="w-full h-auto border rounded-md" style={{ aspectRatio: `${selectedSpec.width}/${selectedSpec.height}` }} />
                    <a href={processedUrl || '#'} download={`passport-photo-${country.toLowerCase().replace(' ','-')}.jpg`}>
                      <Button className="w-full" disabled={!processedUrl}>
                        <Download className="mr-2"/> Download Photo
                      </Button>
                    </a>
                </CardContent>
            </Card>
            
            <Button onClick={handleReset} variant="outline" className="w-full">
                <RefreshCw className="mr-2"/>
                Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
