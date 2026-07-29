import About from "../components/home/About";
import Footer from "../components/layout/footer";
import TopProducts from "../components/home/TopProducts";
import Reviews from "../components/home/Reviews";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <TopProducts/>
      <About />
      <Reviews />
      <Footer/>
    </div>
  );
}
