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
        <!-- ========== BASIC SEO TAGS ========== -->
<title>Toolnes – Free Online Tools | Convert, Edit & Optimize Files</title>
<meta name="description" content="Toolnes provides fast and free online tools for file conversion, compression, editing, and optimization. Simple, powerful & easy-to-use toolkit.">
<meta name="keywords" content="online tools, free tools, file converter, image converter, pdf tools, toolnes, saas tools">
<meta name="author" content="Toolnes">

<!-- Canonical URL -->
<link rel="canonical" href="https://www.toolnes.in/" />

<!-- ========== MOBILE SEO ========== -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#ffffff">

<!-- ========== OPEN GRAPH (FACEBOOK, LINKEDIN) ========== -->
<meta property="og:title" content="Toolnes – Free Online File Tools">
<meta property="og:description" content="Convert, compress & optimize files instantly with Toolnes. 100% free and fast online tools.">
<meta property="og:url" content="https://www.toolnes.in/">
<meta property="og:type" content="website">
<meta property="og:image" content="https://www.toolnes.in/og-image.jpg">

<!-- ========== TWITTER CARD ========== -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Toolnes – Free Online File Tools">
<meta name="twitter:description" content="Convert, compress & optimize files instantly with Toolnes.">
<meta name="twitter:image" content="https://www.toolnes.in/og-image.jpg">

<!-- ========== FAVICONS ========== -->
<link rel="icon" type="image/png" href="/icons/favicon-32.png">

<!-- ========== SITEMAP ========== -->
<link rel="sitemap" type="application/xml" title="Sitemap" href="https://www.toolnes.in/sitemap.xml">

<!-- ========== STRUCTURED DATA (GOOGLE) ========== -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Toolnes",
  "url": "https://www.toolnes.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.toolnes.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>

<!-- FAQ Schema (Optional but powerful) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is Toolnes?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Toolnes is a free online tool platform that allows users to convert, compress and edit files instantly."
    }
  },
  {
    "@type": "Question",
    "name": "Is Toolnes free?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, Toolnes is completely free and offers fast online tools without login."
    }
  }]
}
</script>

<!-- ========== SPEED BOOST (SEO RANKING FACTOR) ========== -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
