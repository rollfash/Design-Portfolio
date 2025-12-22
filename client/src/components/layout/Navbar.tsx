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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { language, setLanguage, t } = useLanguage();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
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

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/portfolio", label: t("nav.portfolio") },
    { href: "/services", label: t("nav.services") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-border py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 max-w-[1920px] flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold tracking-tight z-50 relative">
            Gal Shinhorn
          </a>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <a
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary/70 relative group",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full",
                   language === 'he' ? "right-0" : "left-0",
                   location === link.href ? "w-full" : ""
                )} />
              </a>
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
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 md:hidden"
            >
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="text-2xl font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              
              <div className="flex gap-4 mt-4">
                 <Button variant="outline" onClick={toggleLanguage}>
                    {language === 'he' ? 'Switch to English' : 'עבור לעברית'}
                 </Button>
                 <Button variant="outline" onClick={toggleTheme}>
                   {theme === 'light' ? t("nav.mode.dark") : t("nav.mode.light")}
                 </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
