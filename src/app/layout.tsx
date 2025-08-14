import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from 'next/font/google';

const noto_sans = Noto_Sans({
  subsets: ['latin', 'devanagari'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "Ram Avtar (Coding Ram Bharose) - Developer",
  description:
    "Portfolio of Ram Avtar, also known as Coding Ram Bharose — developer, NCC aviation cadet, and tech storyteller.",
  keywords:
    "Ram Avtar, Coding Ram Bharose, developer, NCC cadet, aviation, portfolio, competitive programming, JavaScript, TypeScript, React, Next.js",
  authors: [{ name: "Ram Avtar" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Ram Avtar (Coding Ram Bharose) - Developer & NCC Cadet",
    description:
      "Portfolio of Ram Avtar, also known as Coding Ram Bharose — developer, NCC aviation cadet, and tech storyteller.",
    type: "website",
    url: "https://codingrambharose.me",
  },
  alternates: {
    canonical: "https://codingrambharose.me",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ram Avtar",
              "alternateName": "Coding Ram Bharose",
              "url": "https://codingrambharose.me",
              "sameAs": [
                "https://www.linkedin.com/in/codingrambharose",
                "https://github.com/CodingRamBharose",
                "https://leetcode.com/u/CodingRamBharose/",
                "mailto:codingrambharose@gmail.com"
              ],
              "jobTitle": "Developer",
              "description":
                "Ram Avtar, also known as Coding Ram Bharose, is a developer, NCC aviation cadet, and competitive programmer.",
            }),
          }}
        />
      </head>
      <body className={`font-inter antialiased ${noto_sans.className}`}>
        {children}
      </body>
    </html>
  );
}
  