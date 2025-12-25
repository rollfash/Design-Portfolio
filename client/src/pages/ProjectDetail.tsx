import { Layout } from "@/components/layout/Layout";
import { useParams } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react"; 
import { useProjects } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { useSEO, generateProjectSchema, JSONLDScript, generateAltText } from "@/lib/seo";
import { useEffect } from "react";

export function ProjectDetail() {
  const { id } = useParams();
  const { projects, isLoading } = useProjects();
  const { t, language, direction } = useLanguage();
  const project = projects.find(p => p.id === id) || projects[0];

  const ArrowNext = direction === 'rtl' ? ArrowLeft : ArrowRight;
  const ArrowPrev = direction === 'rtl' ? ArrowRight : ArrowLeft;

  // Localized fields for SEO
  const seoTitle = project && (language === 'en' && project.titleEn ? project.titleEn : project.title);
  const seoDescription = project && (language === 'en' && project.descriptionEn ? project.descriptionEn : project.description);
  
  useSEO({
    title: seoTitle 
      ? `${seoTitle} | ${language === 'he' ? 'גל שינהורן' : 'Gal Shinhorn'}`
      : language === 'he' ? 'פרויקט | גל שינהורן' : 'Project | Gal Shinhorn',
    description: seoDescription || (language === 'he' 
      ? 'פרויקט עיצוב מאת גל שינהורן - מעצב הפקה וארט דיירקטור'
      : 'Design project by Gal Shinhorn - Production Designer & Art Director'),
    image: project?.image,
    type: 'article'
  });

  // Add JSON-LD structured data for project
  useEffect(() => {
    if (project) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'project-jsonld';
      script.text = JSON.stringify(generateProjectSchema(project, language));
      
      const existingScript = document.getElementById('project-jsonld');
      if (existingScript) {
        existingScript.remove();
      }
      
      document.head.appendChild(script);
      
      return () => {
        const scriptToRemove = document.getElementById('project-jsonld');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [project, language]);

  // Show loading state while projects are being fetched
  if (isLoading || !project) {
    return (
      <Layout>
        <div className="container px-6 max-w-[1920px] pt-12 pb-24 flex flex-col items-center justify-center min-h-[50vh] mx-auto">
          <p className="text-muted-foreground">{language === 'he' ? 'טוען...' : 'Loading...'}</p>
        </div>
      </Layout>
    );
  }

  // Safely handle optional arrays
  const gallery = project.gallery || [project.image];
  const services = (language === 'en' && project.servicesEn ? project.servicesEn : project.services) || [];

  // Localized fields
  const title = language === 'en' && project.titleEn ? project.titleEn : project.title;
  const category = language === 'en' && project.categoryEn ? project.categoryEn : project.category;
  const description = language === 'en' && project.descriptionEn ? project.descriptionEn : project.description;
  const location = language === 'en' && project.locationEn ? project.locationEn : project.location;
  const role = language === 'en' && project.roleEn ? project.roleEn : project.role;

  return (
    <Layout>
      <div className="container px-6 max-w-[1920px] pt-12 pb-24 flex flex-col items-center mx-auto">
        <div className="w-full max-w-6xl">
          <Link href="/portfolio" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowPrev className="h-4 w-4 mx-2" /> {t("project.back")}
          </Link>

          {/* Header - Centered for emphasis */}
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-sm block mb-4">{category}</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">{title}</h1>
            <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-y border-border py-8 text-center bg-secondary/10">
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">{t("project.location")}</h4>
                <p className="text-muted-foreground">{location}</p>
             </div>
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">{t("project.year")}</h4>
                <p className="text-muted-foreground">{project.year}</p>
             </div>
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">{t("project.role")}</h4>
                <p className="text-muted-foreground">{role}</p>
             </div>
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">{t("project.services")}</h4>
                <div className="text-muted-foreground flex flex-col">
                  {services.map((s: string) => <span key={s}>{s}</span>)}
                </div>
             </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-24">
            {gallery.map((media: string, i: number) => {
               const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.mpeg', '.3gp', '.flv'];
               const isVideo = media.startsWith("data:video") || videoExtensions.some(ext => media.toLowerCase().endsWith(ext));
               
               return (
                  <div key={i} className={`relative group overflow-hidden bg-secondary/20 ${i === 0 ? "md:col-span-2 aspect-video" : "aspect-video"}`}>
                     {isVideo ? (
                        <video 
                           src={media} 
                           className="w-full h-full object-contain"
                           controls
                           autoPlay
                           muted
                           loop
                           playsInline
                        />
                     ) : (
                        <img 
                           src={media} 
                           alt={generateAltText('project-detail', title, i, language)}
                           loading={i === 0 ? "eager" : "lazy"}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                     )}
                  </div>
               );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between border-t border-border pt-12">
             <Link href="/portfolio">
               <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                 <ArrowPrev className="h-4 w-4"/> {t("project.prev")}
               </Button>
             </Link>
             <Link href="/portfolio">
               <Button variant="ghost" className="gap-2 hover:text-primary">
                 {t("project.next")} <ArrowNext className="h-4 w-4"/>
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
