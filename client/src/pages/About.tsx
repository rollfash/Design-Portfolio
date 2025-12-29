import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/lib/language-context";
import { useSEO, generateAltText } from "@/lib/seo";
import { useProjects } from "@/lib/project-context";
import { useMemo } from "react";

export function About() {
  const { t, language } = useLanguage();
  const { projects } = useProjects();

  const randomProjectImage = useMemo(() => {
    if (projects.length === 0) return "/avatar.jpg";
    const randomIndex = Math.floor(Math.random() * projects.length);
    return projects[randomIndex]?.image || "/avatar.jpg";
  }, [projects]);

  useSEO({
    title: language === 'he'
      ? 'אודות | גל שינהורן - מעצב הפקה וארט דיירקטור'
      : 'About | Gal Shinhorn - Production Designer & Art Director',
    description: language === 'he'
      ? 'למד עלי - גל שינהורן, מעצב הפקה וארט דיירקטור עם גישה מינימליסטית ואורגנית. ניסיון של למעלה מ-20 שנה בעיצוב סטים, תערוכות וחללי חוויה.'
      : 'Learn about Gal Shinhorn - Production Designer & Art Director with a minimalist and organic approach. Over 20 years of experience in set design, exhibitions and experiential spaces.',
    image: randomProjectImage,
    type: 'profile'
  });

  return (
    <Layout>
      <div className="container px-6 max-w-[1920px] py-20 flex flex-col items-center mx-auto">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             {/* Order changed on mobile vs desktop to center the layout visually */}
             <div className="relative order-2 md:order-1 flex justify-center md:justify-end">
                <div className="aspect-[3/4] bg-muted overflow-hidden max-w-sm w-full relative">
                  <img 
                    src={randomProjectImage} 
                    alt={generateAltText('hero', 'Gal Shinhorn', undefined, language)}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    draggable={false} />
                  <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none"></div>
                </div>
             </div>

             <div className="order-1 md:order-2 text-center md:text-start">
               <div className="flex justify-center md:justify-start mb-8">
                 <img 
                   src="/avatar.jpg" 
                   alt="Gal Shinhorn"
                   className="w-24 h-24 rounded-full object-cover border-2 border-primary/20"
                   onContextMenu={(e) => e.preventDefault()}
                   onDragStart={(e) => e.preventDefault()}
                   draggable={false}
                 />
               </div>
               <div className="prose prose-lg text-muted-foreground mb-12 mx-auto md:mx-0">
                 <p className="mb-6">{t("about.p1")}</p>
                 <p className="mb-6">{t("about.p2")}</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 text-center md:text-start">
                 <div className="bg-secondary/20 p-6 border border-border">
                   <h3 className="font-bold text-xl mb-4 text-primary">{t("about.approach")}</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     {t("about.approach.desc")}
                   </p>
                 </div>
                 <div className="bg-secondary/20 p-6 border border-border">
                   <h3 className="font-bold text-xl mb-4 text-primary">{t("about.tools")}</h3>
                   <ul className="text-sm text-muted-foreground space-y-1 list-none">
                     <li>{t("about.tools.list")}</li>
                   </ul>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="mt-20 pt-12 border-t border-border text-center">
             <div className="bg-primary/5 inline-block p-8 md:p-12 rounded-lg max-w-3xl">
                <p className="font-bold italic text-2xl leading-relaxed text-primary/80">
                  {t("about.quote")}
                </p>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
