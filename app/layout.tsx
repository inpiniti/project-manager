import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "프로젝트 매니저 - 개발 프로젝트 통합 관리 시스템",
    template: "%s | 프로젝트 매니저"
  },
  description: "화면, API, DB, SQL, Hook, Query, Store, Util 등 개발 프로젝트의 모든 리소스를 체계적으로 관리하는 웹 기반 관리 시스템입니다.",
  keywords: ["프로젝트 관리", "개발 도구", "리소스 관리", "API 관리", "데이터베이스 관리", "개발자 도구"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "Your Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "프로젝트 매니저 - 개발 프로젝트 통합 관리 시스템",
    description: "화면, API, DB, SQL, Hook, Query, Store, Util 등 개발 프로젝트의 모든 리소스를 체계적으로 관리하세요.",
    url: '/',
    siteName: '프로젝트 매니저',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '프로젝트 매니저',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "프로젝트 매니저",
    description: "개발 프로젝트의 모든 리소스를 체계적으로 관리하세요",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
