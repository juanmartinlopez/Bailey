import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, NavBarSecundary } from "../../components";
import { useCartContext } from "../../context";
import drinks from "../../DB/Drink";
import type { CartDrinkItem } from "../../types";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartContext();

  // Estado para las cantidades de bebidas
  const [drinkQuantities, setDrinkQuantities] = useState<
    Record<number, number>
  >({});

  // Inicializar las cantidades de bebidas basándose en el carrito actual
  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    cart.forEach((item) => {
      if (item.type === "drink") {
        const drinkId = parseInt(item.id.replace("drink-", ""));
        initialQuantities[drinkId] = item.quantity;
      }
    });
    setDrinkQuantities(initialQuantities);
  }, [cart]);

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
  };

  const handleDrinkQuantityChange = (drinkId: number, change: number) => {
    const currentQuantity = drinkQuantities[drinkId] || 0;
    const newQuantity = Math.max(0, currentQuantity + change);

    setDrinkQuantities((prev) => ({
      ...prev,
      [drinkId]: newQuantity,
    }));

    // Si la cantidad es mayor a 0, agregamos o actualizamos en el carrito
    if (newQuantity > 0) {
      const drink = drinks[drinkId as keyof typeof drinks];
      const cartItem: CartDrinkItem = {
        id: `drink-${drinkId}`,
        type: "drink",
        product: drink,
        quantity: newQuantity,
        comment: "",
        addons: [],
        totalPrice: drink.price * newQuantity,
      };

      // Verificar si ya existe en el carrito y actualizar o agregar
      const existingItem = cart.find((item) => item.id === `drink-${drinkId}`);
      if (existingItem) {
        // Remover el item existente y agregar el actualizado
        removeFromCart(`drink-${drinkId}`);
        addToCart(cartItem);
      } else {
        addToCart(cartItem);
      }
    } else {
      // Si la cantidad es 0, remover del carrito
      removeFromCart(`drink-${drinkId}`);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white">
        <NavBarSecundary />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-6">
              ¡Agrega algunos productos deliciosos!
            </p>
            <a
              href="/"
              className="bg-primary-red text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Ir al menú
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <NavBarSecundary />
      <div className="min-h-[80vh] bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between flex-col items-start mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Mi Carrito ({getTotalItems()}{" "}
                {getTotalItems() === 1 ? "producto" : "productos"})
              </h1>
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.product.name}
                        {item.type === "burger" && ` (${item.size})`}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.type === "burger" && item.product.description}
                        {item.type === "fries" &&
                          "Deliciosas papas fritas crujientes"}
                        {item.type === "pachata" && item.product.description}
                        {item.type === "drink" && "Bebida refrescante"}
                      </p>

                      {item.addons.length > 0 && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Agregados:{" "}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.addons.map((addon) => addon.name).join(", ")}
                          </span>
                        </div>
                      )}

                      {item.comment && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Comentario:{" "}
                          </span>
                          <span className="text-sm text-gray-600 italic">
                            "{item.comment}"
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Cantidad: {item.quantity}
                        </span>
                        <span className="text-lg font-bold text-primary-red">
                          ${item.totalPrice}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sección de Bebidas */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Agregar Bebidas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(drinks).map((drink) => (
                  <div
                    key={drink.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {drink.name}
                        </h3>
                        <p className="text-lg font-bold text-primary-red">
                          ${drink.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleDrinkQuantityChange(drink.id, -1)
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          disabled={!drinkQuantities[drink.id]}
                        >
                          <span className="text-gray-600 font-bold">-</span>
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {drinkQuantities[drink.id] || 0}
                        </span>
                        <button
                          onClick={() => handleDrinkQuantityChange(drink.id, 1)}
                          className="w-8 h-8 rounded-full bg-primary-red hover:bg-red-700 flex items-center justify-center transition-colors"
                        >
                          <span className="text-white font-bold">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">
                  Total: ${getTotalPrice()}
                </span>
                <button
                  onClick={handleCheckout}
                  className="bg-primary-red text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Finalizar Compra
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

export default Cart;
