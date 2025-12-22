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
const LAYOUT_STYLES = [
  // 0: Large Hero Center
  {
    container: "w-[85vw] md:w-[50vw] h-[60vh] md:h-[75vh] mt-0 z-10",
    card: "shadow-xl border-primary/20",
    label: "top-[-3rem] left-0 text-lg md:text-xl font-bold tracking-widest",
    parallax: 0
  },
  // 1: Small Top Offset
  {
    container: "w-[50vw] md:w-[20vw] h-[30vh] md:h-[35vh] -mt-[30vh] md:-mt-[40vh] z-0 opacity-90 grayscale-[30%] hover:grayscale-0",
    card: "shadow-md border-border",
    label: "bottom-[-2rem] right-0 text-xs md:text-sm font-medium tracking-wide",
    parallax: 50 // Moves faster/slower
  },
  // 2: Medium Bottom Offset
  {
    container: "w-[60vw] md:w-[25vw] h-[40vh] md:h-[45vh] mt-[25vh] md:mt-[30vh] -ml-[10vw] md:-ml-[5vw] z-20",
    card: "shadow-lg border-border",
    label: "top-[-2rem] left-0 text-sm font-medium tracking-wide",
    parallax: -30
  },
  // 3: Tall Portrait
  {
    container: "w-[55vw] md:w-[22vw] h-[55vh] md:h-[65vh] mt-0 md:ml-[5vw] z-10",
    card: "shadow-lg border-border",
    label: "bottom-[-2rem] left-0 text-sm font-medium tracking-wide",
    parallax: 20
  },
  // 4: Small Bottom Far
  {
    container: "w-[45vw] md:w-[18vw] h-[25vh] md:h-[30vh] mt-[40vh] z-0 opacity-80",
    card: "shadow-sm border-border",
    label: "top-[-2rem] right-0 text-xs font-medium tracking-wide",
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
  // We need to transform the string "X%" into a number to apply parallax math, 
  // but Framer Motion's useTransform handles string interpolation well for direct mapping.
  // For parallax relative to a parent `x` motion value that is a string percentage, it's tricky.
  // Instead, we can apply a simple transform on the X axis *on top* of the parent's layout flow 
  // if we were moving the camera.
  // BUT: The parent container `motion.div` moves. To do parallax, items inside need to move *against* or *with* that movement slightly.
  // A simpler hack for this specific "scroll drives horizontal" setup:
  // Since we don't have a numeric scroll value easily available in the child (it's a string %), 
  // let's just use the style classes for positioning and skip complex nested parallax 
  // unless we pass the raw scrollYProgress.
  
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

  // Calculate total width approximation
  // With varying sizes, we need a rough estimate.
  // A "screen" of collage is roughly 1 large item + surroundings ~= 80vw.
  // Total width ~= (projects.length / 2) * 100vw ?
  // Let's approximate: 6 items in this layout take about 3-4 screens width.
  const scrollRange = (projects.length * 25); 
  
  const x = useTransform(smoothProgress, [0, 1], ["0%", isRTL ? `${scrollRange}%` : `-${scrollRange}%`]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-background">
      {/* Background Pattern - subtle contour/grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, black 1px, transparent 0)`,
             backgroundSize: '40px 40px' 
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
             const layoutStyle = LAYOUT_STYLES[i % LAYOUT_STYLES.length];
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
                     className="w-full h-full [&>div]:h-full [&>div>img]:scale-100 [&>div>img]:group-hover:scale-105 [&>div]:mb-0 [&_h3]:text-white [&_p]:text-white/80 [&_.bg-black\/20]:opacity-30 group-hover:[&_.bg-black\/20]:opacity-60"
                   />
                   
                   {/* Custom Label/Caption outside the card for collage feel */}
                   <div className={cn("absolute hidden md:block text-primary/80 pointer-events-none whitespace-nowrap", layoutStyle.label)}>
                      {localizedProject.category} <span className="mx-2 opacity-50">/</span> {localizedProject.year}
                   </div>
                </div>
              </ParallaxItem>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
