import { useEffect } from 'react';
import { useLanguage } from './language-context';
import { useLocation } from 'wouter';

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

const BASE_URL = typeof window !== 'undefined' 
  ? window.location.origin 
  : 'https://gal-shinhorn-portfolio.replit.app';

export function useSEO(meta: PageMeta) {
  const { language } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${location}`;
    const alternateUrl = `${BASE_URL}${location}`;
    const lang = language === 'he' ? 'he_IL' : 'en_US';
    const alternateLang = language === 'he' ? 'en_US' : 'he_IL';

    // Update title
    document.title = meta.title;

    // Helper to update or create meta tag
    const updateMeta = (selector: string, content: string, attribute: string = 'content') => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const selectorParts = selector.match(/\[(.+?)=['"](.+?)['"]\]/);
        if (selectorParts) {
          element.setAttribute(selectorParts[1], selectorParts[2]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Update or create link tag
    const updateLink = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang 
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let element = document.querySelector(selector) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        if (hreflang) element.hreflang = hreflang;
        document.head.appendChild(element);
      }
      element.href = href;
    };

    // Standard meta tags
    updateMeta('meta[name="description"]', meta.description);
    updateMeta('meta[name="robots"]', meta.noindex ? 'noindex, nofollow' : 'index, follow');

    // Canonical URL
    updateLink('canonical', canonicalUrl);

    // Hreflang tags
    updateLink('alternate', canonicalUrl, language);
    updateLink('alternate', alternateUrl, language === 'he' ? 'en' : 'he');

    // Open Graph
    updateMeta('meta[property="og:title"]', meta.title);
    updateMeta('meta[property="og:description"]', meta.description);
    updateMeta('meta[property="og:url"]', canonicalUrl);
    updateMeta('meta[property="og:locale"]', lang);
    updateMeta('meta[property="og:locale:alternate"]', alternateLang);
    updateMeta('meta[property="og:type"]', meta.type || 'website');
    if (meta.image) {
      const imageUrl = meta.image.startsWith('http') ? meta.image : `${BASE_URL}${meta.image}`;
      updateMeta('meta[property="og:image"]', imageUrl);
    }

    // Twitter Card
    updateMeta('meta[name="twitter:title"]', meta.title);
    updateMeta('meta[name="twitter:description"]', meta.description);
    if (meta.image) {
      const imageUrl = meta.image.startsWith('http') ? meta.image : `${BASE_URL}${meta.image}`;
      updateMeta('meta[name="twitter:image"]', imageUrl);
    }
  }, [meta, language, location]);
}

// JSON-LD structured data generators
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "גל שינהורן",
    "alternateName": "Gal Shinhorn",
    "jobTitle": "Production Designer & Art Director",
    "description": "מעצב הפקה וארט דיירקטור עם ניסיון של למעלה מ-20 שנה בעיצוב סטים לטלוויזיה, תערוכות וחללי חוויה",
    "url": BASE_URL,
    "sameAs": [],
    "knowsAbout": ["Set Design", "Production Design", "Art Direction", "Exhibition Design", "Interior Design", "TV Set Design"],
    "worksFor": {
      "@type": "Organization",
      "name": "Gal Shinhorn Studio"
    }
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "Gal Shinhorn Studio",
    "alternateName": "סטודיו גל שינהורן",
    "description": "Production design studio specializing in set design, exhibitions, and experiential spaces",
    "url": BASE_URL,
    "telephone": "+972544545646",
    "email": "galart1@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IL",
      "addressLocality": "Tel Aviv"
    },
    "founder": {
      "@type": "Person",
      "name": "Gal Shinhorn"
    },
    "knowsAbout": ["Set Design", "Production Design", "Art Direction", "Exhibition Design", "Interior Design"],
    "areaServed": {
      "@type": "Country",
      "name": "Israel"
    }
  };
}

export function generateProjectSchema(project: any, language: 'he' | 'en') {
  const title = language === 'en' && project.titleEn ? project.titleEn : project.title;
  const description = language === 'en' && project.descriptionEn ? project.descriptionEn : project.description;
  const location = language === 'en' && project.locationEn ? project.locationEn : project.location;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": title,
    "description": description,
    "creator": {
      "@type": "Person",
      "name": "Gal Shinhorn"
    },
    "dateCreated": project.year,
    "image": project.image?.startsWith('http') ? project.image : `${BASE_URL}${project.image}`,
    "locationCreated": {
      "@type": "Place",
      "name": location
    },
    "workExample": project.gallery?.map((img: string) => ({
      "@type": "ImageObject",
      "contentUrl": img.startsWith('http') ? img : `${BASE_URL}${img}`
    })) || []
  };
}

export function JSONLDScript({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Alt text generator helper
export function generateAltText(
  context: 'project-card' | 'project-detail' | 'hero' | 'gallery',
  title: string,
  index?: number,
  language: 'he' | 'en' = 'he'
): string {
  switch (context) {
    case 'project-card':
      return language === 'he' 
        ? `תמונה מייצגת של פרויקט ${title}`
        : `Cover image of ${title} project`;
    case 'project-detail':
      return language === 'he'
        ? `תמונה ${index ? index + 1 : ''} מפרויקט ${title}`
        : `Image ${index ? index + 1 : ''} from ${title} project`;
    case 'hero':
      return language === 'he'
        ? `גל שינהורן - מעצב הפקה וארט דיירקטור`
        : `Gal Shinhorn - Production Designer & Art Director`;
    case 'gallery':
      return language === 'he'
        ? `תמונת גלריה ${index ? index + 1 : ''} - ${title}`
        : `Gallery image ${index ? index + 1 : ''} - ${title}`;
    default:
      return title;
  }
}
