"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, RefreshCw, FilePlus2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PDFFile {
  file: File;
  id: string;
}

export default function PDFMergerPage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newPDFFiles = Array.from(selectedFiles)
        .filter((file) => file.type === "application/pdf")
        .map((file) => ({ file, id: crypto.randomUUID() }));

      if (newPDFFiles.length !== selectedFiles.length) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "One or more selected files were not PDFs and have been ignored.",
        });
      }
      setFiles((prev) => [...prev, ...newPDFFiles]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newPDFFiles = Array.from(droppedFiles)
        .filter((file) => file.type === "application/pdf")
        .map((file) => ({ file, id: crypto.randomUUID() }));
      
      if (newPDFFiles.length !== droppedFiles.length) {
         toast({ variant: "destructive", title: "Invalid File Type", description: "Some dropped files were not PDFs." });
      }
      setFiles((prev) => [...prev, ...newPDFFiles]);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  
  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };
  
  const moveFile = (index: number, direction: 'up' | 'down') => {
      const newFiles = [...files];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex >= 0 && targetIndex < files.length) {
          [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
          setFiles(newFiles);
      }
  }

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast({
        variant: "destructive",
        title: "Not Enough Files",
        description: "Please upload at least two PDF files to merge.",
      });
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const { file } of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged-document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({ title: "Success!", description: "Your PDFs have been merged and downloaded." });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Merge Error",
        description: "An error occurred while merging the PDFs. Please check your files and try again.",
      });
    } finally {
      setIsMerging(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">PDF Merger</h1>
        <p className="text-muted-foreground mt-1">
          Combine multiple PDF files into one. Drag to reorder.
        </p>
      </header>

      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Drag & drop PDF files here</p>
          <p className="text-muted-foreground">or click to select files</p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            multiple
          />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Files to Merge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map(({file, id}, index) => (
                  <div key={id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                    <p className="font-mono text-sm truncate">{file.name}</p>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" onClick={() => moveFile(index, 'up')} disabled={index === 0}>
                            <ArrowUp className="w-4 h-4"/>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1}>
                            <ArrowDown className="w-4 h-4"/>
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeFile(id)}>
                            <Trash2 className="w-4 h-4"/>
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
             onClick={triggerFileInput}
          >
            <FilePlus2 className="w-8 h-8 text-muted-foreground" />
            <p className="mt-2 text-md font-semibold">Add more files</p>
            <p className="text-sm text-muted-foreground">Drag & drop or click</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
             <Button onClick={mergePdfs} disabled={isMerging || files.length < 2} className="w-full sm:w-auto flex-grow">
              <FilePlus2 className="mr-2"/>
              {isMerging ? "Merging..." : `Merge ${files.length} Files`}
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
                <RefreshCw className="mr-2"/>
                Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
