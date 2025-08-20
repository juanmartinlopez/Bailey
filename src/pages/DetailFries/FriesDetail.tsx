import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Footer } from "../../components";
import NavBarSecundary from "../../components/NavBarSecundary/NavBarSecundary";
import { useCartContext } from "../../context";
import addons from "../../DB/Addons";
import fries from "../../DB/Fries";
import { useSEO } from "../../hooks";
import type { Fries } from "../../types";

function FriesDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [friesItem, setFriesItem] = useState<Fries | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: number]: boolean;
  }>({});
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (id) {
      const friesId = parseInt(id);
      const foundFries = fries[friesId as keyof typeof fries];
      if (foundFries) {
        setFriesItem(foundFries);
      } else {
        // Si no encuentra las papas fritas, redirigir al home
        navigate("/");
      }
    }
  }, [id, navigate]);

  // SEO dinámico basado en las papas fritas
  useSEO({
    title: friesItem
      ? `${friesItem.name} - Papas Fritas Bailey's Burger San Juan`
      : "Papas Fritas - Bailey's Burger",
    description: friesItem
      ? `Deliciosas papas fritas ${friesItem.name} en Bailey's Burger, San Juan. Crujientes y perfectas para acompañar. Delivery y takeaway. $${friesItem.price}.`
      : "Papas fritas crujientes y deliciosas en Bailey's Burger, San Juan.",
    keywords: friesItem
      ? `${friesItem.name}, papas fritas san juan, papas crujientes, delivery papas, baileys burger`
      : "papas fritas, san juan, delivery",
    canonical: `https://baileysburger.com/fries/${id}`,
  });

  const getCurrentPrice = () => {
    if (!friesItem) return 0;

    // Agregar precio de los agregados seleccionados
    const addonsPrice = Object.entries(selectedAddons)
      .filter(([_, isSelected]) => isSelected)
      .reduce((total, [addonId, _]) => {
        const addon = addons[parseInt(addonId) as keyof typeof addons];
        return total + (addon ? addon.price : 0);
      }, 0);

    return friesItem.price + addonsPrice;
  };

  const handleAddToCart = async () => {
    if (!friesItem) return;

    // Obtener los agregados seleccionados con sus detalles
    const selectedAddonsList = Object.entries(selectedAddons)
      .filter(([_, isSelected]) => isSelected)
      .map(([addonId, _]) => {
        const addon = addons[parseInt(addonId) as keyof typeof addons];
        return addon;
      })
      .filter(Boolean);

    // Crear el item del carrito
    const cartItem = {
      id: `fries-${friesItem.id}-${Date.now()}`, // ID único
      type: "fries" as const,
      product: friesItem,
      quantity: 1,
      comment: comment,
      addons: selectedAddonsList,
      totalPrice: getCurrentPrice(),
    };

    // Agregar al carrito
    addToCart(cartItem);

    // Limpiar el formulario después de agregar al carrito
    setComment("");
    setSelectedAddons({});

    console.log("Agregado al carrito:", cartItem);

    // Mostrar alerta personalizada con SweetAlert2
    const result = await Swal.fire({
      title: "¡Producto agregado!",
      text: `${friesItem.name} ha sido agregado al carrito`,
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Ir al carrito",
      cancelButtonText: "Seguir comprando",
      confirmButtonColor: "#dc2626", // color rojo acorde a primary-red
      cancelButtonColor: "#6b7280", // color gris
      background: "#ffffff",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-gray-900 font-bold",
        confirmButton: "font-medium px-6 py-2 rounded-lg",
        cancelButton: "font-medium px-6 py-2 rounded-lg",
      },
      buttonsStyling: true,
    });

    if (result.isConfirmed) {
      // Ir al carrito
      navigate("/cart");
    } else if (result.isDismissed) {
      // Seguir comprando - redirigir al home
      navigate("/");
    }
  };

  if (!friesItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <NavBarSecundary />

      {/* Content */}
      <div className="bg-white min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          <div className="md:flex md:gap-8 rounded-3xl">
            {/* Imagen de las papas */}
            {/* <div className="w-full md:w-1/2 h-80 md:h-96 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center md:rounded-3xl">
              <div className="text-9xl">🍟</div>
            </div> */}

            {/* Información del producto */}
            <div className="p-6 md:w-1/2 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {friesItem.name}
              </h1>
              <p className="text-secundary-red text-sm md:text-base mb-6">
                Papas fritas crujientes
              </p>

              {/* Comentario especial */}
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Comentario especial
                </h2>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="¿Alguna especificación especial? (ej: sin sal, papas bien doradas, etc.)"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-50 transition-colors resize-none"
                  rows={3}
                />
              </div>

              {/* Botón agregar al carrito */}
              <div className="flex justify-end">
                <button
                  onClick={handleAddToCart}
                  className="bg-secundary-red text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-red transition-colors w-full sm:w-auto"
                >
                  <p>Agregar al carrito</p>
                  <p>${getCurrentPrice()}</p>
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

export default FriesDetail;
