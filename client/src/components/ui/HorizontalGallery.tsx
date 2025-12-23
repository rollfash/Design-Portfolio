import { useRef, useState, useEffect } from "react";
import { type Project } from "@/lib/project-context";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface HorizontalGalleryProps {
  projects: Project[];
}

// Varied layout styles for collage effect (desktop only)
const LAYOUT_CONFIG = [
  { container: "w-[85vw] md:w-[45vw] h-[60vh] md:h-[70vh]", card: "shadow-xl border-primary/20" },
  { container: "w-[85vw] md:w-[30vw] h-[60vh] md:h-[50vh]", card: "shadow-lg border-border" },
  { container: "w-[85vw] md:w-[38vw] h-[60vh] md:h-[65vh]", card: "shadow-lg border-border" },
  { container: "w-[85vw] md:w-[32vw] h-[60vh] md:h-[55vh]", card: "shadow-md border-border" },
  { container: "w-[85vw] md:w-[28vw] h-[60vh] md:h-[48vh]", card: "shadow-md border-border" }
];

export function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [measurements, setMeasurements] = useState({
    viewportWidth: 0,
    trackWidth: 0,
    maxScroll: 0
  });
  
  // Track horizontal scroll progress (0 to maxScroll in pixels)
  const progressRef = useRef(0);
  const isLockedRef = useRef(false);
  
  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Measurement: calculate dimensions after images load
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current) return;
      
      const viewportWidth = viewportRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const maxScroll = Math.max(0, trackWidth - viewportWidth);
      
      setMeasurements({ viewportWidth, trackWidth, maxScroll });
    };

    measure();
    
    // Delayed measurements for image loading
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 500);
    const t3 = setTimeout(measure, 1000);

    // ResizeObserver for dynamic updates
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    // Image load listeners
    const images = trackRef.current?.querySelectorAll('img');
    images?.forEach(img => img.addEventListener('load', measure));

    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      images?.forEach(img => img.removeEventListener('load', measure));
      window.removeEventListener('resize', measure);
    };
  }, [projects]);

  // Scroll lock handler: intercept wheel/touch events and convert to horizontal translation
  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current || measurements.maxScroll <= 0) return;

    const updateTransform = () => {
      if (!trackRef.current) return;
      
      // Clamp progress between 0 and maxScroll
      const clampedProgress = Math.max(0, Math.min(measurements.maxScroll, progressRef.current));
      progressRef.current = clampedProgress;
      
      // Apply horizontal translation
      const translateX = (isRTL ? 1 : -1) * clampedProgress;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!wrapperRef.current) return;
      
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Check if gallery section is in view
      const isInView = rect.top <= 0 && rect.bottom > viewportHeight;
      
      if (!isInView) {
        isLockedRef.current = false;
        return;
      }
      
      // Gallery is in view - check if we should lock
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;
      
      // Lock conditions:
      // 1. Scrolling down and haven't finished horizontal travel
      // 2. Scrolling up and horizontal progress > 0
      const shouldLock = (scrollingDown && progressRef.current < measurements.maxScroll) ||
                        (scrollingUp && progressRef.current > 0);
      
      if (shouldLock) {
        e.preventDefault();
        isLockedRef.current = true;
        
        // Convert vertical scroll to horizontal progress
        // Use deltaY directly for 1:1 mapping
        const delta = e.deltaY;
        progressRef.current += delta;
        
        updateTransform();
      } else {
        isLockedRef.current = false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isInView = rect.top <= 0 && rect.bottom > viewportHeight;
      
      if (isInView) {
        (e.target as any)._touchStartY = e.touches[0].clientY;
        (e.target as any)._lastProgress = progressRef.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!wrapperRef.current) return;
      
      const rect = wrapperRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isInView = rect.top <= 0 && rect.bottom > viewportHeight;
      
      if (!isInView) return;
      
      const touchStartY = (e.target as any)._touchStartY;
      if (touchStartY === undefined) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY; // Positive = swipe up
      
      const shouldLock = (deltaY > 0 && progressRef.current < measurements.maxScroll) ||
                        (deltaY < 0 && progressRef.current > 0);
      
      if (shouldLock) {
        e.preventDefault();
        
        const lastProgress = (e.target as any)._lastProgress || 0;
        progressRef.current = lastProgress + deltaY;
        
        updateTransform();
      }
    };

    // Use non-passive listeners to allow preventDefault
    wrapperRef.current.addEventListener('wheel', handleWheel, { passive: false });
    wrapperRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
    wrapperRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });

    const wrapper = wrapperRef.current;
    
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
    };
  }, [measurements, isRTL]);

  // Mobile fallback: horizontal swipeable track
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isMobile) {
    return (
      <section className="py-12 bg-secondary/20">
        <div className="px-6">
          <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6">{t("home.featured.title")}</h2>
          <div className="h-[2px] w-12 bg-primary/50 mb-8"></div>
          
          {/* Horizontal swipeable track */}
          <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-6 px-6">
            <div className="flex gap-4" style={{ width: 'max-content' }}>
              {projects.map((project, i) => {
                const layoutStyle = LAYOUT_CONFIG[i % LAYOUT_CONFIG.length];
                const localizedProject = {
                  ...project,
                  title: language === 'en' && project.titleEn ? project.titleEn : project.title,
                  category: language === 'en' && project.categoryEn ? project.categoryEn : project.category,
                };

                return (
                  <div key={project.id} className={cn("flex-shrink-0", layoutStyle.container)}>
                    <div className={cn("w-full h-full bg-card overflow-hidden", layoutStyle.card)}>
                      <ProjectCard
                        {...localizedProject}
                        className="w-full h-full [&>div]:h-full [&>div]:mb-0 [&>div]:aspect-auto"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop: pinned horizontal scroll effect with scroll lock
  return (
    <section 
      ref={wrapperRef}
      className="relative m-0 p-0 h-screen"
    >
      <div 
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-secondary/10"
      >
        {/* Header */}
        <div className="absolute top-12 left-12 z-20">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-3">{t("home.featured.title")}</h2>
          <div className="h-[2px] w-16 bg-primary/50"></div>
        </div>

        {/* Scrollable Track */}
        <div 
          ref={trackRef}
          className="flex items-center gap-8 px-12 will-change-transform"
          style={{ display: 'inline-flex', width: 'max-content' }}
        >
          {projects.map((project, i) => {
            const layoutStyle = LAYOUT_CONFIG[i % LAYOUT_CONFIG.length];
            const localizedProject = {
              ...project,
              title: language === 'en' && project.titleEn ? project.titleEn : project.title,
              category: language === 'en' && project.categoryEn ? project.categoryEn : project.category,
            };

            return (
              <div 
                key={project.id} 
                className={cn("flex-shrink-0", layoutStyle.container)}
              >
                <div className={cn("w-full h-full bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl", layoutStyle.card)}>
                  <ProjectCard
                    {...localizedProject}
                    className="w-full h-full [&>div]:h-full [&>div]:mb-0 [&>div]:aspect-auto"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
