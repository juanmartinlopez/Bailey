import { FiPhone } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";
import bailey from "../../DB/Bailey";

function Footer() {
  return (
    <footer className="bg-secundary-red h-[10vh] text-white flex items-center">
      <div className="container mx-auto px-4 text-center flex flex-row justify-around">
        <a
          href={bailey.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl"
        >
          Bailey's Burger
        </a>
        <div className="flex justify-end flex-col">
          <a
            href={`https://wa.me/${bailey.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center mb-1"
          >
            <FiPhone className="mr-2" />
            <p className="text-sm">+{bailey.phone}</p>
          </a>

          <a
            href={bailey.addressMap}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <LuMapPin className="" />
            <p className="text-sm w-9/12">{bailey.address}</p>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
