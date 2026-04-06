import { useEffect, useRef, useState } from "react";
import { MdLocationOn, MdStorefront } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { PiShoppingCartLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useCartContext } from "../../context";
import { useBranch } from "../../hooks";

function NavBar() {
  const { cart, getTotalItems } = useCartContext();
  const { branches, selectedBranch, distanceFromUserKm, changeBranch } =
    useBranch();
  const totalItems = getTotalItems();
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(false);
  const branchMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        branchMenuRef.current &&
        !branchMenuRef.current.contains(event.target as Node)
      ) {
        setIsBranchMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBranchChange = async (branchId: string) => {
    const nextBranch = branches.find((branch) => branch.id === branchId);
    if (!nextBranch) return;

    const changed = await changeBranch(nextBranch, cart);
    if (!changed) {
      return;
    }

    setIsBranchMenuOpen(false);
  };

  return (
    <nav className="bg-primary-white h-[10vh] flex flex-row items-center">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center mr-4">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <h2 className="text-2xl font-bold text-gray-800 ml-2">
            Bailey's Burger
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-2 mr-4 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-red">
            <MdStorefront className="text-lg" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-wide text-gray-500">
              Sucursal
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {selectedBranch.name}
            </span>
          </div>
          {distanceFromUserKm !== null && (
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-full px-2 py-1">
              <MdLocationOn className="text-primary-red" />
              {distanceFromUserKm.toFixed(1)} km
            </span>
          )}
        </div>

        <div
          ref={branchMenuRef}
          className="relative flex items-center mr-2 md:mr-4"
        >
          <button
            type="button"
            onClick={() => setIsBranchMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-gray-400 transition-colors"
            aria-label="Seleccionar sucursal"
            aria-haspopup="listbox"
            aria-expanded={isBranchMenuOpen}
          >
            <MdStorefront className="text-primary-red" />
            <span className="text-xs md:text-sm font-medium text-gray-800 max-w-[120px] md:max-w-[180px] truncate">
              {selectedBranch.name}
            </span>
            <IoChevronDown
              className={`text-gray-500 transition-transform ${
                isBranchMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isBranchMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-40">
              <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-gray-500 border-b border-gray-100">
                Elegi tu sucursal
              </div>
              <ul role="listbox" aria-label="Opciones de sucursal" className="py-1">
                {branches.map((branch) => {
                  const isActive = branch.id === selectedBranch.id;

                  return (
                    <li key={branch.id}>
                      <button
                        type="button"
                        onClick={() => handleBranchChange(branch.id)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-primary-red/10 text-primary-red font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        role="option"
                        aria-selected={isActive}
                      >
                        {branch.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
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
