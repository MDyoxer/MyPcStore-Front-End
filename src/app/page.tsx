import About from "../components/home/about";
import Footer from "../components/layout/footer";
import TopProducts from "../components/home/topProducts";
import Reviews from "../components/home/reviews";
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
