import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "framer-motion";
import { type Project } from "@/lib/project-context";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface HorizontalGalleryProps {
  projects: Project[];
}

// Define varied layout styles for a collage feel
// Mobile: Uniform card sizes for horizontal scroll
// Desktop: Varied layout for visual interest
const LAYOUT_CONFIG = [
  // 0: Large Hero Center
  {
    widthMd: 50,
    container: "w-[75vw] md:w-[50vw] h-[50vh] md:h-[75vh] mt-0 z-10 flex-shrink-0",
    card: "shadow-xl border-primary/20",
    parallax: 0
  },
  // 1: Small Top Offset
  {
    widthMd: 20,
    container: "w-[75vw] md:w-[20vw] h-[50vh] md:h-[35vh] md:-mt-[40vh] z-0 opacity-90 md:grayscale-[30%] md:hover:grayscale-0 flex-shrink-0",
    card: "shadow-md border-border",
    parallax: 50
  },
  // 2: Medium Bottom Offset
  {
    widthMd: 25,
    container: "w-[75vw] md:w-[25vw] h-[50vh] md:h-[45vh] md:mt-[30vh] md:-ml-[5vw] z-20 flex-shrink-0",
    card: "shadow-lg border-border",
    parallax: -30
  },
  // 3: Tall Portrait
  {
    widthMd: 22,
    container: "w-[75vw] md:w-[22vw] h-[50vh] md:h-[65vh] md:ml-[5vw] z-10 flex-shrink-0",
    card: "shadow-lg border-border",
    parallax: 20
  },
  // 4: Small Bottom Far
  {
    widthMd: 18,
    container: "w-[75vw] md:w-[18vw] h-[50vh] md:h-[30vh] md:mt-[40vh] z-0 md:opacity-80 flex-shrink-0",
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"] 
  });

  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Smooth out the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 200 });

  // Debug toggle
  const DEBUG = false;

  // Measure actual content width to prevent overshoot
  useEffect(() => {
    const updateScrollRange = () => {
      if (scrollContainerRef.current) {
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        // Use the sticky parent's width (viewport) to calculate overflow
        const viewportWidth = scrollContainerRef.current.parentElement?.clientWidth || window.innerWidth;
        // The max scroll distance is total width - visible width
        const maxScroll = Math.max(0, scrollWidth - viewportWidth);
        setScrollRange(maxScroll);

        if (DEBUG) {
          console.log("[HorizontalGallery] Measurement:", {
            scrollWidth,
            viewportWidth,
            maxScroll,
            container: scrollContainerRef.current
          });
        }
      }
    };

    // Initial check
    updateScrollRange();
    
    // Check after a short delay to allow layout to settle
    const timer = setTimeout(updateScrollRange, 500);

    // Use ResizeObserver for robust updates
    const observer = new ResizeObserver(() => {
      updateScrollRange();
    });

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }
    
    // Also observe the parent to catch viewport changes
    if (scrollContainerRef.current?.parentElement) {
      observer.observe(scrollContainerRef.current.parentElement);
    }

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [projects]);

  // Transform raw pixels to percentage of scroll width for RTL support?
  // Actually, we can just translate by pixels directly
  const x = useTransform(
    smoothProgress, 
    [0, 1], 
    ["0px", isRTL ? `${scrollRange}px` : `-${scrollRange}px`]
  );

  return (
    <section ref={targetRef} className="relative h-auto md:h-[400vh]">
      {/* Enhanced Depth Overlay for Collage Section */}
      <div className="absolute inset-0 z-0 pointer-events-none hidden md:block" 
           style={{ 
             background: `radial-gradient(circle at 50% 50%, transparent 10%, hsla(var(--foreground) / 0.08) 100%)`,
           }}
      />
      
      <div className="md:sticky md:top-0 flex flex-col md:flex-row h-auto md:h-screen items-start md:items-center overflow-x-auto md:overflow-hidden">
        
        {/* Header - Mobile visible, Desktop positioned */}
        <div className="w-full px-4 py-8 md:hidden">
           <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">{t("home.featured.title")}</h2>
           <div className="h-[2px] w-12 bg-primary/50"></div>
        </div>
        
        {/* Header - Desktop Fixed Position */}
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
          ref={scrollContainerRef}
          style={{ x }} 
          className={cn(
            "flex items-center pl-[10vw] h-full w-max",
            "md:flex",
            "max-md:!transform-none max-md:overflow-x-auto max-md:h-auto max-md:flex max-md:flex-row max-md:w-full max-md:px-4 max-md:py-12 max-md:gap-4 max-md:pl-4"
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
                style={cn(layoutStyle.container, "mx-4 md:mx-8 last:mr-[10vw]")} // Add margin to last item only
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
