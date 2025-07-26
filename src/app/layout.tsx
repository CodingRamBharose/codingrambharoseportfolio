import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans } from 'next/font/google';


const noto_sans = Noto_Sans({
  subsets: ['latin', 'devanagari'], // Added 'devanagari' for Hindi
  weight: ['400', '700'], // Added weights you might need
});

export const metadata: Metadata = {
  title: "From Fields to Frameworks - My Journey",
  description: "A cinematic portfolio showcasing my journey from village fields to coding excellence, NCC aviation experience, and academic achievements.",
  keywords: "portfolio, developer, MERN stack, NCC, aviation, coding journey, village to tech",
  authors: [{ name: "Your Name" }],
   icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "From Fields to Frameworks - My Journey",
    description: "A cinematic portfolio showcasing my journey from village fields to coding excellence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-inter antialiased ${noto_sans.className}`}>
        {children}
      </body>
    </html>
  );
}
