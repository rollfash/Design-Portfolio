import { Layout } from "@/components/layout/Layout";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import { Button } from "@/components/ui/button";
import { Signature } from "@/components/ui/Signature";
import { ArrowLeft, ArrowRight } from "lucide-react"; 
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useProjects } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { getFeaturedProjects } from "@/lib/project-utils";
import { useMemo } from "react";
import { useSEO } from "@/lib/seo";

export function Home() {
  const { projects } = useProjects();
  const { t, language, direction } = useLanguage();
  const featuredProjects = useMemo(() => getFeaturedProjects(projects, 6), [projects]);
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  useSEO({
    title: language === 'he' 
      ? 'גל שינהורן | מעצב הפקה וארט דיירקטור | עיצוב סטים ותערוכות'
      : 'Gal Shinhorn | Production Designer & Art Director | Set Design',
    description: language === 'he'
      ? 'גל שינהורן - מעצב הפקה וארט דיירקטור עם ניסיון של למעלה מ-20 שנה. מתמחה בעיצוב סטים לטלוויזיה, תערוכות וחללי חוויה. הבוגדים, מה קורה פה ועוד.'
      : 'Gal Shinhorn - Production Designer & Art Director with over 20 years of experience. Specializing in TV set design, exhibitions and experiential spaces.',
    image: '/og-image.png',
    type: 'website'
  });

  return (
    <Layout>
      {/* Hero Section - Normal Height */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-20">
        
        {/* Hero Background Treatment */}
        <div className="absolute inset-0 z-0 bg-hero-wash dark:bg-hero-wash-dark opacity-80 pointer-events-none transition-colors duration-500" />
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[hsl(var(--brand-stone))]/5 via-transparent to-[hsl(var(--brand-teal))]/5 pointer-events-none mix-blend-overlay" />

        {/* Background Typography (hidden on mobile) */}
        <div className="absolute inset-0 z-[1] hidden md:flex flex-col items-center justify-center pointer-events-none select-none opacity-[0.04] overflow-hidden">
          <div className="font-bold text-[15vw] leading-none whitespace-nowrap text-foreground/50">
            {language === 'he' ? "חללי חוויה" : "EXPERIENCE SPACES"}
          </div>
          <div className="font-bold text-[15vw] leading-none whitespace-nowrap text-foreground/50 ml-[20vw]">
            {language === 'he' ? "תערוכות" : "EXHIBITIONS"}
          </div>
        </div>

        {/* Signature Overlay - Auto-draws on load (hidden on mobile) */}
        <div className="absolute inset-0 z-[5] hidden md:flex items-center justify-center pointer-events-none">
          <Signature className="w-[90vw] max-w-[900px]" />
        </div>

        {/* Main Hero Content */}
        <div className="w-full flex flex-col items-center justify-center relative z-10">
          <div className="container px-6 max-w-[1920px] relative flex flex-col items-center mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 relative"
            >
              <div className="absolute inset-0 -m-8 rounded-full bg-[hsl(var(--brand-stone))] blur-3xl opacity-20 dark:opacity-10 animate-pulse-slow pointer-events-none" />
              
              <div className="relative rounded-full p-[3px] bg-gradient-to-tr from-[hsl(var(--brand-stone))] via-background to-[hsl(var(--brand-olive))] shadow-xl">
                <img 
                  src="/avatar.jpg" 
                  alt={language === 'he' ? "גל שינהורן - פורטרט" : "Gal Shinhorn - Portrait"} 
                  className="w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full object-cover border-4 border-background/90 select-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-4xl mx-auto mb-20 text-center"
            >
              <div className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                <p>
                  {language === 'he' 
                    ? "סטודיו גל שינהורן הוא משרד עיצוב המתמחה בחללים ייצוגיים, חללי חוויה ותערוכות. אנחנו פועלים כבר למעלה מ-20 שנה ועזרנו ללקוחות רבים ליצור חללים, במות וסטים עוצמתיים ומשפיעים."
                    : "Gal Shinhorn Studio is a design firm that specializes in representative spaces, experience spaces, and exhibitions. We've been in business for over 20 years and have helped many clients create powerful and impactful spaces, stages and sets."}
                </p>
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
        </div>

        {/* Scroll indicator - Positioned absolutely at bottom */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/40 text-sm tracking-[0.2em] uppercase z-30 pointer-events-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          {t("home.scroll")}
        </motion.div>
      </section>

      {/* Project Gallery */}
      <ProjectGallery projects={featuredProjects} />

      {/* Services Preview */}
      <section className="py-16 bg-secondary/30 border-t border-border">
        <div className="container px-6 max-w-[1920px] flex flex-col items-center text-center mx-auto">
           <div className="max-w-3xl mb-12">
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
               { title: t("service.set_design.title"), desc: t("service.set_design.desc") },
               { title: t("service.museum.title"), desc: t("service.museum.desc") },
               { title: t("service.stage.title"), desc: t("service.stage.desc") },
               { title: t("service.exhibitions.title"), desc: t("service.exhibitions.desc") }
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
