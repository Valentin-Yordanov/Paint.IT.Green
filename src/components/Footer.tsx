import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  const footerLinks = {
    platform: [
      { label: t('nav.learn'), href: "/learn" },
      { label: t('nav.compete'), href: "/compete" },
      { label: t('nav.community'), href: "/community" },
    ],
    resources: [
      { label: t('footer.aboutUs'), href: "/about" },
      { label: t('footer.contact'), href: "/contact" },
      { label: t('footer.faq'), href: "/faq" },
    ],
    legal: [
      { label: t('footer.privacy'), href: "/privacy" },
      { label: t('footer.terms'), href: "/terms" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Mail, href: "#", label: "Email" },
  ];

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-0">
          
          {/* Group 1: Brand Section */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <img 
                src="/pig-logo.png" 
                alt="PIG Logo" 
                className="h-8 w-8 object-contain rounded-full" 
              />
              <span className="text-xl font-bold text-foreground">{t('Paint IT Green')}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <social.icon className="h-4 w-4 text-primary" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer for PC */}
          <div className="hidden md:block md:col-span-1" />

          {/* Group 2: Links with mobile T-divider and PC vertical dividers */}
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 relative">
            
            {/* Horizontal Mobile Divider (Top) */}
            <div className="absolute top-0 left-4 right-4 h-px bg-border/50 md:hidden" />
            
            {/* Vertical Mobile Divider (Middle) */}
            <div className="absolute top-0 bottom-[35%] left-1/2 w-px bg-border/50 md:hidden -translate-x-1/2" />
            
            {/* Horizontal Mobile Divider (Bottom) */}
            <div className="absolute bottom-[35%] left-1/4 right-1/4 h-px bg-border/50 md:hidden" />

            {/* Platform Links */}
            <div className="text-center md:text-left pt-8 md:pt-0 md:px-8">
              <h3 className="font-semibold mb-4">{t('footer.platform')}</h3>
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="text-center md:text-left pt-8 md:pt-0 md:px-8 md:border-l border-border/50">
              <h3 className="font-semibold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="col-span-2 md:col-span-1 text-center md:text-left pt-12 md:pt-0 md:px-8 md:border-l border-border/50 mt-8 md:mt-0">
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="border-t border-border">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground text-center md:text-left">
            <p>© {new Date().getFullYear()}. {t('footer.rights')}</p>
            <p>{t('footer.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;