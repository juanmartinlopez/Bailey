import { PiShoppingCartLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCartContext } from "../../context";

function NavBar() {
  const { getTotalItems } = useCartContext();
  const totalItems = getTotalItems();

  return (
    <nav className="bg-primary-white h-[10vh] flex flex-row items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center mr-10">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h2 className="text-2xl font-bold text-gray-800 ml-2">
            Bailey's Burger
          </h2>
        </div>

        {/* Ícono del carrito como Link */}
        <Link
          to="/cart"
          className="relative text-gray text-3xl cursor-pointer hover:text-dark transition-colors"
        >
          <PiShoppingCartLight />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary-red text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
