import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Hiro Ishikawa's Portfolio",
  description: "Explore Hiro's work, skills, and side projects.",
  metadataBase: new URL('https://hiro-ishikawa-portfolio.vercel.app'),
  icons: {
    icon: '/assets/favicon.ico',
  },
  openGraph: {
    title: "Hiro Ishikawa's Portfolio",
    description: "Explore Hiro's work, skills, and side projects.",
    url: "https://hiro-ishikawa-portfolio.vercel.app",
    siteName: "Hiro Ishikawa's Portfolio",
    images: [
      {
        url: "/assets/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Hiro Ishikawa's Portfolio",
      },
    ],
    type: "website",
  },
  themeColor: "#9457EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <main>{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
