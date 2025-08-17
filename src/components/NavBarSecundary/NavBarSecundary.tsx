import { PiShoppingCartLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context";

function NavBarSecundary() {
  const navigate = useNavigate();
  const { getTotalItems } = useCartContext();
  const totalItems = getTotalItems();

  return (
    <nav className="bg-primary-white h-[10vh] flex flex-row items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center mr-10">
          <button onClick={() => navigate("/")} className="p-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 ml-2">
            Bailey's Burger
          </h2>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="relative text-gray text-3xl cursor-pointer hover:text-dark transition-colors"
        >
          <PiShoppingCartLight />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-red text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default NavBarSecundary;
