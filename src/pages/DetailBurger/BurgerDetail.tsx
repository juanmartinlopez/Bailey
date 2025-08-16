import burger1 from "@assets/burger1.png";
import burger2 from "@assets/burger2.png";
import burger3 from "@assets/burger3.png";
import burger4 from "@assets/burger4.png";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../components";
import NavBarSecundary from "../../components/NavBarSecundary/NavBarSecundary";
import addons from "../../DB/Addons";
import burgers from "../../DB/Burger";
import type { Burger } from "../../types";

function BurgerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [burger, setBurger] = useState<Burger | null>(null);
  const [selectedSize, setSelectedSize] = useState<
    "Simple" | "Doble" | "Triple"
  >("Simple");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (id) {
      const burgerId = parseInt(id);
      const foundBurger = burgers[burgerId as keyof typeof burgers];
      if (foundBurger) {
        setBurger(foundBurger);
      } else {
        // Si no encuentra la hamburguesa, redirigir al home
        navigate("/");
      }
    }
  }, [id, navigate]);

  const getBurgerImage = () => {
    if (!burger) return burger1;
    const images = [burger1, burger2, burger3, burger4];
    return images[(burger.id - 1) % images.length];
  };

  const getCurrentPrice = () => {
    if (!burger) return 0;
    let basePrice = 0;
    switch (selectedSize) {
      case "Simple":
        basePrice = burger.priceSimple;
        break;
      case "Doble":
        basePrice = burger.priceDoble;
        break;
      case "Triple":
        basePrice = burger.priceTriple;
        break;
      default:
        basePrice = burger.priceSimple;
    }

    // Agregar precio de los agregados seleccionados
    const addonsPrice = Object.entries(selectedAddons)
      .filter(([_, isSelected]) => isSelected)
      .reduce((total, [addonId, _]) => {
        const addon = addons[parseInt(addonId) as keyof typeof addons];
        return total + (addon ? addon.price : 0);
      }, 0);

    return basePrice + addonsPrice;
  };

  const handleAddonChange = (addonId: number) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  const handleAddToCart = () => {
    // Obtener los agregados seleccionados con sus detalles
    const selectedAddonsList = Object.entries(selectedAddons)
      .filter(([_, isSelected]) => isSelected)
      .map(([addonId, _]) => {
        const addon = addons[parseInt(addonId) as keyof typeof addons];
        return addon;
      })
      .filter(Boolean);

    console.log("Agregado al carrito:", {
      burger,
      size: selectedSize,
      quantity,
      addons: selectedAddonsList,
      totalPrice: getCurrentPrice() * quantity,
    });
  };

  if (!burger) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <NavBarSecundary />

      {/* Content */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="md:flex md:gap-8">
            {/* Imagen de la hamburguesa */}
            <div className="w-full md:w-1/2 h-80 md:h-96 bg-gray-900 flex items-center justify-center">
              <img
                src={getBurgerImage()}
                alt={burger.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Información del producto */}
            <div className="p-6 md:w-1/2 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {burger.name}
              </h1>
              <p className="text-primary-secundary text-sm md:text-base mb-6">
                {burger.description}
              </p>

              {/* Agregados */}
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Agregados
                </h2>
                <div className="space-y-3">
                  {Object.values(addons).map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">
                          {addon.name}
                        </span>
                        <span className="text-sm text-primary-secundary font-semibold">
                          ${addon.price}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedAddons[addon.id] || false}
                          onChange={() => handleAddonChange(addon.id)}
                          className="appearance-none w-5 h-5 border-2 border-gray-300 rounded bg-white checked:bg-primary-red checked:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-50 transition-colors cursor-pointer"
                        />
                        {selectedAddons[addon.id] && (
                          <svg
                            className="absolute top-0.5 left-0.5 w-3 h-3 text-white pointer-events-none"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Elegir tamaño */}
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Elegir tamaño
                </h2>
                <div className="flex gap-3 justify-around">
                  <button
                    onClick={() => setSelectedSize("Simple")}
                    className={`px-6 py-2 rounded-full border-2 transition-colors ${
                      selectedSize === "Simple"
                        ? "border-primary-red text-primary-red bg-red-50"
                        : "border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setSelectedSize("Doble")}
                    className={`px-6 py-2 rounded-full border-2 transition-colors ${
                      selectedSize === "Doble"
                        ? "border-primary-red text-primary-red bg-red-50"
                        : "border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    Doble
                  </button>
                  <button
                    onClick={() => setSelectedSize("Triple")}
                    className={`px-6 py-2 rounded-full border-2 transition-colors ${
                      selectedSize === "Triple"
                        ? "border-primary-red text-primary-red bg-red-50"
                        : "border-gray-300 text-gray-700 bg-white"
                    }`}
                  >
                    Triple
                  </button>
                </div>
              </div>

              {/* Controles de cantidad y botón */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-primary-red text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-secundary transition-colors w-full sm:w-auto"
                >
                  <p>Agregar al carrito</p>
                  <p>${getCurrentPrice() * quantity}</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default BurgerDetail;
