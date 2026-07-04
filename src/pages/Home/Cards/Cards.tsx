import { useEffect, useMemo, useState } from "react";
import { CiFries } from "react-icons/ci";
import { GiSandwich } from "react-icons/gi";
import { PiHamburgerFill } from "react-icons/pi";
import burgers from "../../../DB/Burger";
import fries from "../../../DB/Fries";
import pachata from "../../../DB/Pachata";
import { useBranch } from "../../../hooks";
import Card from "../Card/Card";

type Category = "burgers" | "pachata" | "fries";

function Cards() {
  const { selectedBranch } = useBranch();
  const [selectedCategory, setSelectedCategory] = useState<Category>("burgers");

  const availableCategories = useMemo(() => {
    const categories: Category[] = [];
    if (selectedBranch.availableProducts.burger) categories.push("burgers");
    if (selectedBranch.availableProducts.pachata) categories.push("pachata");
    if (selectedBranch.availableProducts.fries) categories.push("fries");
    return categories;
  }, [selectedBranch.availableProducts]);

  useEffect(() => {
    if (availableCategories.length === 0) return;
    if (!availableCategories.includes(selectedCategory)) {
      setSelectedCategory(availableCategories[0]);
    }
  }, [availableCategories, selectedCategory]);

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

  if (availableCategories.length === 0) {
    return (
      <div className="w-full mb-8 text-center py-16">
        <p className="text-lg text-gray-700 font-medium">
          No hay productos disponibles en esta sucursal por el momento.
        </p>
      </div>
    );
  }

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
        {availableCategories.map((category) => (
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
