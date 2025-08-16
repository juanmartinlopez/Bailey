import { HiOutlineShoppingCart } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function NavBarSecundary() {
  const navigate = useNavigate();
  return (
    <nav className="bg-primary-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-cente">
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
        <div className="text-gray text-3xl cursor-pointer hover:text-dark transition-colors">
          <HiOutlineShoppingCart />
        </div>
      </div>
    </nav>
  );
}

export default NavBarSecundary;
