import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "framer-motion";
import { Project } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface HorizontalGalleryProps {
  projects: Project[];
}

// Define varied layout styles for a collage feel
// Storing widths as numbers for calculation (vw units)
const LAYOUT_CONFIG = [
  // 0: Large Hero Center
  {
    widthMd: 50, // 50vw
    container: "w-[85vw] md:w-[50vw] h-[60vh] md:h-[75vh] mt-0 z-10",
    card: "shadow-xl border-primary/20",
    parallax: 0
  },
  // 1: Small Top Offset
  {
    widthMd: 20, // 20vw
    container: "w-[50vw] md:w-[20vw] h-[30vh] md:h-[35vh] -mt-[30vh] md:-mt-[40vh] z-0 opacity-90 grayscale-[30%] hover:grayscale-0",
    card: "shadow-md border-border",
    parallax: 50
  },
  // 2: Medium Bottom Offset
  {
    widthMd: 25, // 25vw
    container: "w-[60vw] md:w-[25vw] h-[40vh] md:h-[45vh] mt-[25vh] md:mt-[30vh] -ml-[10vw] md:-ml-[5vw] z-20",
    card: "shadow-lg border-border",
    parallax: -30
  },
  // 3: Tall Portrait
  {
    widthMd: 22, // 22vw
    container: "w-[55vw] md:w-[22vw] h-[55vh] md:h-[65vh] mt-0 md:ml-[5vw] z-10",
    card: "shadow-lg border-border",
    parallax: 20
  },
  // 4: Small Bottom Far
  {
    widthMd: 18, // 18vw
    container: "w-[45vw] md:w-[18vw] h-[25vh] md:h-[30vh] mt-[40vh] z-0 opacity-80",
    card: "shadow-sm border-border",
    parallax: -60
  }
];

function ParallaxItem({ 
  children, 
  style, 
  parallax, 
  x 
}: { 
  children: React.ReactNode, 
  style?: string, 
  parallax: number, 
  x: MotionValue<string> 
}) {
  return (
    <div className={cn("relative flex-shrink-0 transition-transform duration-700 ease-out", style)}>
      {children}
    </div>
  );
}

export function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"] 
  });

  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 200 });

  // Calculate total width of all items + gaps for accurate scrolling
  // We sum the widths defined in LAYOUT_CONFIG for the current items
  const totalItemsWidth = projects.reduce((acc, _, i) => {
    const config = LAYOUT_CONFIG[i % LAYOUT_CONFIG.length];
    return acc + config.widthMd;
  }, 0);

  // Add margins: mx-8 (4rem) per item. 
  // On a 1440px screen, 4rem is approx 4.5vw. Let's estimate 5vw per gap to be safe.
  const totalGapWidth = projects.length * 5; 
  
  // Add padding: pl-[10vw] + pr-[10vw] = 20vw
  const paddingWidth = 20;

  const totalContentWidth = totalItemsWidth + totalGapWidth + paddingWidth;
  
  // The amount we need to scroll is the overflow width (Total - Viewport)
  // If content fits (Total < 100), we don't scroll (max(0, ...))
  const scrollRange = Math.max(0, totalContentWidth - 100);
  
  const x = useTransform(smoothProgress, [0, 1], ["0%", isRTL ? `${scrollRange}%` : `-${scrollRange}%`]);

  return (
    <section ref={targetRef} className="relative h-[400vh]">
      {/* Enhanced Depth Overlay for Collage Section */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
           style={{ 
             background: `radial-gradient(circle at 50% 50%, transparent 10%, hsla(var(--foreground) / 0.08) 100%)`,
           }}
      />
      
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Header - Fixed Position */}
        <div className="absolute top-12 left-12 z-20 hidden md:block">
           <div className="text-start">
             <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">{t("home.featured.title")}</h2>
             <div className="h-[2px] w-12 bg-primary/50"></div>
           </div>
        </div>

        {/* Counter */}
        <div className="absolute top-12 right-12 z-20 hidden md:flex items-center gap-4">
           <span className="text-sm font-mono text-muted-foreground">01</span>
           <div className="w-24 h-[1px] bg-border relative">
             <motion.div 
               className="absolute top-0 left-0 bottom-0 bg-primary" 
               style={{ width: "100%", scaleX: smoothProgress, transformOrigin: "0%" }}
             />
           </div>
           <span className="text-sm font-mono text-muted-foreground">{String(projects.length).padStart(2, '0')}</span>
        </div>

        <motion.div 
          style={{ x }} 
          className={cn(
            "flex items-center pl-[10vw] pr-[10vw] h-full",
            // Mobile: Disable transform, use native scroll
            "max-md:!transform-none max-md:overflow-x-auto max-md:h-auto max-md:block max-md:whitespace-nowrap max-md:w-full max-md:px-6 max-md:py-24 max-md:absolute max-md:inset-0"
          )}
        >
          {projects.map((project, i) => {
             const layoutStyle = LAYOUT_CONFIG[i % LAYOUT_CONFIG.length];
             const localizedProject = {
                ...project,
                title: language === 'en' && project.titleEn ? project.titleEn : project.title,
                category: language === 'en' && project.categoryEn ? project.categoryEn : project.category,
              };

            return (
              <ParallaxItem 
                key={project.id} 
                style={cn(layoutStyle.container, "mx-4 md:mx-8")} // Add horizontal spacing between items
                parallax={layoutStyle.parallax}
                x={x}
              >
                <div className={cn("w-full h-full relative group bg-card overflow-hidden transition-all duration-700", layoutStyle.card)}>
                   <ProjectCard
                     {...localizedProject}
                     // Fix "square after picture" issue by removing mb-4 and aspect ratio constraints from inner div
                     className="w-full h-full [&>div]:h-full [&>div]:mb-0 [&>div]:aspect-auto [&>div>img]:scale-100 [&>div>img]:group-hover:scale-105"
                   />
                </div>
              </ParallaxItem>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
