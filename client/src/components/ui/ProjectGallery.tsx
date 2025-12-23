import { type Project } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface ProjectGalleryProps {
  projects: Project[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const { language, t } = useLanguage();

  if (projects.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container px-6 max-w-[1920px] mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("home.featured.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'he' 
              ? "מבחר מהפרויקטים האחרונים שלנו"
              : "A selection of our recent projects"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const localizedTitle = language === 'en' && project.titleEn ? project.titleEn : project.title;
            const localizedCategory = language === 'en' && project.categoryEn ? project.categoryEn : project.category;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                style={{ willChange: 'opacity, transform' }}
              >
                <Link href={`/project/${project.id}`}>
                  <div 
                    className="group cursor-pointer"
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary/20 mb-4">
                      <img 
                        src={project.image || '/placeholder.svg'} 
                        alt={localizedTitle}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {localizedCategory} • {project.year || '2024'}
                      </p>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {localizedTitle}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link href="/portfolio">
            <button className="px-8 py-3 border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all">
              {language === 'he' ? "לכל הפרויקטים" : "View All Projects"}
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
