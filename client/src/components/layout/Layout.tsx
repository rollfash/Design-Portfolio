import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AccessibilityMenu } from "@/components/ui/AccessibilityMenu";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useLanguage } from "@/lib/language-context";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen text-foreground flex flex-col font-sans overflow-x-hidden max-w-[100vw]">
      {/* Skip to content link for screen readers */}
      <a href="#main-content" className="skip-link">
        {language === 'he' ? 'דלג לתוכן' : 'Skip to content'}
      </a>
      
      <Navbar />
      <main id="main-content" className="flex-grow pt-24 overflow-x-hidden" tabIndex={-1}>
        {/* Page transition wrapper */}
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="overflow-x-hidden"
        >
          {children}
        </motion.div>
      </main>
      <Footer />
      
      {/* Accessibility Menu */}
      <AccessibilityMenu />
    </div>
  );
}
