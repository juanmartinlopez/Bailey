import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  customBreadcrumbs?: BreadcrumbItem[];
}

export function Breadcrumbs({ customBreadcrumbs }: BreadcrumbsProps) {
  const location = useLocation();

  const breadcrumbs = useMemo(() => {
    if (customBreadcrumbs) return customBreadcrumbs;

    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbItems: BreadcrumbItem[] = [{ label: "Inicio", path: "/" }];

    let currentPath = "";

    pathnames.forEach((name) => {
      currentPath += `/${name}`;

      let label = name.charAt(0).toUpperCase() + name.slice(1);

      // Mapear rutas específicas a nombres más amigables
      switch (name) {
        case "burger":
          label = "Hamburguesas";
          break;
        case "fries":
          label = "Papas Fritas";
          break;
        case "pachata":
          label = "Pachatas";
          break;
        case "cart":
          label = "Carrito";
          break;
        case "checkout":
          label = "Checkout";
          break;
        default:
          // Si es un ID numérico, usar "Producto"
          if (/^\d+$/.test(name)) {
            label = "Producto";
          }
      }

      breadcrumbItems.push({
        label,
        path: currentPath,
      });
    });

    return breadcrumbItems;
  }, [location.pathname, customBreadcrumbs]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="bg-gray-50 px-4 py-3 text-sm">
      <div className="container mx-auto">
        <ol className="flex items-center space-x-2">
          {breadcrumbs.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-500 font-medium">{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className="text-secundary-red hover:text-primary-red transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
