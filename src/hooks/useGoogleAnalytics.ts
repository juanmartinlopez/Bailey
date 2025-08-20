import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Declarar el tipo global para gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  trackingId: string;
}

export const useGoogleAnalytics = ({ trackingId }: GoogleAnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    if (!trackingId) return;

    // Cargar el script de Google Analytics
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Configurar gtag
    window.gtag =
      window.gtag ||
      function (...args) {
        (window.gtag as any).dataLayer = (window.gtag as any).dataLayer || [];
        (window.gtag as any).dataLayer.push(args);
      };

    window.gtag("js", new Date());
    window.gtag("config", trackingId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      // Cleanup si es necesario
      const existingScript = document.querySelector(
        `script[src*="${trackingId}"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [trackingId]);

  // Trackear cambios de página
  useEffect(() => {
    if (window.gtag && trackingId) {
      window.gtag("config", trackingId, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location, trackingId]);
};

// Hook para trackear eventos personalizados
export const useTrackEvent = () => {
  const trackEvent = (
    eventName: string,
    parameters?: { [key: string]: any }
  ) => {
    if (window.gtag) {
      window.gtag("event", eventName, parameters);
    }
  };

  return { trackEvent };
};
