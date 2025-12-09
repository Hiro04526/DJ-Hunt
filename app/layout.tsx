import {kenyanCoffee, raleway} from "@/lib/fonts"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Green Giant FM",
  description: "DLSU Radio: Green Giant FM (GGFM) is De La Salle University-Manila's Official Radio Station, located and broadcasting live at Br. Bloemen Hall!",
  metadataBase: new URL("https://dj-hunt-gilt.vercel.app/"),
  icons: { icon: "/assets/favicon.ico" },
  openGraph: {
    title: "Green Giant FM",
    description: "DLSU Radio: Green Giant FM (GGFM) is De La Salle University-Manila's Official Radio Station, located and broadcasting live at Br. Bloemen Hall!",
    url: "https://dj-hunt-gilt.vercel.app/",
    siteName: "Green Giant FM",
    images: [{ url: "/assets/Raffy.png", width: 1200, height: 630, alt: "Green Giant FM" }],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${kenyanCoffee.variable} ${raleway.variable}`}
    >
      <head>
        <meta name="theme-color" content="#569429" />
      </head>
      <body className="font-primary">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
