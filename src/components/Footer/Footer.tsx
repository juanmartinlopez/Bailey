import { FiPhone } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";

function Footer() {
  return (
    <footer className="bg-secundary-red text-white py-6">
      <div className="container mx-auto px-4 text-center flex flex-row justify-around">
        <h2 className="text-xl mb-2">Bailey's Burger</h2>
        <div>
          <div className="flex items-center justify-center mb-1">
            <FiPhone className="mr-2" />
            <p className="text-sm">264 484-2028</p>
          </div>
          <div className="flex items-center justify-center">
            <LuMapPin className="mr-2" />
            <p className="text-sm">San Juan, Argentina</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
