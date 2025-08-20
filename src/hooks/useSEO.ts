import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

export const useSEO = ({
  title = "Bailey's Burger - Las mejores hamburguesas artesanales de San Juan",
  description = "Bailey's Burger - Hamburguesas artesanales smash, papas fritas y pachatas en San Juan, Argentina. Delivery y takeaway disponible.",
  keywords = "hamburguesas, san juan, argentina, delivery, smash burger, papas fritas, pachatas",
  ogImage = "/logo.png",
  canonical,
}: SEOProps = {}) => {
  useEffect(() => {
    // Actualizar título
    document.title = title;

    // Actualizar o crear meta description
    let metaDescription = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement;
    if (metaDescription) {
      metaDescription.content = description;
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
    }

    // Actualizar o crear meta keywords
    let metaKeywords = document.querySelector(
      'meta[name="keywords"]'
    ) as HTMLMetaElement;
    if (metaKeywords) {
      metaKeywords.content = keywords;
    } else {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      metaKeywords.content = keywords;
      document.head.appendChild(metaKeywords);
    }

    // Actualizar Open Graph title
    let ogTitle = document.querySelector(
      'meta[property="og:title"]'
    ) as HTMLMetaElement;
    if (ogTitle) {
      ogTitle.content = title;
    }

    // Actualizar Open Graph description
    let ogDescription = document.querySelector(
      'meta[property="og:description"]'
    ) as HTMLMetaElement;
    if (ogDescription) {
      ogDescription.content = description;
    }

    // Actualizar Open Graph image
    let ogImageMeta = document.querySelector(
      'meta[property="og:image"]'
    ) as HTMLMetaElement;
    if (ogImageMeta) {
      ogImageMeta.content = ogImage;
    }

    // Actualizar Twitter title
    let twitterTitle = document.querySelector(
      'meta[property="twitter:title"]'
    ) as HTMLMetaElement;
    if (twitterTitle) {
      twitterTitle.content = title;
    }

    // Actualizar Twitter description
    let twitterDescription = document.querySelector(
      'meta[property="twitter:description"]'
    ) as HTMLMetaElement;
    if (twitterDescription) {
      twitterDescription.content = description;
    }

    // Canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = canonical;
      } else {
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        canonicalLink.href = canonical;
        document.head.appendChild(canonicalLink);
      }
    }
  }, [title, description, keywords, ogImage, canonical]);
};
