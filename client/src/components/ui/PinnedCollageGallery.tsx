import { useRef, useState, useEffect } from "react";
import { type Project } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface PinnedCollageGalleryProps {
  projects: Project[];
}

// Collage frame configuration: hero position + supporting image positions
const FRAME_CONFIGS = [
  {
    hero: { w: "50vw", h: "65vh", x: "5vw", y: "10vh" },
    supporting: [
      { w: "22vw", h: "30vh", x: "60vw", y: "5vh" },
      { w: "18vw", h: "25vh", x: "60vw", y: "40vh" }
    ]
  },
  {
    hero: { w: "48vw", h: "70vh", x: "45vw", y: "12vh" },
    supporting: [
      { w: "20vw", h: "32vh", x: "8vw", y: "8vh" },
      { w: "24vw", h: "28vh", x: "8vw", y: "50vh" }
    ]
  },
  {
    hero: { w: "52vw", h: "68vh", x: "10vw", y: "8vh" },
    supporting: [
      { w: "18vw", h: "28vh", x: "68vw", y: "10vh" },
      { w: "20vw", h: "30vh", x: "68vw", y: "45vh" }
    ]
  }
];

export function PinnedCollageGallery({ projects }: PinnedCollageGalleryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [overflow, setOverflow] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Reverse project array for RTL so project[0] appears at right edge
  const renderProjects = isRTL ? [...projects].reverse() : projects;
  const totalFrames = projects.length;
  
  // Current frame from display progress
  const currentFrame = Math.min(Math.floor(displayProgress * totalFrames) + 1, totalFrames);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Measurement: calculate overflow and set wrapper height
  useEffect(() => {
    if (isMobile || !viewportRef.current || !trackRef.current || !wrapperRef.current) return;
    
    const measure = () => {
      if (!viewportRef.current || !trackRef.current || !wrapperRef.current) return;
      
      const viewportWidth = viewportRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const calculatedOverflow = Math.max(0, trackWidth - viewportWidth);
      
      setOverflow(calculatedOverflow);
      
      // Set wrapper height = viewportHeight + overflow
      const viewportHeight = window.innerHeight;
      wrapperRef.current.style.height = `${viewportHeight + calculatedOverflow}px`;
    };

    measure();
    
    // Delayed measurements for image loading
    const timers = [100, 300, 600, 1000, 1500].map(delay => setTimeout(measure, delay));

    // ResizeObserver
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    // Image load listeners
    const images = trackRef.current?.querySelectorAll('img');
    images?.forEach(img => img.addEventListener('load', measure));

    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      images?.forEach(img => img.removeEventListener('load', measure));
      window.removeEventListener('resize', measure);
    };
  }, [projects, isMobile]);

  // Scroll handler: convert vertical scroll to horizontal translation
  useEffect(() => {
    if (isMobile || !wrapperRef.current || !trackRef.current || overflow <= 0) return;

    const handleScroll = () => {
      if (!wrapperRef.current || !trackRef.current) return;
      
      const scrollY = window.scrollY;
      // Use getBoundingClientRect for more reliable positioning
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const wrapperTop = scrollY + wrapperRect.top;
      
      // Progress: 0 at start, 1 when all overflow is consumed
      const rawProgress = (scrollY - wrapperTop) / overflow;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      
      // Store raw progress for display (counter/progress bar - always 0→1)
      setDisplayProgress(clampedProgress);
      
      // Direction-aware travel for transforms: LTR goes 0→1, RTL goes 1→0
      const travel = isRTL ? (1 - clampedProgress) : clampedProgress;
      
      // Always translate negatively based on travel
      const translateX = -travel * overflow;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset transform on unmount
      if (trackRef.current) {
        trackRef.current.style.transform = '';
      }
    };
  }, [overflow, isRTL, isMobile]);

  // Mobile: swipeable horizontal gallery
  if (isMobile) {
    return (
      <section className="py-12 bg-background">
        <div className="px-4">
          {/* Progress UI */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-sm uppercase tracking-[0.25em] text-primary font-medium mb-2">
                {t("home.featured.title")}
              </h2>
              <div className="h-[1px] w-12 bg-primary/40"></div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              01/{String(totalFrames).padStart(2, '0')}
            </div>
          </div>
          
          {/* Swipeable track */}
          <div 
            className="overflow-x-auto overflow-y-hidden -mx-4 px-4 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {renderProjects.map((project, idx) => {
                const localizedTitle = language === 'en' && project.titleEn ? project.titleEn : project.title;
                const localizedCategory = language === 'en' && project.categoryEn ? project.categoryEn : project.category;

                return (
                  <div 
                    key={project.id} 
                    className="flex-shrink-0 w-[85vw] snap-start"
                    data-testid={`gallery-frame-${idx}`}
                  >
                    {/* Caption */}
                    <div className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
                      {localizedTitle} • {project.year || '2024'}
                    </div>
                    
                    {/* Image */}
                    <Link href={`/project/${project.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/10 group cursor-pointer">
                        <img 
                          src={project.image || '/placeholder.svg'} 
                          alt={localizedTitle}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <p className="text-xs text-foreground/90">{localizedCategory}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop: pinned collage with scroll lock
  return (
    <section 
      ref={wrapperRef}
      className="relative bg-background"
      data-testid="pinned-collage-gallery"
    >
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />

      <div 
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Progress UI */}
        <div className="absolute top-12 left-12 z-30 flex items-center gap-6">
          <div className="text-xs font-mono text-muted-foreground" data-testid="gallery-counter">
            {String(currentFrame).padStart(2, '0')}/{String(totalFrames).padStart(2, '0')}
          </div>
          <div className="w-32 h-[1px] bg-border/40 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-150 ease-out"
              style={{ width: `${displayProgress * 100}%` }}
              data-testid="gallery-progress-bar"
            />
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-12 right-12 z-30">
          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium">
            {t("home.featured.title")}
          </h2>
        </div>

        {/* Horizontal track with collage frames */}
        <div 
          ref={trackRef}
          className="absolute inset-0 flex will-change-transform"
          style={{ width: 'max-content' }}
        >
          {renderProjects.map((project, idx) => {
            const frameConfig = FRAME_CONFIGS[idx % FRAME_CONFIGS.length];
            const localizedTitle = language === 'en' && project.titleEn ? project.titleEn : project.title;
            const localizedCategory = language === 'en' && project.categoryEn ? project.categoryEn : project.category;

            return (
              <div 
                key={project.id}
                className="relative flex-shrink-0 h-screen"
                style={{ width: '100vw' }}
                data-testid={`gallery-frame-${idx}`}
              >
                {/* Frame container */}
                <div className="absolute inset-0">
                  
                  {/* Hero image */}
                  <div 
                    className="absolute"
                    style={{
                      width: frameConfig.hero.w,
                      height: frameConfig.hero.h,
                      [isRTL ? 'right' : 'left']: frameConfig.hero.x,
                      top: frameConfig.hero.y
                    }}
                  >
                    {/* Caption */}
                    <div className="absolute -top-8 left-0 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                      {localizedTitle} • {project.year || '2024'}
                    </div>
                    
                    {/* Image */}
                    <Link href={`/project/${project.id}`}>
                      <div 
                        className="relative w-full h-full overflow-hidden bg-secondary/10 shadow-2xl group cursor-pointer"
                        data-testid={`gallery-image-hero-${idx}`}
                      >
                        <img 
                          src={project.image || '/placeholder.svg'} 
                          alt={localizedTitle}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                          <p className="text-sm text-foreground/90 mb-1">{localizedCategory}</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Supporting images from project gallery (loop through gallery if needed) */}
                  {project.gallery && project.gallery.length > 0 && frameConfig.supporting.map((pos, i) => {
                    // Loop through gallery images if we don't have enough
                    const galleryIndex = i % project.gallery!.length;
                    const galleryImage = project.gallery![galleryIndex];

                    return (
                      <div 
                        key={i}
                        className="absolute"
                        style={{
                          width: pos.w,
                          height: pos.h,
                          [isRTL ? 'right' : 'left']: pos.x,
                          top: pos.y
                        }}
                      >
                        <Link href={`/project/${project.id}`}>
                          <div 
                            className="relative w-full h-full overflow-hidden bg-secondary/5 shadow-lg opacity-70 hover:opacity-100 transition-opacity duration-500 cursor-pointer group"
                            data-testid={`gallery-image-supporting-${idx}-${i}`}
                          >
                            <img 
                              src={galleryImage} 
                              alt={`${localizedTitle} ${i + 1}`}
                              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
