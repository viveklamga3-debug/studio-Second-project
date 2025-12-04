"use client";

import { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Upload, Download, RefreshCw, FileArchive, Trash2, FilePlus2, FileCheck2, ArchiveRestore } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface ZipFile {
  file: File;
  id: string;
}

interface ExtractedFile {
  name: string;
  blob: Blob;
  id: string;
}

export default function ZipToolsPage() {
  const [filesToZip, setFilesToZip] = useState<ZipFile[]>([]);
  const [zipToExtract, setZipToExtract] = useState<File | null>(null);
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const createZipInputRef = useRef<HTMLInputElement>(null);
  const extractZipInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // --- ZIP Creation Logic ---
  const handleFilesToZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));
      setFilesToZip((prev) => [...prev, ...newFiles]);
    }
  };

  const handleCreateZipDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      const newFiles = Array.from(droppedFiles).map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));
      setFilesToZip((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFileToZip = (id: string) => {
    setFilesToZip(filesToZip.filter((f) => f.id !== id));
  };
  
  const triggerCreateZipInput = () => createZipInputRef.current?.click();

  const createZip = async () => {
    if (filesToZip.length === 0) {
      toast({ variant: "destructive", title: "No Files", description: "Please add files to create a ZIP." });
      return;
    }
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      filesToZip.forEach(({ file }) => {
        zip.file(file.name, file);
      });
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "archive.zip");
      toast({ title: "Success!", description: "Your ZIP file has been created and downloaded." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not create ZIP file." });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetCreateZip = () => {
    setFilesToZip([]);
    if(createZipInputRef.current) createZipInputRef.current.value = "";
  };


  // --- ZIP Extraction Logic ---
  const handleZipToExtractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/zip" || file.type === "application/x-zip-compressed")) {
      setZipToExtract(file);
      setExtractedFiles([]);
      extractZip(file);
    } else if (file) {
      toast({ variant: "destructive", title: "Invalid File", description: "Please select a .zip file." });
    }
  };

  const handleExtractZipDrop = (event: React.DragEvent<HTMLDivElement>) => {
     event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && (file.type === "application/zip" || file.type === "application/x-zip-compressed")) {
      setZipToExtract(file);
      setExtractedFiles([]);
      extractZip(file);
    } else if (file) {
      toast({ variant: "destructive", title: "Invalid File", description: "Please select a .zip file." });
    }
  };
  
  const triggerExtractZipInput = () => extractZipInputRef.current?.click();

  const extractZip = async (file: File) => {
    setIsProcessing(true);
    setExtractedFiles([]);
    try {
      const zip = await JSZip.loadAsync(file);
      const files: ExtractedFile[] = [];
      for (const filename in zip.files) {
        if (!zip.files[filename].dir) {
          const blob = await zip.files[filename].async("blob");
          files.push({ name: filename, blob, id: crypto.randomUUID() });
        }
      }
      setExtractedFiles(files);
      toast({ title: "Extraction Complete", description: `Found ${files.length} files in the archive.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not read or extract the ZIP file." });
      resetExtractZip();
    } finally {
      setIsProcessing(false);
    }
  };
  
  const downloadExtractedFile = (blob: Blob, name: string) => {
      saveAs(blob, name);
  }
  
  const resetExtractZip = () => {
      setZipToExtract(null);
      setExtractedFiles([]);
      if(extractZipInputRef.current) extractZipInputRef.current.value = "";
  }


  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">ZIP Tools</h1>
        <p className="text-muted-foreground mt-1">
          Create new ZIP archives or extract files from existing ones.
        </p>
      </header>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create"><FileArchive className="mr-2"/>Create ZIP</TabsTrigger>
          <TabsTrigger value="extract"><ArchiveRestore className="mr-2"/>Extract ZIP</TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="pt-6">
          {filesToZip.length === 0 ? (
             <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCreateZipDrop}
                onClick={triggerCreateZipInput}
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop files to ZIP</p>
                <p className="text-muted-foreground">or click to select files</p>
                <Input ref={createZipInputRef} type="file" className="hidden" onChange={handleFilesToZipChange} multiple />
              </div>
          ) : (
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Files to Archive</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                        {filesToZip.map(({file, id}) => (
                            <div key={id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                                <p className="font-mono text-sm truncate">{file.name}</p>
                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeFileToZip(id)}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                 <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleCreateZipDrop}
                    onClick={triggerCreateZipInput}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                    <FilePlus2 className="w-8 h-8 text-muted-foreground" />
                    <p className="mt-2 text-md font-semibold">Add more files</p>
                    <Input ref={createZipInputRef} type="file" className="hidden" onChange={handleFilesToZipChange} multiple />
                 </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={createZip} disabled={isProcessing} className="w-full sm:w-auto flex-grow">
                        <FileArchive className="mr-2"/>
                        {isProcessing ? "Creating..." : `Create ZIP with ${filesToZip.length} Files`}
                    </Button>
                    <Button onClick={resetCreateZip} variant="outline" className="w-full sm:w-auto">
                        <RefreshCw className="mr-2"/>
                        Start Over
                    </Button>
                </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="extract" className="pt-6">
           {!zipToExtract ? (
             <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleExtractZipDrop}
                onClick={triggerExtractZipInput}
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <FileCheck2 className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-semibold">Drag & drop a .zip file here</p>
                <p className="text-muted-foreground">or click to select a file</p>
                <Input ref={extractZipInputRef} type="file" className="hidden" onChange={handleZipToExtractChange} accept=".zip,application/zip,application/x-zip-compressed" />
              </div>
           ) : (
             <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Extracted Files</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                        {isProcessing ? (
                             <div className="flex items-center justify-center p-8">
                                <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                                <p className="ml-4">Extracting files...</p>
                            </div>
                        ) : (
                            extractedFiles.map(({name, blob, id}) => (
                                <div key={id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                                    <p className="font-mono text-sm truncate">{name}</p>
                                    <Button size="sm" variant="ghost" onClick={() => downloadExtractedFile(blob, name)}>
                                        <Download className="w-4 h-4 mr-2"/>
                                        Download
                                    </Button>
                                </div>
                            ))
                        )}
                         {(!isProcessing && extractedFiles.length === 0) && (
                            <p className="text-muted-foreground text-center py-4">No files found in this archive.</p>
                        )}
                    </CardContent>
                </Card>
                <Button onClick={resetExtractZip} variant="outline" className="w-full">
                    <RefreshCw className="mr-2"/>
                    Extract Another ZIP
                </Button>
            </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
