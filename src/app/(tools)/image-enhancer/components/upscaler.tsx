'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { upscaleImage } from '../actions';
import { Download, ImageIcon, Loader2, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';

const exampleImage = PlaceHolderImages.find(img => img.id === 'image-enhancer-example');

export function Upscaler() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image.png');
  const [upscaleFactor, setUpscaleFactor] = useState<'1x' | '2x'>('2x');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        toast({
            title: "Invalid file type",
            description: "Please upload an image file.",
            variant: "destructive"
        });
        return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, "") + "-upscaled.png");
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setOriginalImage(dataUri);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUseExample = async () => {
    if (!exampleImage) return;
    const response = await fetch(exampleImage.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "example-lowres.jpg", { type: "image/jpeg" });
    processFile(file);
  };

  const handleUpscale = () => {
    if(!originalImage) return;
    startTransition(async () => {
        const result = await upscaleImage({ photoDataUri: originalImage, upscaleFactor });
        if (result.success) {
          setProcessedImage(result.data.upscaledPhotoDataUri);
        } else {
          toast({
            title: "Error processing image",
            description: result.error,
            variant: "destructive"
          });
        }
      });
  }

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setFileName('image.png');
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (originalImage) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
            <div className="space-y-4">
                <div className="aspect-square relative border rounded-lg bg-muted/20 overflow-hidden">
                     <Image src={originalImage} alt="Original" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 50vw" />
                     <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</div>
                </div>
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <p className="text-sm font-medium">Upscale Factor</p>
                        <RadioGroup defaultValue="2x" value={upscaleFactor} onValueChange={(v) => setUpscaleFactor(v as '1x' | '2x')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1x" id="1x" />
                                <Label htmlFor="1x">1x (Original Size)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="2x" id="2x" />
                                <Label htmlFor="2x">2x</Label>
                            </div>
                        </RadioGroup>
                         <Button onClick={handleUpscale} disabled={isPending} className="w-full">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" /> }
                            Enhance Image
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="aspect-square relative border rounded-lg bg-grid-pattern overflow-hidden">
                {(isPending && !processedImage) && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Enhancing image...</p>
                    </div>
                )}
                {processedImage ? (
                     <Image src={processedImage} alt="Processed" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 50vw"/>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Wand2 className="w-12 h-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">Your enhanced image will appear here</p>
                    </div>
                )}
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Enhanced</div>
            </div>
        </div>
        <div className="flex justify-center gap-4">
             <Button variant="outline" onClick={handleReset}><RefreshCw className="mr-2 h-4 w-4"/>Start Over</Button>
             <Button onClick={handleDownload} disabled={!processedImage || isPending}><Download className="mr-2 h-4 w-4"/>Download</Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-2">
        <label
          htmlFor="file-upload"
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer",
            "hover:bg-accent transition-colors"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (MAX. 8MB)</p>
          </div>
          <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        </label>
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground mb-2">No image? Try an example:</p>
          <Button onClick={handleUseExample} variant="secondary" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null }
            Use Example Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const GridPattern = () => (
  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full fill-muted/50 stroke-muted/60">
    <defs>
      <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M.5 16V.5H16" fill="none" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
  </svg>
)
