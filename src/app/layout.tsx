import Navbar from "../components/layout/navbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}