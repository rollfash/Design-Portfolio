import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen text-foreground flex flex-col font-sans overflow-x-hidden max-w-[100vw]">
      <Navbar />
      <main className="flex-grow pt-24 overflow-x-hidden">
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
    </div>
  );
}
