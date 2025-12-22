import { Layout } from "@/components/layout/Layout";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Asset imports
import stock1 from "@assets/stock_images/minimalist_interior__cce91859.jpg";
import stock2 from "@assets/stock_images/modern_set_design_st_d7e6dca9.jpg";
import stock3 from "@assets/stock_images/boutique_hotel_lobby_961ec732.jpg";
import stock4 from "@assets/stock_images/architectural_detail_6a7295b9.jpg";

const ALL_PROJECTS = [
  { id: "desert-loft", title: "Desert Loft Renovation", category: "Residential", image: stock1, year: "2024" },
  { id: "studio-talk", title: "Studio Talk Show Set", category: "Set Design", image: stock2, year: "2023" },
  { id: "hotel-lobby", title: "Boutique Hotel Lobby", category: "Commercial", image: stock3, year: "2024" },
  { id: "concrete-villa", title: "Concrete Villa", category: "Residential", image: stock4, year: "2023" },
  { id: "minimal-office", title: "Tech HQ Office", category: "Commercial", image: stock1, year: "2023" },
  { id: "fashion-shoot", title: "Vogue Editorial Set", category: "Set Design", image: stock2, year: "2022" },
];

const FILTERS = ["All", "Residential", "Commercial", "Set Design", "Styling"];

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.category === activeFilter);

  return (
    <Layout>
      <div className="container px-6 pt-12 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">Selected Work</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated collection of spaces designed for living, working, and performance.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-sm uppercase tracking-widest px-4 py-2 transition-all duration-300 ${
                activeFilter === filter 
                  ? "border-b border-primary text-primary" 
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
