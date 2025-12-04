"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Download, RefreshCw, Expand, Link as LinkIcon, Link2Off } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

type ResizeMode = "pixels" | "percentage";

export default function ImageResizerPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  
  const [resizeMode, setResizeMode] = useState<ResizeMode>("pixels");
  const [newWidth, setNewWidth] = useState("");
  const [newHeight, setNewHeight] = useState("");
  const [percentage, setPercentage] = useState(50);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  
  const [isResizing, setIsResizing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [resizedSize, setResizedSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
      setOriginalSize(file.size);
      
      const img = document.createElement("img");
      img.src = url;
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setNewWidth(String(img.width));
        setNewHeight(String(img.height));
      };

      setResizedUrl(null);
      setResizedSize(null);
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
      const url = URL.createObjectURL(file);
      setOriginalFile(file);
      setOriginalUrl(url);
      setOriginalSize(file.size);

      const img = document.createElement("img");
      img.src = url;
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setNewWidth(String(img.width));
        setNewHeight(String(img.height));
      };
      
      setResizedUrl(null);
      setResizedSize(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select an image file.",
      });
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleWidthChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setNewWidth(value);
    if (keepAspectRatio && originalDimensions && !isNaN(numValue) && numValue > 0) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      setNewHeight(String(Math.round(numValue * aspectRatio)));
    }
  };

  const handleHeightChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setNewHeight(value);
    if (keepAspectRatio && originalDimensions && !isNaN(numValue) && numValue > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      setNewHeight(String(Math.round(numValue * aspectRatio)));
    }
  };
  
  useEffect(() => {
    if (resizeMode === 'percentage' && originalDimensions) {
      const factor = percentage / 100;
      setNewWidth(String(Math.round(originalDimensions.width * factor)));
      setNewHeight(String(Math.round(originalDimensions.height * factor)));
    }
  }, [percentage, resizeMode, originalDimensions]);


  const resizeImage = () => {
    if (!originalFile || !originalUrl || !originalDimensions) return;
    
    let targetWidth = parseInt(newWidth, 10);
    let targetHeight = parseInt(newHeight, 10);
    
    if (isNaN(targetWidth) || isNaN(targetHeight) || targetWidth <= 0 || targetHeight <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Dimensions', description: 'Please enter valid width and height.'});
      return;
    }

    setIsResizing(true);
    setResizedUrl(null);
    setResizedSize(null);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsResizing(false);
        toast({ variant: "destructive", title: "Resize Error", description: "Could not get canvas context." });
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob((blob) => {
        if (blob) {
          setResizedUrl(URL.createObjectURL(blob));
          setResizedSize(blob.size);
        } else {
          toast({ variant: "destructive", title: "Resize Error", description: "Failed to create resized image blob." });
        }
        setIsResizing(false);
      }, mimeType, 0.95);
    };
    img.onerror = () => {
      setIsResizing(false);
      toast({ variant: "destructive", title: "Image Load Error", description: "Could not load the original image." });
    };
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setResizedUrl(null);
    setOriginalDimensions(null);
    setOriginalSize(null);
    setResizedSize(null);
    setNewWidth("");
    setNewHeight("");
    setPercentage(50);
    setKeepAspectRatio(true);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Image Resizer</h1>
        <p className="text-muted-foreground mt-1">
          Resize images by pixel or percentage with ease.
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
          <p className="mt-4 text-lg font-semibold">Drag & drop an image here</p>
          <p className="text-muted-foreground">or click to select a file</p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      )}

      {originalFile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Original ({formatFileSize(originalSize)})</Label>
                    {originalUrl && originalDimensions && (
                      <div className="relative">
                        <Image src={originalUrl} alt="Original" width={originalDimensions.width} height={originalDimensions.height} className="w-full h-auto rounded-md object-contain border" />
                         <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                           {originalDimensions.width} x {originalDimensions.height}
                         </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Resized ({formatFileSize(resizedSize)})</Label>
                    <div className="w-full min-h-[200px] rounded-md border flex items-center justify-center bg-muted/20">
                      {isResizing ? (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <RefreshCw className="w-8 h-8 animate-spin" />
                              <span>Resizing...</span>
                          </div>
                      ) : resizedUrl ? (
                         <div className="relative">
                            <Image src={resizedUrl} alt="Resized" width={parseInt(newWidth, 10)} height={parseInt(newHeight, 10)} className="w-full h-auto rounded-md object-contain" />
                             <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                               {newWidth} x {newHeight}
                             </div>
                         </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                            <p>Adjust settings and click "Resize Image"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resize Options</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={resizeMode} onValueChange={(v) => setResizeMode(v as ResizeMode)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="pixels">By Pixels</TabsTrigger>
                    <TabsTrigger value="percentage">By Percentage</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pixels" className="space-y-4 pt-4">
                     <div className="flex items-center space-x-2 justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="aspect-ratio" checked={keepAspectRatio} onCheckedChange={setKeepAspectRatio} />
                        <Label htmlFor="aspect-ratio">Keep Aspect Ratio</Label>
                      </div>
                      {keepAspectRatio ? <LinkIcon className="text-muted-foreground"/> : <Link2Off className="text-muted-foreground"/>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div className="space-y-1">
                        <Label htmlFor="width">Width</Label>
                        <Input id="width" type="number" value={newWidth} onChange={(e) => handleWidthChange(e.target.value)} disabled={isResizing} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="height">Height</Label>
                        <Input id="height" type="number" value={newHeight} onChange={(e) => handleHeightChange(e.target.value)} disabled={isResizing || keepAspectRatio} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="percentage" className="space-y-4 pt-4">
                     <div className="space-y-2">
                        <Label htmlFor="percentage">Scale: {percentage}%</Label>
                        <Slider id="percentage" min={1} max={200} step={1} value={[percentage]} onValueChange={(v) => setPercentage(v[0])} disabled={isResizing} />
                     </div>
                      <div className="grid grid-cols-2 gap-2 items-center">
                        <div className="space-y-1">
                          <Label htmlFor="width-perc">Width</Label>
                          <Input id="width-perc" value={newWidth} disabled readOnly />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="height-perc">Height</Label>
                          <Input id="height-perc" value={newHeight} disabled readOnly />
                        </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <Button onClick={resizeImage} disabled={isResizing} className="w-full mt-6">
                  <Expand className="mr-2"/>
                  {isResizing ? "Resizing..." : "Resize Image"}
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
                 <a href={resizedUrl || '#'} download={originalFile ? `resized-${originalFile.name}` : 'resized-image'}>
                    <Button disabled={!resizedUrl || isResizing} className="w-full">
                        <Download className="mr-2" />
                        Download Resized Image
                    </Button>
                 </a>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    <RefreshCw className="mr-2"/>
                    Start Over
                </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
