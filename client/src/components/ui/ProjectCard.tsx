import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  className?: string;
}

export function ProjectCard({ id, title, category, image, year, className }: ProjectCardProps) {
  return (
    <Link href={`/project/${id}`}>
      <motion.a 
        className={`block group cursor-pointer ${className}`}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative overflow-hidden aspect-[4/5] bg-muted mb-4">
          <motion.img 
            src={image} 
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
                <ArrowUpRight className="text-white h-6 w-6" />
             </div>
          </div>
        </div>
        <div className="flex justify-between items-end border-b border-transparent group-hover:border-border pb-2 transition-all duration-300">
          <div>
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-1">{category}</p>
            <h3 className="text-xl font-serif font-medium group-hover:text-primary/80 transition-colors">{title}</h3>
          </div>
          <span className="text-sm text-muted-foreground font-mono">{year}</span>
        </div>
      </motion.a>
    </Link>
  );
}
