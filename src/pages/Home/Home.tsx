import { Footer, NavBar } from "@components";
import Cards from "./Cards/Cards";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <Cards />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
