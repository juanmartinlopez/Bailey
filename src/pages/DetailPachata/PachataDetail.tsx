import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Footer } from "../../components";
import NavBarSecundary from "../../components/NavBarSecundary/NavBarSecundary";
import { useCartContext } from "../../context";
import addons from "../../DB/Addons";
import pachatas from "../../DB/Pachata";
import { useSEO } from "../../hooks";
import type { Pachata } from "../../types";

function PachataDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [pachata, setPachata] = useState<Pachata | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<{
    [key: number]: boolean;
  }>({});
  const [comment, setComment] = useState<string>("");

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

  // SEO dinámico basado en la pachata
  useSEO({
    title: pachata
      ? `${pachata.name} - Pachatas Bailey's Burger San Juan`
      : "Pachatas - Bailey's Burger",
    description: pachata
      ? `${pachata.description} Deliciosas pachatas en Bailey's Burger, San Juan. Delivery y takeaway disponible. $${pachata.price}.`
      : "Pachatas deliciosas y frescas en Bailey's Burger, San Juan.",
    keywords: pachata
      ? `${pachata.name}, pachatas san juan, delivery pachatas, baileys burger, comida arabe san juan`
      : "pachatas, san juan, delivery",
    canonical: `https://baileysburger.com/pachata/${id}`,
  });

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

  const handleAddToCart = async () => {
    if (!pachata) return;

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
      id: `pachata-${pachata.id}-${Date.now()}`, // ID único
      type: "pachata" as const,
      product: pachata,
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
      text: `${pachata.name} ha sido agregado al carrito`,
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

  if (!pachata) {
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
        <div className="w-full">
          {/* H1 oculto para SEO complementario al título visible de la pachata */}
          <h1 className="sr-only">
            Pachatas artesanales – Pedido online Bailey's Burger San Juan
          </h1>
          <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col gap-6">
              {/* Información del producto */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {pachata.name}
                </h1>
                <p className="text-secundary-red text-sm md:text-base mb-6">
                  {pachata.description}
                </p>
                {/* Comentario especial */}
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                    Comentario especial
                  </h2>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="¿Alguna especificación especial? (ej: sin lechuga, sin tomate, etc.)"
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-50 transition-colors resize-none min-h-[120px] md:min-h-[140px]"
                  />
                </div>

                {/* Botón agregar al carrito */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="bg-secundary-red text-white px-6 py-4 rounded-lg font-medium hover:bg-primary-red transition-colors w-full md:w-auto text-center space-y-1"
                  >
                    <p>Agregar al carrito</p>
                    <p className="font-semibold">${getCurrentPrice()}</p>
                  </button>
                </div>
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

export default PachataDetail;
