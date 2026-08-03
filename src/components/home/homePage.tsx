"use client"

import { useCallback, useState } from "react"
import TopProducts from "./topProducts"
import About from "./about"
import Reviews from "./reviews"
import Footer from "../layout/footer"
import Loading from "../ui/loading"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const handleLoaded = useCallback(() => setLoading(false), [])

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {loading && <Loading />}
      <TopProducts onLoaded={handleLoaded} />
      <About />
      <Reviews />
      <Footer />
    </div>
  )
}
