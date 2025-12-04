import type { LucideIcon } from 'lucide-react';
import {
  Minimize,
  UserSquare,
  Expand,
  Crop,
  FileImage,
  FilePlus2,
  FileMinus2,
  FileText,
  FileDigit,
  Replace,
  FileArchive,
} from 'lucide-react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon | React.ComponentType<any>;
  href: string;
}

export const imageTools: Tool[] = [
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Compress JPG, PNG, or WebP images with custom quality settings.',
    icon: Minimize,
    href: '/image-compressor',
  },
  {
    id: 'passport-photo-maker',
    title: 'Passport Photo Maker',
    description: 'Create official passport photos for any country automatically.',
    icon: UserSquare,
    href: '/passport-photo-maker',
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images by pixel or percentage while maintaining aspect ratio.',
    icon: Expand,
    href: '#',
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images with preset aspect ratios or freeform selection.',
    icon: Crop,
    href: '#',
  },
  {
    id: 'image-format-converter',
    title: 'Image Format Converter',
    description: 'Convert between PNG, JPG, and WebP formats in bulk.',
    icon: FileImage,
    href: '#',
  },
];

export const fileTools: Tool[] = [
  {
    id: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document with ease.',
    icon: FilePlus2,
    href: '#',
  },
  {
    id: 'pdf-splitter',
    title: 'PDF Splitter',
    description: 'Extract pages from a PDF or split it into multiple files.',
    icon: FileMinus2,
    href: '#',
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable Microsoft Word files.',
    icon: FileText,
    href: '#',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert Microsoft Word documents into professional PDFs.',
    icon: FileDigit,
    href: '#',
  },
  {
    id: 'png-jpg-converter',
    title: 'PNG <> JPG Converter',
    description: 'Quickly convert between PNG and JPG image formats.',
    icon: Replace,
    href: '#',
  },
  {
    id: 'zip-tools',
    title: 'ZIP Tools',
    description: 'Create and extract ZIP archives directly in your browser.',
    icon: FileArchive,
    href: '#',
  },
];
