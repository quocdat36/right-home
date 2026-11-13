// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['vietnamese', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'RIGHT HOME — Chọn nhà có công thức',
  description:
    'Khám phá nhu cầu sống, xác định ưu tiên và tìm ra những lựa chọn nhà ở phù hợp với khả năng tài chính của bạn.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#173A35',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-[#F2EBDD] text-[#24352F] font-sans antialiased selection:bg-[#173A35] selection:text-[#F2EBDD]">
        {children}
      </body>
    </html>
  );
}