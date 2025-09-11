import localFont from "next/font/local"
import { Raleway } from "next/font/google"

// Kenyan Coffee from local .otf files
export const kenyanCoffee = localFont({
  src: [
    {
      path: "../public/fonts/KenyanCoffee-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/KenyanCoffee-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-primary",
})

// Raleway from Google Fonts
export const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-secondary",
})