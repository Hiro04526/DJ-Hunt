import localFont from "next/font/local"
import { Raleway } from "next/font/google"

// Kenyan Coffee from local .ttf files
export const kenyanCoffee = localFont({
  src: [
    {
      path: "../public/fonts/kenyan-coffee-rg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/kenyan-coffee-bd.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-primary",
})

// Raleway from Google Fonts
export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-secondary",
})