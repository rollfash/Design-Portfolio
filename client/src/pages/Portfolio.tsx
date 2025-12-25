import { Layout } from "@/components/layout/Layout";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "@/lib/project-context";
import { useLanguage } from "@/lib/language-context";
import { useSEO } from "@/lib/seo";

export function Portfolio() {
  const { projects } = useProjects();
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("All");

  useSEO({
    title: language === 'he'
      ? 'עבודות נבחרות | גל שינהורן - תיק עבודות'
      : 'Portfolio | Gal Shinhorn - Selected Work',
    description: language === 'he'
      ? 'אוסף עבודות נבחרות בעיצוב סטים, תערוכות וחללי חוויה. הבוגדים, מה קורה פה, תערוכות ופרויקטים מסחריים.'
      : 'Selected works in set design, exhibitions and experiential spaces. The Traitors, game shows, exhibitions and commercial projects.',
    type: 'website'
  });

  const FILTERS = [
    { id: "All", label: t("filter.all"), originalId: "All" },
    { id: "עיצוב סט", label: t("filter.set_design"), originalId: "עיצוב סט" },
    { id: "עיצוב במה ואירועים", label: t("filter.stage_event"), originalId: "עיצוב במה ואירועים" },
    { id: "עיצוב מסחרי", label: t("filter.commercial"), originalId: "עיצוב מסחרי" }
  ];

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <Layout>
      <div className="container px-6 max-w-[1920px] pt-12 pb-24 flex flex-col items-center mx-auto">
        <div className="text-center mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("portfolio.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("portfolio.subtitle")}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.originalId)}
              className={`text-sm uppercase tracking-widest px-4 py-2 transition-all duration-300 rounded-sm ${
                activeFilter === filter.originalId 
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                  : "text-muted-foreground hover:text-primary bg-secondary/30 hover:bg-secondary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const localizedProject = {
                ...project,
                title: language === 'en' && project.titleEn ? project.titleEn : project.title,
                category: language === 'en' && project.categoryEn ? project.categoryEn : project.category,
              };

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard {...localizedProject} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}
