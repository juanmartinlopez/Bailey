import burger1 from "@assets/burger1.png";
import burger2 from "@assets/burger2.png";
import burger3 from "@assets/burger3.png";
import burger4 from "@assets/burger4.png";

interface BurgerItem {
  id: number;
  name: string;
  description: string;
  priceSimple: number;
  priceDoble: number;
  priceTriple: number;
}

interface PachataItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface FriesItem {
  id: number;
  name: string;
  price: number;
}

type Item = BurgerItem | PachataItem | FriesItem;
type Category = "burgers" | "pachata" | "fries";

interface CardProps {
  item: Item;
  category: Category;
}

function Card({ item, category }: CardProps) {
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
      return "🍔";
    } else if (category === "pachata") {
      return "🥙";
    } else {
      return "🍟";
    }
  };

  const renderPrice = () => {
    if (category === "burgers") {
      const burger = item as BurgerItem;
      return (
        <div className="mt-3 space-y-1">
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
      const simpleItem = item as PachataItem | FriesItem;
      return (
        <div className="mt-3">
          <p className="text-sm text-text-light">
            <span className="font-medium">Precio:</span> ${simpleItem.price}
          </p>
        </div>
      );
    }
  };

  const itemImage = getItemImage();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="flex p-4">
        {/* Imagen */}
        <div className="w-20 h-20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
          {itemImage ? (
            <img
              src={itemImage}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-3xl">
              {getImagePlaceholder()}
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-dark mb-2">
            {item.name}
          </h3>

          {"description" in item && (
            <p className="text-sm text-text-light leading-relaxed mb-2">
              {item.description}
            </p>
          )}

          {renderPrice()}
        </div>
      </div>
    </div>
  );
}

export default Card;
