import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";

const WHATSAPP_NUMBER = "972544545646";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border" aria-label={t("footer.contact")}>
      <div className="container mx-auto px-6 max-w-[1920px] flex flex-col items-center text-center">
        
        <p className="text-3xl font-bold mb-4 text-primary">Gal Shinhorn</p>
        <p className="text-muted-foreground max-w-sm mb-12">
          {t("footer.tagline")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl mb-16">
          <div>
            <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-primary">{t("footer.menu")}</h4>
            <ul className="space-y-3">
              <li><Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.portfolio")}</Link></li>
              <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.services")}</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.blog")}</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-primary">{t("footer.contact")}</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="mailto:galart1@gmail.com" className="hover:text-primary transition-colors">galart1@gmail.com</a></li>
              <li><a href="tel:054-454-5646" dir="ltr" className="hover:text-primary transition-colors inline-block">054-454-5646</a></li>
              <li>Tel Aviv, Israel</li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
             <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-primary">{t("footer.social")}</h4>
             <div className="flex gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-sm" data-testid="link-whatsapp" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/gs_design.studio/" target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full hover:bg-[#E4405F] hover:text-white transition-all duration-300 shadow-sm" data-testid="link-instagram" aria-label="Instagram">
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=100065451461120" target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm" data-testid="link-facebook" aria-label="Facebook">
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="w-full border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground max-w-4xl">
          <p>© {new Date().getFullYear()} Gal Shinhorn. {t("footer.rights")}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-primary">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
