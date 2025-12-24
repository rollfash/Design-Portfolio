import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react"; // RTL Arrow

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  className?: string;
}

export function ProjectCard({ id, title, category, image, year, className }: ProjectCardProps) {
  // Default placeholder image for empty/missing images
  const imageSrc = image && image.trim() !== '' 
    ? image 
    : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"%3E%3Crect fill="%23374151" width="400" height="500"/%3E%3Ctext fill="%239CA3AF" font-family="system-ui" font-size="16" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';

  return (
    <Link href={`/project/${id}`}>
      <motion.div 
        className={`block group cursor-pointer ${className}`}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative overflow-hidden aspect-video bg-secondary/20 mb-4 group-hover:border-transparent">
          <motion.img 
            src={imageSrc} 
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay Text - Always visible overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-500" />
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white z-10 pointer-events-none ltr:flex-row rtl:flex-row-reverse">
             <div className="text-start rtl:text-end">
               <h3 className="text-lg font-bold uppercase tracking-wider mb-1 drop-shadow-md">{title}</h3>
               <p className="text-xs font-medium opacity-80 uppercase tracking-widest drop-shadow-sm">{category}</p>
             </div>
             <span className="text-sm font-mono opacity-60 drop-shadow-sm">{year}</span>
          </div>

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
             <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
                <ArrowUpLeft className="text-white h-6 w-6 ltr:rotate-45 rtl:-rotate-45" />
             </div>
          </div>
        </div>
        {/* Remove bottom text block since it's now overlay */}
      </motion.div>
    </Link>
  );
}
