import { useRef, useState, useEffect } from "react";
import { type Project } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface HorizontalGalleryProps {
  projects: Project[];
}

// Collage frame layouts - each frame has 1 large hero + smaller supporting images
const FRAME_LAYOUTS = [
  {
    hero: { width: "45vw", height: "70vh", position: "top-0 left-0" },
    supporting: [
      { width: "20vw", height: "30vh", position: "top-0 right-8" },
      { width: "18vw", height: "25vh", position: "top-[35vh] right-8" },
      { width: "22vw", height: "28vh", position: "bottom-8 left-8" }
    ]
  },
  {
    hero: { width: "50vw", height: "75vh", position: "top-8 right-0" },
    supporting: [
      { width: "18vw", height: "35vh", position: "top-0 left-8" },
      { width: "20vw", height: "30vh", position: "bottom-0 left-8" },
      { width: "15vw", height: "22vh", position: "top-[40vh] left-[25vw]" }
    ]
  },
  {
    hero: { width: "48vw", height: "72vh", position: "top-12 left-12" },
    supporting: [
      { width: "22vw", height: "32vh", position: "top-0 right-0" },
      { width: "19vw", height: "28vh", position: "bottom-0 right-12" },
      { width: "16vw", height: "24vh", position: "bottom-12 left-0" }
    ]
  }
];

export function HorizontalGallery({ projects }: HorizontalGalleryProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [maxScroll, setMaxScroll] = useState(0);
  const [wrapperHeight, setWrapperHeight] = useState('100vh');
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const { language, direction, t } = useLanguage();
  const isRTL = direction === 'rtl';

  // Group projects into frames (1 project per frame for now)
  const frames = projects.map(project => ({
    hero: project,
    supporting: [] // Could add related projects here
  }));

  const totalFrames = frames.length;

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Measurement
  useEffect(() => {
    if (isMobile) return;
    
    const measure = () => {
      if (!viewportRef.current || !trackRef.current || !wrapperRef.current) return;
      
      const viewportWidth = viewportRef.current.clientWidth;
      const trackWidth = trackRef.current.scrollWidth;
      const overflow = Math.max(0, trackWidth - viewportWidth);
      
      const viewportHeight = window.innerHeight;
      const totalHeight = viewportHeight + overflow;
      
      setMaxScroll(overflow);
      setWrapperHeight(`${totalHeight}px`);
    };

    measure();
    
    const t1 = setTimeout(measure, 100);
    const t2 = setTimeout(measure, 300);
    const t3 = setTimeout(measure, 600);
    const t4 = setTimeout(measure, 1000);

    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);

    const images = trackRef.current?.querySelectorAll('img');
    images?.forEach(img => img.addEventListener('load', measure));

    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      images?.forEach(img => img.removeEventListener('load', measure));
      window.removeEventListener('resize', measure);
    };
  }, [projects, isMobile]);

  // Scroll handler
  useEffect(() => {
    if (isMobile || !wrapperRef.current || !trackRef.current || maxScroll <= 0) return;

    const handleScroll = () => {
      if (!wrapperRef.current || !trackRef.current) return;
      
      const scrollY = window.scrollY;
      const wrapperTop = wrapperRef.current.offsetTop;
      
      const scrollProgress = Math.max(0, Math.min(1, (scrollY - wrapperTop) / maxScroll));
      setProgress(scrollProgress);
      
      const translateX = (isRTL ? 1 : -1) * scrollProgress * maxScroll;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxScroll, isRTL, isMobile]);

  // Mobile version
  if (isMobile) {
    return (
      <section className="py-12 bg-background">
        <div className="px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">
                {t("home.featured.title")}
              </h2>
              <div className="h-[1px] w-12 bg-primary/50"></div>
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              01/{String(totalFrames).padStart(2, '0')}
            </div>
          </div>
          
          <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-6 px-6 scrollbar-hide">
            <div className="flex gap-12" style={{ width: 'max-content' }}>
              {frames.map((frame, idx) => {
                const localizedProject = {
                  ...frame.hero,
                  title: language === 'en' && frame.hero.titleEn ? frame.hero.titleEn : frame.hero.title,
                  category: language === 'en' && frame.hero.categoryEn ? frame.hero.categoryEn : frame.hero.category,
                };

                return (
                  <div key={frame.hero.id} className="flex-shrink-0 w-[85vw]">
                    <div className="relative">
                      <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        {localizedProject.title} • {frame.hero.year || '2024'}
                      </div>
                      <Link href={`/project/${frame.hero.id}`}>
                        <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20 group cursor-pointer">
                          <img 
                            src={frame.hero.image || '/placeholder.svg'} 
                            alt={localizedProject.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-sm text-muted-foreground">{localizedProject.category}</p>
                          </div>
                        </div>
                      </Link>
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

  // Desktop collage version
  return (
    <section 
      ref={wrapperRef}
      className="relative bg-background"
      style={{ height: wrapperHeight }}
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{ 
             backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />

      <div 
        ref={viewportRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Progress UI */}
        <div className="absolute top-12 left-12 z-30 flex items-center gap-6">
          <div className="text-sm font-mono text-muted-foreground">
            {String(Math.min(Math.ceil(progress * totalFrames) + 1, totalFrames)).padStart(2, '0')}/{String(totalFrames).padStart(2, '0')}
          </div>
          <div className="w-32 h-[1px] bg-border relative">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="absolute top-12 right-12 z-30">
          <h2 className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-medium">
            {t("home.featured.title")}
          </h2>
        </div>

        {/* Horizontal track with collage frames */}
        <div 
          ref={trackRef}
          className="absolute inset-0 flex items-center will-change-transform"
          style={{ width: 'max-content' }}
        >
          {frames.map((frame, idx) => {
            const layout = FRAME_LAYOUTS[idx % FRAME_LAYOUTS.length];
            const localizedProject = {
              ...frame.hero,
              title: language === 'en' && frame.hero.titleEn ? frame.hero.titleEn : frame.hero.title,
              category: language === 'en' && frame.hero.categoryEn ? frame.hero.categoryEn : frame.hero.category,
            };

            return (
              <div 
                key={frame.hero.id}
                className="relative flex-shrink-0 h-screen"
                style={{ width: '100vw' }}
              >
                {/* Frame content - positioned collage */}
                <div className="absolute inset-0 flex items-center justify-center px-24">
                  <div className="relative w-full h-full max-w-[90vw]">
                    
                    {/* Hero image */}
                    <div 
                      className={cn("absolute", layout.hero.position)}
                      style={{ width: layout.hero.width, height: layout.hero.height }}
                    >
                      <div className="mb-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        {localizedProject.title} • {frame.hero.year || '2024'}
                      </div>
                      <Link href={`/project/${frame.hero.id}`}>
                        <div className="relative w-full h-full overflow-hidden bg-secondary/10 shadow-2xl group cursor-pointer">
                          <img 
                            src={frame.hero.image || '/placeholder.svg'} 
                            alt={localizedProject.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <p className="text-sm text-foreground/80 mb-1">{localizedProject.category}</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Supporting images */}
                    {layout.supporting.slice(0, frame.supporting.length || 0).map((pos, i) => (
                      <div 
                        key={i}
                        className={cn("absolute opacity-60", pos.position)}
                        style={{ width: pos.width, height: pos.height }}
                      >
                        <div className="w-full h-full bg-secondary/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
