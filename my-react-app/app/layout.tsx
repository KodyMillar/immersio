import type { Metadata } from 'next'
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Immersio Ingestion Frontend",
  description: "Immersio Ingestion Frontend Test",
}

interface RootLayoutProps {
  children: ReactNode;
}


const poppins = Poppins({
  weight: ['400', '700'], 
  style: ['normal', 'italic'], 
  subsets: ['latin'], 
  display: 'swap', 
});

export default function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}