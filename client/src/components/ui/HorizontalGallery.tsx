import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Project } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface HorizontalGalleryProps {
  projects: Project[];
}

export function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // "start end": when top of element hits bottom of viewport (starts entering)
    // "end end": when bottom of element hits bottom of viewport
    // but for sticky pinning, we usually want "start start" (top hits top)
    // until "end end" (bottom hits bottom, but since height is large, it scrolls internally)
    offset: ["start start", "end end"] 
  });

  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { damping: 50, stiffness: 400 });

  // Map progress (0 to 1) to horizontal movement.
  // We want to scroll until the last item is fully visible.
  // A safe way is to move almost the entire width of the track minus the viewport width.
  // In RTL, we move positive X. In LTR, we move negative X.
  // Since we don't calculate exact pixels here, we use a percentage estimate.
  // For 6 items, width is roughly 6 * 600px + gaps ~= 4000px.
  // Screen is ~1920px or less. Movement needed is ~2000px+.
  // Let's approximate based on item count.
  const scrollRange = (projects.length * 40); // e.g. 6 items -> 240% shift
  
  const x = useTransform(smoothProgress, [0, 1], ["0%", isRTL ? `${scrollRange}%` : `-${scrollRange}%`]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Header - Fixed Position inside the sticky container */}
        <div className="absolute top-8 left-0 right-0 z-10 flex justify-center">
           <div className="text-center bg-background/90 backdrop-blur-md px-8 py-3 rounded-full border border-border shadow-sm">
             <h2 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-primary">{t("home.featured.title")}</h2>
           </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
           <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/70 animate-pulse bg-background/50 px-4 py-1 rounded-full">
             {t("home.scroll")}
           </span>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-border/20 z-20">
          <motion.div 
            className="h-full bg-primary"
            style={{ scaleX: smoothProgress, transformOrigin: isRTL ? "100%" : "0%" }}
          />
        </div>

        <motion.div 
          style={{ x }} 
          className={cn(
            "flex gap-8 md:gap-16 px-[5vw] w-max items-center",
            // Mobile: Disable transform, use native scroll
            "max-md:!transform-none max-md:overflow-x-auto max-md:h-auto max-md:block max-md:whitespace-nowrap max-md:w-full max-md:px-6 max-md:py-24 max-md:absolute max-md:inset-0"
          )}
        >
          {/* Intro Text / Start Spacer */}
          <div className="w-[20vw] shrink-0 max-md:hidden" />

          {projects.map((project, i) => {
             const localizedProject = {
                ...project,
                title: language === 'en' && project.titleEn ? project.titleEn : project.title,
                category: language === 'en' && project.categoryEn ? project.categoryEn : project.category,
              };

            return (
              <div 
                key={project.id} 
                className="relative w-[85vw] md:w-[600px] h-[50vh] md:h-[65vh] flex-shrink-0 max-md:inline-block max-md:mr-4 max-md:w-[85vw] group transition-all duration-500"
              >
                <div className="w-full h-full relative overflow-hidden bg-card border border-border/50 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:border-primary/30">
                   <ProjectCard
                     {...localizedProject}
                     className="w-full h-full [&>div]:h-full [&>div>img]:scale-100 [&>div>img]:group-hover:scale-105"
                   />
                </div>
                
                {/* Number indicator */}
                <div className="absolute -top-12 md:-top-16 left-0 text-6xl md:text-8xl font-bold text-border/20 select-none font-mono group-hover:text-primary/10 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            );
          })}
          
          {/* End Spacer */}
          <div className="w-[20vw] shrink-0 max-md:hidden" />
        </motion.div>
      </div>
    </section>
  );
}
