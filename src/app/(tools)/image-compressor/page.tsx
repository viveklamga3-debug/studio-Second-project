"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Download, RefreshCw, Image as ImageIcon, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalSize(file.size);
      setCompressedUrl(null);
      setCompressedSize(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select an image file.",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setOriginalSize(file.size);
      setCompressedUrl(null);
      setCompressedSize(null);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select an image file.",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const compressImage = () => {
    if (!originalFile || !originalUrl) return;

    setIsCompressing(true);
    setCompressedUrl(null);
    setCompressedSize(null);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsCompressing(false);
        toast({
          variant: "destructive",
          title: "Compression Error",
          description: "Could not get canvas context.",
        });
        return;
      }
      ctx.drawImage(img, 0, 0);

      const mimeType = originalFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const compressionQuality = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedUrl(URL.createObjectURL(blob));
            setCompressedSize(blob.size);
          } else {
            toast({
              variant: "destructive",
              title: "Compression Error",
              description: "Failed to create compressed image blob.",
            });
          }
          setIsCompressing(false);
        },
        mimeType,
        compressionQuality
      );
    };
    img.onerror = () => {
      setIsCompressing(false);
      toast({
        variant: "destructive",
        title: "Image Load Error",
        description: "Could not load the original image.",
      });
    };
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setQuality(80);
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

  const savings = originalSize && compressedSize ? ((originalSize - compressedSize) / originalSize) * 100 : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Image Compressor</h1>
        <p className="text-muted-foreground mt-1">
          Reduce the file size of your images with adjustable quality settings.
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Original ({formatFileSize(originalSize)})</Label>
                    {originalUrl && <Image src={originalUrl} alt="Original" width={400} height={400} className="w-full h-auto rounded-md object-contain border" />}
                  </div>
                  <div className="space-y-2">
                    <Label>Compressed ({formatFileSize(compressedSize)})</Label>
                    <div className="w-full aspect-square rounded-md border flex items-center justify-center bg-muted/20">
                      {isCompressing ? (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <RefreshCw className="w-8 h-8 animate-spin" />
                              <span>Compressing...</span>
                          </div>
                      ) : compressedUrl ? (
                        <Image src={compressedUrl} alt="Compressed" width={400} height={400} className="w-full h-auto rounded-md object-contain" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileQuestion className="w-8 h-8" />
                            <span>Compress to see preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                 {compressedSize && originalSize && (
                    <div className="mt-4 text-center text-lg font-medium">
                        {savings > 0 ? (
                             <p>
                                File size reduced by <span className="text-primary font-bold">{savings.toFixed(1)}%</span>
                             </p>
                        ) : (
                             <p className="text-orange-500">
                                Compressed size is larger. Try reducing quality.
                             </p>
                        )}
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compression Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality: {quality}</Label>
                  <Slider
                    id="quality"
                    min={0}
                    max={100}
                    step={5}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    disabled={isCompressing}
                  />
                  <p className="text-xs text-muted-foreground">Lower values result in smaller file sizes but lower quality.</p>
                </div>
                 <Button onClick={compressImage} disabled={isCompressing} className="w-full">
                  <ImageIcon className="mr-2"/>
                  {isCompressing ? "Compressing..." : "Compress Image"}
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
                 <Button
                  onClick={() => {
                    if (compressedUrl && originalFile) {
                        const link = document.createElement("a");
                        link.href = compressedUrl;
                        const fileExtension = originalFile.name.split('.').pop() || 'jpg';
                        const name = originalFile.name.replace(/\.[^/.]+$/, "");
                        link.download = `${name}-compressed.${fileExtension}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                  }}
                  disabled={!compressedUrl || isCompressing}
                  className="w-full"
                >
                  <Download className="mr-2" />
                  Download Compressed Image
                </Button>

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
