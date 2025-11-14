import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster"
import { AppProvider } from '@/lib/app-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'SupportBot',
  description: 'Your empathetic AI companion for mental well-being.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&family=Alegreya:wght@400;500;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased theme-default">
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
