import { useState } from "react";
import { CiFries } from "react-icons/ci";
import { GiSandwich } from "react-icons/gi";
import { PiHamburgerFill } from "react-icons/pi";
import burgers from "../../../DB/Burger";
import fries from "../../../DB/Fries";
import pachata from "../../../DB/Pachata";
import Card from "../Card/Card";

type Category = "burgers" | "pachata" | "fries";

function Cards() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("burgers");

  const getItemsForCategory = () => {
    switch (selectedCategory) {
      case "burgers":
        return Object.values(burgers);
      case "pachata":
        return Object.values(pachata);
      case "fries":
        return Object.values(fries);
      default:
        return [];
    }
  };

  const items = getItemsForCategory();

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case "burgers":
        return <PiHamburgerFill />;
      case "pachata":
        return <GiSandwich />;
      case "fries":
        return <CiFries />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: Category) => {
    switch (category) {
      case "burgers":
        return "Hamburguesas";
      case "pachata":
        return "Pachata";
      case "fries":
        return "Papas Fritas";
      default:
        return "";
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Navegación de categorías */}
      <div className="flex justify-center gap-8">
        {(["burgers", "pachata", "fries"] as Category[]).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex flex-col items-center p-4 rounded-lg transition-all duration-200 ${
              selectedCategory === category
                ? "text-secundary-red "
                : "text-text-dark"
            }`}
          >
            <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
            <span className="font-medium text-sm">
              {getCategoryLabel(category)}
            </span>
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} item={item} category={selectedCategory} />
        ))}
      </div>
    </div>
  );
}

export default Cards;
