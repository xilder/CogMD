import QueryProvider from '@/components/query-provider';
import ModalContextProvider from '@/context/info-modal';
import { Analytics } from '@vercel/analytics/next';
import dotenv from 'dotenv';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import type React from 'react';
import './globals.css';

dotenv.config();
const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CognitoMD - PLAB Exam Study Platform',
  description:
    'Free medical exam study app for international medical doctors preparing for PLAB',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${montserrat.className} font-sans antialiased`}>
        <ModalContextProvider>
          <QueryProvider>{children}</QueryProvider>
        </ModalContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
