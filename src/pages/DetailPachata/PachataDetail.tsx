import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer, NavBarSecundary } from "../../components";
import addons from "../../DB/Addons";
import pachatas from "../../DB/Pachata";
import type { Pachata } from "../../types";

function PachataDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pachata, setPachata] = useState<Pachata | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (id) {
      const pachataId = parseInt(id);
      const foundPachata = pachatas[pachataId as keyof typeof pachatas];
      if (foundPachata) {
        setPachata(foundPachata);
      } else {
        // Si no encuentra la pachata, redirigir al home
        navigate("/");
      }
    }
  }, [id, navigate]);

  const handleAddonChange = (addonId: number) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: !prev[addonId],
    }));
  };

  const getCurrentPrice = () => {
    if (!pachata) return 0;

    // Agregar precio de los agregados seleccionados
    const addonsPrice = Object.entries(selectedAddons)
      .filter(([_, isSelected]) => isSelected)
      .reduce((total, [addonId, _]) => {
        const addon = addons[parseInt(addonId) as keyof typeof addons];
        return total + (addon ? addon.price : 0);
      }, 0);

    return pachata.price + addonsPrice;
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
      pachata,
      quantity,
      addons: selectedAddonsList,
      totalPrice: getCurrentPrice() * quantity,
    });
  };

  if (!pachata) {
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
        {/* Imagen de la pachata */}
        <div className="w-full h-80 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <div className="text-9xl">🥙</div>
        </div>

        {/* Información del producto */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {pachata.name}
          </h1>
          <p className="text-gray-600 text-sm mb-6">{pachata.description}</p>

          {/* Precio */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Precio</h2>
            <p className="text-2xl font-bold text-red-600">${pachata.price}</p>
          </div>

          {/* Agregados */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Agregados
            </h2>
            <div className="space-y-3">
              {Object.values(addons).map((addon) => (
                <label
                  key={addon.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-700">{addon.name}</span>
                    <span className="text-sm text-gray-500">
                      ${addon.price}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAddons[addon.id] || false}
                    onChange={() => handleAddonChange(addon.id)}
                    className="w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Controles de cantidad y botón */}
          <div className="flex items-center justify-between">
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
              className="bg-red-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-800 transition-colors"
            >
              Agregar al carrito - ${getCurrentPrice() * quantity}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PachataDetail;
