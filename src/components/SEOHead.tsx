import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "TechnSat chez Wassim - Premium IPTV Services & Android TV Boxes in Tunisia",
  description = "TechnSat chez Wassim offers premium IPTV streaming services and high-quality Android TV boxes in Tunisia. Get access to international channels, 4K streaming, and reliable customer support.",
  keywords = "IPTV Tunisia, Android TV Box Tunisia, TechnSat, Wassim, streaming services, 4K IPTV, premium IPTV, international channels",
  image = "https://i.postimg.cc/prMmry13/506597284-710079311885276-7394493161693276837-n.jpg",
  url = "https://wassimtechtn.netlify.app"
}) => {
  React.useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', image);
    }
    
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', url);
    }
  }, [title, description, keywords, image, url]);

  return null;
};

export default SEOHead;