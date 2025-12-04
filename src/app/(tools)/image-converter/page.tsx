"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Download, RefreshCw, FileImage } from "lucide-react";
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

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export default function ImageConverterPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  const [isConverting, setIsConverting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setConvertedUrl(null);
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
      setConvertedUrl(null);
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

  const convertImage = () => {
    if (!originalFile || !originalUrl) return;

    setIsConverting(true);
    setConvertedUrl(null);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        setIsConverting(false);
        toast({ variant: "destructive", title: "Conversion Error", description: "Could not get canvas context." });
        return;
      }
      
      // If converting from a transparent format (like PNG) to a format that doesn't support transparency (like JPEG),
      // fill the background with white.
      if (outputFormat === 'image/jpeg' && (originalFile.type === 'image/png' || originalFile.type === 'image/webp')) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedUrl(URL.createObjectURL(blob));
          } else {
            toast({
              variant: "destructive",
              title: "Conversion Error",
              description: "Failed to create converted image blob.",
            });
          }
          setIsConverting(false);
        },
        outputFormat,
        outputFormat === 'image/jpeg' ? 0.9 : undefined // quality setting for jpeg
      );
    };
    img.onerror = () => {
      setIsConverting(false);
      toast({ variant: "destructive", title: "Image Load Error", description: "Could not load the original image." });
    };
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setConvertedUrl(null);
    setOutputFormat("image/jpeg");
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const getFileExtension = (mimeType: OutputFormat) => {
      return mimeType.split('/')[1];
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Image Format Converter</h1>
        <p className="text-muted-foreground mt-1">
          Convert your images between JPG, PNG, and WebP formats.
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
                    <Label>Original</Label>
                    {originalUrl && <Image src={originalUrl} alt="Original" width={400} height={400} className="w-full h-auto rounded-md object-contain border" />}
                  </div>
                  <div className="space-y-2">
                    <Label>Converted</Label>
                    <div className="w-full aspect-square rounded-md border flex items-center justify-center bg-muted/20">
                      {isConverting ? (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <RefreshCw className="w-8 h-8 animate-spin" />
                              <span>Converting...</span>
                          </div>
                      ) : convertedUrl ? (
                        <Image src={convertedUrl} alt="Converted" width={400} height={400} className="w-full h-auto rounded-md object-contain" />
                      ) : (
                        <div className="text-center text-muted-foreground">
                            <p>Select a format and click "Convert Image"</p>
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
                <CardTitle>Conversion Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Convert to</Label>
                   <Select onValueChange={(v) => setOutputFormat(v as OutputFormat)} defaultValue={outputFormat}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/jpeg">JPG</SelectItem>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <Button onClick={convertImage} disabled={isConverting} className="w-full">
                  <RefreshCw className="mr-2"/>
                  {isConverting ? "Converting..." : "Convert Image"}
                </Button>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
                 <Button
                  onClick={() => {
                    if (convertedUrl && originalFile) {
                        const link = document.createElement("a");
                        link.href = convertedUrl;
                        const name = originalFile.name.replace(/\.[^/.]+$/, "");
                        link.download = `${name}-converted.${getFileExtension(outputFormat)}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                  }}
                  disabled={!convertedUrl || isConverting}
                  className="w-full"
                >
                  <Download className="mr-2" />
                  Download Converted Image
                </Button>

                <Button onClick={handleReset} variant="outline" className="w-full">
                    <FileImage className="mr-2"/>
                    Convert Another Image
                </Button>
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
}
