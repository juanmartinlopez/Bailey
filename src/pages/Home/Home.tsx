// Update the import path below if your components are in a different folder, e.g. "../../components"
import { Footer, NavBar } from "../../components";
import { useSEO } from "../../hooks";
import Cards from "./Cards/Cards";

function Home() {
  useSEO({
    title: "Bailey's Burger - Las mejores hamburguesas artesanales de San Juan",
    description:
      "Descubre las hamburguesas smash más deliciosas de San Juan. Bailey's Burger ofrece hamburguesas artesanales, papas fritas crujientes y pachatas. Delivery y takeaway disponible.",
    keywords:
      "hamburguesas san juan, smash burger argentina, delivery hamburguesas, baileys burger, comida rapida san juan, hamburguesas artesanales",
    canonical: "https://baileysburger.com/",
  });

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto min-h-[80vh]">
        <Cards />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
