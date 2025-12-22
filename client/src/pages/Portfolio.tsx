import { Layout } from "@/components/layout/Layout";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects"; // Import centralized data

const FILTERS = [
  { id: "All", label: "הכל" },
  { id: "מגורים", label: "מגורים" },
  { id: "מסחרי", label: "מסחרי" },
  { id: "עיצוב סט", label: "עיצוב סט" }
];

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <Layout>
      <div className="container px-6 pt-12 pb-24 flex flex-col items-center">
        <div className="text-center mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">עבודות נבחרות</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            אוסף חללים נבחרים שתוכננו למגורים, עבודה והופעה.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`text-sm uppercase tracking-widest px-4 py-2 transition-all duration-300 rounded-sm ${
                activeFilter === filter.id 
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
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}
