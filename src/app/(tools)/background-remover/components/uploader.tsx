'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { removeBackground } from '../actions';
import { Download, ImageIcon, Loader2, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const exampleImage = PlaceHolderImages.find(img => img.id === 'background-remover-example');

export function Uploader() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image.png');

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

    setFileName(file.name.replace(/\.[^/.]+$/, "") + "-no-bg.png");
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUri = event.target?.result as string;
      setOriginalImage(dataUri);
      setProcessedImage(null); // Clear previous result
      startTransition(async () => {
        const result = await removeBackground({ photoDataUri: dataUri });
        if (result.success) {
          setProcessedImage(result.data.backgroundRemovedDataUri);
        } else {
          toast({
            title: "Error processing image",
            description: result.error,
            variant: "destructive"
          });
          setOriginalImage(null); // Clear original image on error
        }
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleUseExample = async () => {
    if (!exampleImage) return;
    const response = await fetch(exampleImage.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "example.jpg", { type: "image/jpeg" });
    processFile(file);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
            <div className="aspect-square relative border rounded-lg bg-muted/20 overflow-hidden">
                 <Image src={originalImage} alt="Original" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 50vw" />
                 <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</div>
            </div>
            <div className="aspect-square relative border rounded-lg bg-grid-pattern overflow-hidden">
                {isPending && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Removing background...</p>
                    </div>
                )}
                {processedImage && (
                    <Image src={processedImage} alt="Processed" fill style={{ objectFit: 'contain' }} sizes="(max-width: 768px) 100vw, 50vw"/>
                )}
                 <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Background Removed</div>
            </div>
        </div>
        <div className="flex justify-center gap-4">
             <Button variant="outline" onClick={handleReset}><RefreshCw className="mr-2 h-4 w-4"/>Start Over</Button>
             <Button onClick={handleDownload} disabled={!processedImage}><Download className="mr-2 h-4 w-4"/>Download</Button>
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
