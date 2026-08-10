import "./globals.css";
import Navbar from "../components/layout/navbar";
import { Bebas_Neue } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/cartContext";
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
        <AuthProvider>
          <CartProvider>
          <Navbar />
          {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}