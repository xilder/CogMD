import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import type React from 'react';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CognitoMD - PLAB Exam Study Platform',
  description:
    'Free medical exam study app for international medical graduates preparing for PLAB',
  generator: 'v0.app',
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <QueryClientProvider client={queryClient}>
        <body className={`${montserrat.className} font-sans antialiased`}>
          {children}
          <Analytics />
        </body>
      </QueryClientProvider>
    </html>
  );
}
