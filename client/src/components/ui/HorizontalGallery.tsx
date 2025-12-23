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
    maxScroll: 0,
    wrapperHeight: 0
  });
  
  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Measurement: calculate dimensions after images load
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current || !trackRef.current || !wrapperRef.current) return;
      
      const viewportWidth = viewportRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const maxScroll = Math.max(0, trackWidth - viewportWidth);
      
      // Precise wrapper height calculation:
      // wrapperHeight = viewportHeight + maxScroll
      // This ensures: scrollDistance = maxScroll (the exact horizontal travel needed)
      const viewportHeight = window.innerHeight;
      const wrapperHeight = viewportHeight + maxScroll;
      
      // Apply height directly to wrapper to prevent browser rounding issues
      if (maxScroll > 0) {
        wrapperRef.current.style.height = `${wrapperHeight}px`;
      } else {
        wrapperRef.current.style.height = `${viewportHeight}px`;
      }
      
      setMeasurements({ viewportWidth, trackWidth, maxScroll, wrapperHeight });
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

  // Scroll handler: drive horizontal translation via vertical scroll
  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current || measurements.maxScroll <= 0) return;

    const handleScroll = () => {
      if (!wrapperRef.current || !trackRef.current) return;
      
      const scrollY = window.scrollY;
      const wrapperTop = wrapperRef.current.offsetTop;
      const viewportHeight = window.innerHeight;
      
      // Precise progress calculation:
      // scrollDistance should equal maxScroll (horizontal travel needed)
      // wrapperHeight = viewportHeight + maxScroll
      // scrollDistance = wrapperHeight - viewportHeight = maxScroll
      const scrollDistance = measurements.maxScroll;
      
      // Raw progress (can exceed 0-1 range during scroll)
      const rawProgress = (scrollY - wrapperTop) / scrollDistance;
      
      // Clamped progress (0 to 1)
      const progress = Math.max(0, Math.min(1, rawProgress));
      
      // Translate track horizontally (clamped to prevent overshoot)
      // At progress=1, translateX should be exactly ±maxScroll
      const translateX = (isRTL ? 1 : -1) * progress * measurements.maxScroll;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial position

    return () => window.removeEventListener('scroll', handleScroll);
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

  // Desktop: pinned horizontal scroll effect
  return (
    <section 
      ref={wrapperRef}
      className="relative m-0 p-0"
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
