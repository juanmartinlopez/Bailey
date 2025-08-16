// Update the import path below if your components are in a different folder, e.g. "../../components"
import { Footer, NavBar } from "../../components";
import Cards from "./Cards/Cards";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <div className="container mx-auto">
        <Cards />
      </div>
      <Footer />
    </div>
  );
}

export default Home;
