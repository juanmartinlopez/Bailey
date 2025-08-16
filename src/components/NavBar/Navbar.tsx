import { HiOutlineShoppingCart } from "react-icons/hi";

function NavBar() {
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-red rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">
            B's
          </div>
          <h2 className="text-2xl font-bold text-text-dark">Bailey's Burger</h2>
        </div>
        <div className="text-primary-red text-3xl cursor-pointer hover:text-red-700 transition-colors">
          <HiOutlineShoppingCart />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
