import { PiHamburgerFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { Footer, NavBar } from "../../components";
import { useSEO } from "../../hooks";

function Error() {
  const navigate = useNavigate();

  // SEO para página de error
  useSEO({
    title: "Página no encontrada - Bailey's Burger",
    description:
      "Lo sentimos, la página que buscas no existe. Regresa al inicio para ver nuestro menú de hamburguesas artesanales en Bailey's Burger.",
    keywords: "error 404, pagina no encontrada, baileys burger",
    canonical: "https://baileysburger.com/404",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <NavBar />

      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-md">
          {/* Error Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-secundary-red mb-4 animate-bounce">
              404
            </h1>
            <div className="w-24 h-1 bg-secundary-red mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              ¡Ups! Página no encontrada
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Lo sentimos, pero la página que estás buscando no existe o ha sido
              movida. Verifica la URL o regresa al inicio.
            </p>
          </div>

          {/* Burger Icon */}
          <div className="mb-8 flex justify-center">
            <div className="text-6xl animate-pulse text-secundary-red ">
              <PiHamburgerFill />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary-red hover:bg-secundary-red text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Error;
