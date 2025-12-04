"use client";

import { useState, useRef } from "react";
import { Upload, RefreshCw, FileQuestion, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const allowedTypes = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a .doc or .docx file.",
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      setFile(droppedFile);
    } else if (droppedFile) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please drop a .doc or .docx file.",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleConvert = () => {
    if (!file) return;
    setIsConverting(true);
    // This is where the actual conversion logic will go.
    // For now, we'll simulate a delay.
    setTimeout(() => {
      setIsConverting(false);
      toast({
        title: "Conversion Successful (Simulated)",
        description: "In a real app, your PDF document would now be downloading.",
      });
      // In a real implementation, you would trigger a download here.
      // e.g., downloadFile(convertedBlob, 'converted.pdf');
    }, 2000);
  };
  
  const handleReset = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Word to PDF Converter</h1>
        <p className="text-muted-foreground mt-1">
          Turn your Word documents into professional PDF files.
        </p>
      </header>

      {!file && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Drag & drop a Word document here</p>
          <p className="text-muted-foreground">or click to select a file (.doc, .docx)</p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
          />
        </div>
      )}

      {file && (
        <div className="flex flex-col items-center space-y-6">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>File Ready for Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                        <FileCheck2 className="w-16 h-16 text-primary" />
                        <p className="mt-4 font-semibold truncate">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <Button onClick={handleConvert} disabled={isConverting} className="w-full">
                    <RefreshCw className="mr-2" />
                    {isConverting ? "Converting..." : "Convert to PDF"}
                </Button>
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
