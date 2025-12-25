import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/portfolio", label: t("nav.portfolio") },
    { href: "/services", label: t("nav.services") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      {/* Mobile Menu - Rendered outside nav for proper positioning */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[100] bg-background flex flex-col items-center justify-center gap-6 md:hidden"
            style={{ position: 'fixed', height: '100vh', width: '100vw' }}
          >
            {/* Close button at top */}
            <button
              className="absolute top-6 right-6 z-[101] p-2"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label={language === 'he' ? 'סגור תפריט' : 'Close menu'}
            >
              <X className="h-6 w-6" />
            </button>
            
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={link.href} 
                  className={cn(
                    "text-2xl font-medium transition-colors",
                    location === link.href ? "text-primary" : "text-foreground"
                  )} 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            
            <div className="flex flex-col gap-3 mt-6 w-64">
               <Button variant="outline" onClick={toggleLanguage} className="w-full">
                  <Globe className="h-4 w-4 mr-2" />
                  {language === 'he' ? 'Switch to English' : 'עבור לעברית'}
               </Button>
               <Button variant="outline" onClick={toggleTheme} className="w-full">
                 {theme === 'light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                 {theme === 'light' ? t("nav.mode.dark") : t("nav.mode.light")}
               </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/80 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
        )}
        aria-label={language === 'he' ? 'ניווט ראשי' : 'Main navigation'}
      >
        <div className="container mx-auto px-6 max-w-[1920px] flex items-center justify-between">
          <Link href="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight">Gal Shinhorn</span>
              <span className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">Production Designer</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={cn(
                    "text-base font-medium transition-colors hover:text-primary/70 relative group",
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  )}>
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full",
                     language === 'he' ? "right-0" : "left-0",
                     location === link.href ? "w-full" : ""
                  )} />
              </Link>
            ))}
            
            <div className="flex items-center gap-2 border-r border-border pr-4 mr-2 rtl:border-l rtl:border-r-0 rtl:pl-4 rtl:ml-2 rtl:pr-0">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={toggleLanguage}
                 className="font-medium text-xs px-2 h-8"
               >
                 <Globe className="h-3 w-3 mr-2 rtl:ml-2 rtl:mr-0" />
                 {language === 'he' ? 'EN' : 'עב'}
               </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-muted"
              aria-label={theme === 'light' ? t("nav.mode.dark") : t("nav.mode.light")}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={language === 'he' ? 'פתח תפריט' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </>
  );
}
