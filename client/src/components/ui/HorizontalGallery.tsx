import { useRef, useState, useEffect } from "react";
import { type Project } from "@/lib/project-context";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

interface HorizontalGalleryProps {
  projects: Project[];
}

// Define varied layout styles for a collage feel
const LAYOUT_CONFIG = [
  { container: "w-[85vw] sm:w-[60vw] md:w-[45vw] h-[55vh] md:h-[70vh]", card: "shadow-xl border-primary/20" },
  { container: "w-[85vw] sm:w-[50vw] md:w-[30vw] h-[55vh] md:h-[50vh]", card: "shadow-lg border-border" },
  { container: "w-[85vw] sm:w-[55vw] md:w-[35vw] h-[55vh] md:h-[60vh]", card: "shadow-lg border-border" },
  { container: "w-[85vw] sm:w-[50vw] md:w-[30vw] h-[55vh] md:h-[55vh]", card: "shadow-md border-border" },
  { container: "w-[85vw] sm:w-[45vw] md:w-[28vw] h-[55vh] md:h-[45vh]", card: "shadow-md border-border" }
];

export function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [measurements, setMeasurements] = useState({
    viewportWidth: 0,
    trackWidth: 0,
    overflow: 0,
    wrapperHeight: 0
  });
  
  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Measurement-driven scroll calculation
  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current || !viewportRef.current || !trackRef.current) return;
      
      const viewportWidth = viewportRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const overflow = Math.max(0, trackWidth - viewportWidth);
      
      // Set wrapper height: viewport height + overflow (1:1 mapping for smooth scroll)
      const viewportHeight = window.innerHeight;
      const wrapperHeight = overflow > 0 ? viewportHeight + overflow : viewportHeight;
      
      setMeasurements({ viewportWidth, trackWidth, overflow, wrapperHeight });
    };

    // Initial measurement
    measure();
    
    // Delay for image loads
    const timer = setTimeout(measure, 100);
    const timer2 = setTimeout(measure, 500);

    // ResizeObserver for dynamic updates
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    // Listen for image loads
    const images = trackRef.current?.querySelectorAll('img');
    images?.forEach(img => img.addEventListener('load', measure));

    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearTimeout(timer2);
      images?.forEach(img => img.removeEventListener('load', measure));
      window.removeEventListener('resize', measure);
    };
  }, [projects]);

  // Manual scroll handler
  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current || measurements.overflow <= 0) return;

    const handleScroll = () => {
      if (!wrapperRef.current || !trackRef.current) return;
      
      const wrapperTop = wrapperRef.current.offsetTop;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Compute progress: 0 when wrapper enters viewport, 1 when it leaves
      const scrollDistance = measurements.wrapperHeight - viewportHeight;
      const progress = scrollDistance > 0 
        ? Math.max(0, Math.min(1, (scrollY - wrapperTop) / scrollDistance))
        : 0;
      
      // Apply translateX
      const translateX = (isRTL ? 1 : -1) * progress * measurements.overflow;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [measurements, isRTL]);

  // Fallback to normal grid if no overflow
  if (measurements.overflow <= 0 && measurements.trackWidth > 0) {
    return (
      <section className="py-16 bg-secondary/20">
        <div className="container px-6 mx-auto">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-primary mb-8">{t("home.featured.title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const localizedProject = {
                ...project,
                title: language === 'en' && project.titleEn ? project.titleEn : project.title,
                category: language === 'en' && project.categoryEn ? project.categoryEn : project.category,
              };
              return (
                <div key={project.id} className="aspect-[4/5]">
                  <ProjectCard {...localizedProject} className="h-full" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={wrapperRef} 
      className="relative"
      style={{ height: measurements.wrapperHeight > 0 ? `${measurements.wrapperHeight}px` : 'auto' }}
    >
      <div 
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center"
      >
        {/* Header */}
        <div className="absolute top-8 left-8 z-20">
          <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">{t("home.featured.title")}</h2>
          <div className="h-[2px] w-12 bg-primary/50"></div>
        </div>

        {/* Track */}
        <div 
          ref={trackRef}
          className="flex items-center gap-6 px-8 will-change-transform"
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
                <div className={cn("w-full h-full bg-card overflow-hidden transition-all duration-300", layoutStyle.card)}>
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
