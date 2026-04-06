import { FiPhone } from "react-icons/fi";
import { LuMapPin } from "react-icons/lu";
import bailey from "../../DB/Bailey";
import branches from "../../DB/Branches";

function Footer() {
  return (
    <footer className="bg-secundary-red text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y Instagram */}
          <div className="flex flex-col items-center">
            <a
              href={bailey.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold"
            >
              Bailey's Burger
            </a>
          </div>

          {/* Teléfono */}
          <div className="flex flex-col items-center">
            <a
              href={`https://wa.me/${bailey.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <FiPhone className="mr-2" />
              <p className="text-sm">+{bailey.phone}</p>
            </a>
          </div>

          {/* Sucursales y direcciones */}
          <div className="flex flex-col items-center gap-2">
            {branches.map((branch) => (
              <a
                key={branch.id}
                href={`https://www.google.com/maps?q=${branch.lat},${branch.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:underline"
              >
                <LuMapPin className="mr-1 flex-shrink-0" />
                <p className="text-sm">{branch.address}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-6 pt-4 text-center text-sm text-white/70">
          <p>&copy; 2026 Bailey's Burger. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
