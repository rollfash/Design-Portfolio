import { Layout } from "@/components/layout/Layout";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { HorizontalGallery } from "@/components/ui/HorizontalGallery";
import { Button } from "@/components/ui/button";
import { Signature } from "@/components/ui/Signature";
import { ArrowLeft, ArrowRight } from "lucide-react"; 
import { Link } from "wouter";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useProjects } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { useRef } from "react";

export function Home() {
  const { projects } = useProjects();
  const { t, language, direction } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  
  // Scroll progress for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax for background text
  const bgTextY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  
  // Take featured projects
  const featuredProjects = projects.slice(0, 6); // Take up to 6 for the horizontal scroll
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <Layout>
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[120vh] flex flex-col items-center justify-center pt-20 pb-40 overflow-hidden">
        
        {/* Background Typography - Parallax Layer */}
        <motion.div 
          style={{ y: bgTextY }}
          className="absolute inset-0 z-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden"
        >
           <div className="font-bold text-[15vw] leading-none whitespace-nowrap text-foreground/50">
             {language === 'he' ? "חללי חוויה" : "EXPERIENCE SPACES"}
           </div>
           <div className="font-bold text-[15vw] leading-none whitespace-nowrap text-foreground/50 ml-[20vw]">
             {language === 'he' ? "תערוכות" : "EXHIBITIONS"}
           </div>
        </motion.div>

        {/* Signature Overlay - Draws on Scroll */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
           <Signature 
             progress={smoothProgress} 
             className="w-[80vw] max-w-[600px] text-primary opacity-80 mix-blend-multiply dark:mix-blend-screen" 
           />
        </div>

        <div className="container px-6 max-w-[1920px] z-10 relative flex flex-col items-center mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 relative"
          >
            <div className="relative rounded-full p-[2px] bg-gradient-to-tr from-border via-background to-border shadow-xl">
              <img 
                src="/avatar.jpg" 
                alt={language === 'he' ? "גל שינהורן - פורטרט" : "Gal Shinhorn - Portrait"} 
                className="w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full object-cover border-4 border-background"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-4xl mx-auto mb-20 text-center"
          >
             {/* Dynamic Language Content - Centered Single Block */}
             <div className="text-muted-foreground text-base md:text-xl leading-relaxed space-y-6">
                <p>{t("hero." + language + ".p1")}</p>
                <p>{t("hero." + language + ".p2")}</p>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
             <Link href="/portfolio">
              <Button size="lg" className="rounded-none px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all min-w-[200px]">
                {t("home.hero.cta.portfolio")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-none px-10 py-6 text-lg border-primary/30 hover:bg-secondary hover:text-primary transition-all min-w-[200px]">
                {t("home.hero.cta.contact")}
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator - Positioned absolutely at bottom */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/40 text-sm tracking-[0.2em] uppercase z-20 pointer-events-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          {t("home.scroll")}
        </motion.div>
      </section>

      {/* Horizontal Gallery Section */}
      <HorizontalGallery projects={featuredProjects} />

      {/* Services Preview */}
      <section className="py-24 bg-secondary/30 border-t border-border">
        <div className="container px-6 max-w-[1920px] flex flex-col items-center text-center mx-auto">
           <div className="max-w-3xl mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("home.services.title")}</h2>
             <p className="text-muted-foreground text-lg leading-relaxed mb-8">
               {t("home.services.subtitle")}
             </p>
             <Link href="/services">
               <Button className="gap-2 bg-primary text-primary-foreground">{t("home.services.cta")} <ArrowIcon className="h-4 w-4"/></Button>
             </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
             {[
               { title: t("service.residential.title"), desc: t("service.residential.desc") },
               { title: t("service.set_design.title"), desc: t("service.set_design.desc") },
               { title: t("service.commercial.title"), desc: t("service.commercial.desc") },
               { title: t("service.styling.title"), desc: t("service.styling.desc") }
             ].map((service, i) => (
               <div key={i} className="bg-background p-8 border border-border/60 hover:border-primary/50 transition-all duration-300 group shadow-sm h-full flex flex-col items-center justify-center">
                 <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                 <p className="text-muted-foreground text-sm">{service.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>
    </Layout>
  );
}
