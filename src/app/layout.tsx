import type {Metadata} from 'next';
import './globals.css';
import {cn} from '@/lib/utils';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import {MainLayout} from '@/components/layout/main-layout';
import { FirebaseClientProvider } from '@/firebase';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Toolnes - Free Image & File Tools',
  description: 'Compress, convert, and edit your images and files with our suite of free, fast, and easy-to-use online tools. Built for speed and simplicity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <title>Toolnes – Free Online Tools for PDF, Images & File Conversion</title>

<meta name="description" content="Toolnes offers fast, simple, and free online tools for PDF editing, file conversion, image compression, resizing, cropping, passport photo making, ZIP creation, and more.">

<meta name="keywords" content="pdf tools, pdf converter, image compressor, pdf to word, word to pdf, image resizer, passport photo maker, zip creator, online tools">

<!-- OpenGraph -->
<meta property="og:title" content="Toolnes – Free PDF & Image Tools">
<meta property="og:description" content="Use free online tools to edit PDFs, compress images, convert formats, create passport photos, and manage ZIP files. Fast and secure.">
<meta property="og:url" content="https://www.toolnes.in">
<meta property="og:image" content="https://www.toolnes.in/og-image.jpg">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Toolnes – Free Online PDF & Image Tools">
<meta name="twitter:description" content="Simple and fast tools for PDF editing, file conversions, and image processing.">
<meta name="twitter:image" content="https://www.toolnes.in/og-image.jpg">
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <MainLayout>{children}</MainLayout>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
