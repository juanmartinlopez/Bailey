import burger1 from "@assets/burger1.png";
import burger2 from "@assets/burger2.png";
import burger3 from "@assets/burger3.png";
import burger4 from "@assets/burger4.png";
import { CiFries } from "react-icons/ci";
import { GiSandwich } from "react-icons/gi";
import { PiHamburgerFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import type { Burger, Fries, Pachata } from "../../../types";

type Item = Burger | Pachata | Fries;
type Category = "burgers" | "pachata" | "fries";

interface CardProps {
  item: Item;
  category: Category;
}

function Card({ item, category }: CardProps) {
  const navigate = useNavigate();

  // Función para manejar el click en la carta
  const handleCardClick = () => {
    switch (category) {
      case "burgers":
        navigate(`/burger/${item.id}`);
        break;
      case "pachata":
        navigate(`/pachata/${item.id}`);
        break;
      case "fries":
        navigate(`/fries/${item.id}`);
        break;
      default:
        break;
    }
  };

  // Función para obtener la imagen según el ID del item
  const getItemImage = () => {
    if (category === "burgers") {
      const images = [burger1, burger2, burger3, burger4];
      return images[(item.id - 1) % images.length];
    }
    return null;
  };

  // Placeholder para imagen - puedes reemplazar con imágenes reales
  const getImagePlaceholder = () => {
    if (category === "burgers") {
      return <PiHamburgerFill />;
    } else if (category === "pachata") {
      return <GiSandwich />;
    } else {
      return <CiFries />;
    }
  };

  const renderPrice = () => {
    if (category === "burgers") {
      const burger = item as Burger;
      return (
        <div className="mt-3 space-y-1 flex flex-row justify-around">
          <p className="text-sm text-text-light">
            <span className="font-medium">Simple:</span> ${burger.priceSimple}
          </p>
          <p className="text-sm text-text-light">
            <span className="font-medium">Doble:</span> ${burger.priceDoble}
          </p>
          <p className="text-sm text-text-light">
            <span className="font-medium">Triple:</span> ${burger.priceTriple}
          </p>
        </div>
      );
    } else {
      const simpleItem = item as Pachata | Fries;
      return (
        <div className="mt-3 pl-2">
          <p className="text-sm text-text-light">
            <span className="font-medium">Precio:</span> ${simpleItem.price}
          </p>
        </div>
      );
    }
  };

  const itemImage = getItemImage();

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md shadow-gray-400 hover:shadow-xl transition-shadow duration-200 overflow-hidden m-3 cursor-pointer"
    >
      <div className="flex p-4">
        {/* Imagen
        
          {itemImage ? (
            <img
              src={itemImage}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br rounded-lg flex items-center justify-center text-3xl text-primary-red">
            {getImagePlaceholder()}
          </div>
        </div>
          )}
         */}

        {/* Contenido */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-dark mb-2">
            {item.name}
          </h3>

          {"description" in item && (
            <p className="text-sm text-primary-red leading-relaxed mb-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
      {renderPrice()}
    </div>
  );
}

export default Card;
