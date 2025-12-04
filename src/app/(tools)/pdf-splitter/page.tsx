"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, RefreshCw, Scissors, FileUp, FileDown, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface PageInfo {
  pageNumber: number;
  selected: boolean;
}

export default function PDFSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setIsProcessing(true);
      try {
        const pdfBytes = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();
        setPages(
          Array.from({ length: pageCount }, (_, i) => ({
            pageNumber: i + 1,
            selected: true,
          }))
        );
      } catch (error) {
        toast({ variant: "destructive", title: "Error reading PDF", description: "The file might be corrupted or protected." });
        handleReset();
      } finally {
        setIsProcessing(false);
      }
    } else if (selectedFile) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please select a PDF file.",
        });
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
       if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        fileInputRef.current.files = dataTransfer.files;
        // Manually trigger the change event
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
       }
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handlePageSelect = (pageNumber: number, selected: boolean | "indeterminate") => {
    if(typeof selected !== 'boolean') return;
    setPages(
      pages.map((p) => (p.pageNumber === pageNumber ? { ...p, selected } : p))
    );
  };
  
  const toggleSelectAll = () => {
    const allSelected = pages.every(p => p.selected);
    setPages(pages.map(p => ({ ...p, selected: !allSelected })));
  }

  const handleExtract = async () => {
    if (!file) return;
    const selectedPages = pages.filter(p => p.selected).map(p => p.pageNumber - 1);
    if(selectedPages.length === 0){
        toast({ variant: "destructive", title: "No Pages Selected", description: "Please select at least one page to extract." });
        return;
    }

    setIsSplitting(true);
    try {
        const existingPdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const newPdfDoc = await PDFDocument.create();

        const copiedPages = await newPdfDoc.copyPages(pdfDoc, selectedPages);
        copiedPages.forEach(page => newPdfDoc.addPage(page));

        const newPdfBytes = await newPdfDoc.save();
        download(newPdfBytes, `${file.name.replace('.pdf', '')}-extracted.pdf`);
        toast({ title: "Success!", description: "Selected pages have been extracted." });

    } catch (error) {
        toast({ variant: "destructive", title: "Extraction Error", description: "Could not extract pages from the PDF." });
    } finally {
        setIsSplitting(false);
    }
  };

  const handleSplitAll = async () => {
     if (!file) return;
     setIsSplitting(true);
     try {
        const existingPdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
            const newPdfDoc = await PDFDocument.create();
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
            newPdfDoc.addPage(copiedPage);
            const newPdfBytes = await newPdfDoc.save();
            download(newPdfBytes, `${file.name.replace('.pdf', '')}-page-${i + 1}.pdf`);
        }
        toast({ title: "Success!", description: "All pages have been split and downloaded." });
    } catch (error) {
        toast({ variant: "destructive", title: "Split Error", description: "Could not split the PDF." });
    } finally {
        setIsSplitting(false);
    }
  };

  const download = (bytes: Uint8Array, filename: string) => {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setIsProcessing(false);
    setIsSplitting(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const selectedCount = pages.filter(p => p.selected).length;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">PDF Splitter</h1>
        <p className="text-muted-foreground mt-1">
          Extract specific pages or split a PDF into individual files.
        </p>
      </header>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-lg font-semibold">Drag & drop a PDF here</p>
          <p className="text-muted-foreground">or click to select a file</p>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Select Pages</CardTitle>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="select-all" 
                      checked={pages.length > 0 && selectedCount === pages.length ? true : selectedCount === 0 ? false : "indeterminate"}
                      onCheckedChange={toggleSelectAll}
                    />
                    <Label htmlFor="select-all">Select All</Label>
                  </div>
              </div>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex items-center justify-center p-8">
                    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                    <p className="ml-4">Loading pages...</p>
                </div>
              ) : (
                <>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {pages.map(({ pageNumber, selected }) => (
                    <div
                      key={pageNumber}
                      onClick={() => handlePageSelect(pageNumber, !selected)}
                      className="flex flex-col items-center justify-center p-2 border rounded-md cursor-pointer transition-colors"
                      data-state={selected ? 'checked' : 'unchecked'}
                    >
                      {selected ? <CheckSquare className="w-6 h-6 text-primary mb-2" /> : <Square className="w-6 h-6 text-muted-foreground mb-2" />}
                      <Label className="font-semibold">Page {pageNumber}</Label>
                    </div>
                  ))}
                </div>
                 <div className="mt-6 text-center">
                    <Badge variant="secondary" className="text-lg py-1 px-4">{selectedCount} / {pages.length} pages selected</Badge>
                 </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle>Splitting Options</CardTitle>
             </CardHeader>
             <CardContent className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleExtract} disabled={isSplitting || selectedCount === 0} className="w-full sm:w-auto flex-grow">
                  <FileDown className="mr-2"/>
                  {isSplitting ? "Extracting..." : `Extract ${selectedCount} Pages`}
                </Button>
                <Button onClick={handleSplitAll} disabled={isSplitting} variant="secondary" className="w-full sm:w-auto flex-grow">
                    <Scissors className="mr-2"/>
                    {isSplitting ? "Splitting..." : "Split Into Separate Files"}
                </Button>
             </CardContent>
          </Card>

          <Button onClick={handleReset} variant="outline" className="w-full">
            <RefreshCw className="mr-2" />
            Start Over with a New File
          </Button>
        </div>
      )}
    </div>
  );
}
