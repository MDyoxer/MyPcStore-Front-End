import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/layout/navbar";
import { Bebas_Neue } from "next/font/google";
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={bebasNeue.variable}>
      <body className="font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  )
}