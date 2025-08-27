import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Footer, NavBarSecundary } from "../../components";
import { useCartContext } from "../../context";
import bailey from "../../DB/Bailey";
import { useSEO } from "../../hooks";

type DeliveryType = "delivery" | "pickup";
type PaymentMethod = "Mercado Pago" | "Efectivo";

interface DeliveryInfo {
  recipientName: string;
  comment: string;
}

function Checkout() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCartContext();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Mercado Pago");
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    recipientName: "",
    comment: "",
  });

  // SEO para página de checkout
  useSEO({
    title: `Finalizar Pedido - Bailey's Burger San Juan`,
    description:
      "Completa tu pedido en Bailey's Burger. Elige delivery o takeaway, método de pago y finaliza tu compra de hamburguesas artesanales en San Juan.",
    keywords:
      "checkout baileys burger, finalizar pedido, delivery san juan, pago hamburguesas",
    canonical: "https://baileysburger.com/checkout",
  });

  // Redirigir si el carrito queda vacío (evita navegar durante el render)
  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cart.length, navigate]);

  // Al montar la página, forzar scroll al inicio
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  if (cart.length === 0) return null;

  const subtotal = getTotalPrice();

  const total = subtotal;

  const handleDeliveryTypeChange = (type: DeliveryType) => {
    setDeliveryType(type);

    // Mostrar mensaje sobre el precio del envío cuando se selecciona delivery
    if (type === "delivery") {
      Swal.fire({
        title: "Información de Envío",
        text: "El precio final del envío se te informará por WhatsApp según tu ubicación.",
        icon: "info",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#9D1309",
        background: "#ffffff",
        customClass: {
          popup: "swal-popup",
          title: "swal-title",
          htmlContainer: "swal-content",
        },
      });
    }
  };

  const handleDeliveryInfoChange = (
    field: keyof DeliveryInfo,
    value: string
  ) => {
    setDeliveryInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOrderSubmit = () => {
    // Validar que siempre haya un nombre
    if (!deliveryInfo.recipientName) {
      Swal.fire({
        title: "Campo requerido",
        text:
          deliveryType === "delivery"
            ? "Por favor completa el nombre del destinatario"
            : "Por favor completa el nombre de quien retira el pedido",
        icon: "warning",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#9D1309",
      });
      return;
    }

    // Mostrar alerta de finalizando compra
    const deliveryMessage =
      deliveryType === "delivery"
        ? "El precio del envío será enviado por WhatsApp."
        : "";

    Swal.fire({
      title: "Finalizando compra",
      text: deliveryMessage,
      icon: "info",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#9D1309",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceder con el envío del pedido
        processOrder();
      }
    });
  };

  const processOrder = () => {
    // Construir mensaje de WhatsApp
    const lines = cart.map((item) => {
      const baseName = item.product.name;
      const size = item.type === "burger" ? ` ${item.size}` : "";
      const addonsText =
        item.addons.length > 0
          ? ` con agregados: ${item.addons.map((a) => a.name).join(", ")}`
          : " sin agregados";
      const comment = item.comment ? ` (${item.comment})` : "";
      return `- ${baseName}${size}${addonsText}${comment} x${item.quantity}`;
    });

    const addressPart =
      deliveryType === "delivery"
        ? `Envío a domicilio para: ${deliveryInfo.recipientName}\n${
            deliveryInfo.comment ? `Comentarios: ${deliveryInfo.comment}\n` : ""
          }`
        : `Retiro en el local\nA nombre de: ${deliveryInfo.recipientName}\n${
            deliveryInfo.comment ? `Comentarios: ${deliveryInfo.comment}\n` : ""
          }`;

    const total = getTotalPrice();

    const message = `Hola, quiero pedir:\n${lines.join(
      "\n"
    )}\n\n${addressPart}\nMétodo de pago: ${paymentMethod}\nTotal: $${total}`;

    // Número de teléfono del local (formato internacional sin + ni espacios). Ajustar según corresponda.
    const phoneNumber = bailey.phone; // TODO: reemplazar por número real
    //const phoneNumber = 542645704903;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
    clearCart();

    // Mostrar confirmación y luego limpiar carrito
    Swal.fire({
      title: "¡Pedido enviado!",
      text: "Tu pedido ha sido enviado por WhatsApp. Te contactaremos pronto para confirmar los detalles.",
      icon: "success",
      confirmButtonText: "Perfecto",
      confirmButtonColor: "#9D1309",
    }).then(() => {
      // Limpiar carrito y volver al inicio después de cerrar el modal
      navigate("/");
    });
  };

  return (
    <div className="bg-white">
      <NavBarSecundary />
      <div className="container mx-auto min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda - Opciones de entrega */}

            <div className="space-y-6">
              {/* Tipo de entrega */}
              {/* Método de pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Método de pago
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Mercado Pago"
                      checked={paymentMethod === "Mercado Pago"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="w-4 h-4 focus:ring-primary-red accent-primary-red"
                    />
                    <span className="text-lg font-medium text-gray-900">
                      Mercado Pago
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Efectivo"
                      checked={paymentMethod === "Efectivo"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="w-4 h-4 focus:ring-primary-red accent-primary-red"
                    />
                    <span className="text-lg font-medium text-gray-900">
                      Efectivo
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Método de entrega
                </h2>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={deliveryType === "delivery"}
                      onChange={(e) =>
                        handleDeliveryTypeChange(e.target.value as DeliveryType)
                      }
                      className="w-4 h-4 focus:ring-primary-red accent-primary-red"
                    />
                    <span className="text-lg font-medium text-gray-900">
                      Envío a domicilio
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === "pickup"}
                      onChange={(e) =>
                        handleDeliveryTypeChange(e.target.value as DeliveryType)
                      }
                      className="w-4 h-4 focus:ring-primary-red accent-primary-red"
                    />
                    <span className="text-lg font-medium text-gray-900">
                      Retiro en local
                    </span>
                  </label>
                </div>
              </div>

              {/* Formulario para datos del pedido */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {deliveryType === "delivery"
                    ? "Datos del destinatario"
                    : "Datos para retiro"}
                </h2>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {deliveryType === "delivery"
                        ? "Nombre del destinatario *"
                        : "Nombre de quien retira el pedido *"}
                    </label>
                    <input
                      type="text"
                      value={deliveryInfo.recipientName}
                      onChange={(e) =>
                        handleDeliveryInfoChange(
                          "recipientName",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      placeholder="Ej: Juan Pérez"
                      required
                    />
                  </div>

                  {/* Comentarios adicionales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comentarios adicionales (opcional)
                    </label>
                    <textarea
                      value={deliveryInfo.comment}
                      onChange={(e) =>
                        handleDeliveryInfoChange("comment", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                      placeholder="Algún comentario o aclaración..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Resumen del pedido */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Resumen del pedido ({getTotalItems()}{" "}
                  {getTotalItems() === 1 ? "producto" : "productos"})
                </h2>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start border-b border-gray-100 pb-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product.name}
                          {item.type === "burger" && ` (${item.size})`}
                        </h4>

                        {item.addons.length > 0 && (
                          <p className="text-sm text-gray-600">
                            +{" "}
                            {item.addons.map((addon) => addon.name).join(", ")}
                          </p>
                        )}

                        {item.comment && (
                          <p className="text-sm text-gray-600 italic">
                            "{item.comment}"
                          </p>
                        )}

                        <p className="text-sm text-gray-600">
                          Cantidad: {item.quantity}
                        </p>
                      </div>

                      <span className="font-medium text-gray-900">
                        ${item.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    {deliveryType === "delivery" && (
                      <div className="flex justify-between text-gray-600">
                        <span className="text-primary-red">
                          ¡El precio del envío será enviado por WhatsApp!
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal}</span>
                    </div>

                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                </div>

                {/* Botón de realizar pedido */}
                <button
                  onClick={handleOrderSubmit}
                  className="w-full mt-6 bg-secundary-red text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Finalizar y Enviar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
