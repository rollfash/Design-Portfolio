import { Layout } from "@/components/layout/Layout";
import { useParams } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Asset imports
import stock1 from "@assets/stock_images/minimalist_interior__cce91859.jpg";
import stock2 from "@assets/stock_images/modern_set_design_st_d7e6dca9.jpg";
import stock3 from "@assets/stock_images/boutique_hotel_lobby_961ec732.jpg";
import stock4 from "@assets/stock_images/architectural_detail_6a7295b9.jpg";

const PROJECTS = {
  "desert-loft": {
    title: "Desert Loft Renovation",
    category: "Residential",
    location: "Joshua Tree, CA",
    year: "2024",
    role: "Lead Interior Designer",
    description: "A complete renovation of a 1970s desert cabin, transforming it into a minimalist retreat. The design focuses on raw materials, natural light, and a seamless connection to the arid landscape. We used locally sourced concrete, reclaimed wood, and a muted palette to create a sense of calm.",
    services: ["Interior Architecture", "Custom Furniture Design", "Styling"],
    images: [stock1, stock4, stock1, stock4, stock1, stock4] 
  },
  "studio-talk": {
    title: "Studio Talk Show Set",
    category: "Set Design",
    location: "Los Angeles, CA",
    year: "2023",
    role: "Production Designer",
    description: "Designed the main set for a new late-night talk show. The goal was to create an intimate yet visually striking environment that looked great on camera from every angle. We utilized modular backdrop elements and programmable LED lighting to change the mood for different segments.",
    services: ["Set Design", "Lighting Direction", "Prop Sourcing"],
    images: [stock2, stock3, stock2, stock3, stock2, stock3]
  },
  // Fallback for others
};

export function ProjectDetail() {
  const { id } = useParams();
  // @ts-ignore
  const project = PROJECTS[id] || PROJECTS["desert-loft"]; // Fallback for demo

  return (
    <Layout>
      <div className="container px-6 pt-12 pb-24">
        <Link href="/portfolio">
          <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Portfolio
          </a>
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-8">
            <span className="text-primary/60 uppercase tracking-widest text-sm block mb-4">{project.category}</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-8">{project.title}</h1>
            <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl">
              {project.description}
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end space-y-6 md:pl-12 border-l border-border/50">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Location</h4>
              <p className="text-muted-foreground">{project.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Year</h4>
              <p className="text-muted-foreground">{project.year}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Role</h4>
              <p className="text-muted-foreground">{project.role}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">Services</h4>
              <ul className="text-muted-foreground list-none">
                {project.services.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Image Grid - Masonry style mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-24">
          {project.images.map((img: string, i: number) => (
            <div key={i} className={`relative group overflow-hidden ${i === 0 ? "md:col-span-2 aspect-video" : "aspect-[4/5]"}`}>
               <img 
                 src={img} 
                 alt={`Project detail ${i+1}`} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between border-t border-border pt-12">
           <Link href="/portfolio">
             <Button variant="ghost" className="gap-2 text-muted-foreground">
               <ArrowLeft className="h-4 w-4"/> Previous Project
             </Button>
           </Link>
           <Link href="/portfolio">
             <Button variant="ghost" className="gap-2">
               Next Project <ArrowRight className="h-4 w-4"/>
             </Button>
           </Link>
        </div>
      </div>
    </Layout>
  );
}
