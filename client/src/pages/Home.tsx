import { Layout } from "@/components/layout/Layout";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Asset imports
import stock1 from "@assets/stock_images/minimalist_interior__cce91859.jpg";
import stock2 from "@assets/stock_images/modern_set_design_st_d7e6dca9.jpg";
import stock3 from "@assets/stock_images/boutique_hotel_lobby_961ec732.jpg";
import stock4 from "@assets/stock_images/architectural_detail_6a7295b9.jpg";
import heroBg from "@assets/generated_images/subtle_textured_noise_gradient_background.png";

const PROJECTS = [
  { id: "desert-loft", title: "Desert Loft Renovation", category: "Residential", image: stock1, year: "2024" },
  { id: "studio-talk", title: "Studio Talk Show Set", category: "Set Design", image: stock2, year: "2023" },
  { id: "hotel-lobby", title: "Boutique Hotel Lobby", category: "Commercial", image: stock3, year: "2024" },
  { id: "concrete-villa", title: "Concrete Villa", category: "Residential", image: stock4, year: "2023" },
];

export function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <div className="container px-6 z-10 relative text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-base tracking-[0.2em] uppercase text-muted-foreground mb-6"
          >
            Interior & Set Design
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-9xl font-serif font-medium leading-[1.1] mb-8"
          >
            Designing Spaces <br className="hidden md:block"/> That Tell Stories
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10"
          >
             <Link href="/portfolio">
              <Button size="lg" className="rounded-none px-8 py-6 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                View Portfolio
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-none px-8 py-6 text-base border-primary/20 hover:bg-secondary transition-all">
                Book Consultation
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground/50 text-sm tracking-widest uppercase"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          Scroll
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-background">
        <div className="container px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-2">Featured Work</h2>
              <p className="text-muted-foreground">A selection of recent interior and set design projects.</p>
            </div>
            <Link href="/portfolio">
              <a className="hidden md:flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-primary/60 transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </a>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                {...project} 
                className={index % 2 === 1 ? "md:translate-y-16" : ""}
              />
            ))}
          </div>
          
          <div className="mt-20 text-center md:hidden">
            <Link href="/portfolio">
              <Button variant="outline" className="w-full">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary/30">
        <div className="container px-6">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-4">
               <h2 className="text-3xl md:text-4xl font-serif mb-6">Services</h2>
               <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                 From concept to completion, we create immersive environments that elevate your brand or lifestyle.
               </p>
               <Link href="/services">
                 <Button className="gap-2">Explore Services <ArrowRight className="h-4 w-4"/></Button>
               </Link>
             </div>
             
             <div className="lg:col-span-7 lg:col-start-6 grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { title: "Residential Design", desc: "Full-scale renovations and styling for private homes." },
                 { title: "Set Design", desc: "Conceptual environments for film, photography, and events." },
                 { title: "Commercial Spaces", desc: "Retail and hospitality design that engages customers." },
                 { title: "Styling & Curation", desc: "Sourcing furniture, art, and decor for finishing touches." }
               ].map((service, i) => (
                 <div key={i} className="bg-background p-8 border border-border/50 hover:border-primary/20 transition-colors">
                   <h3 className="text-xl font-serif mb-3">{service.title}</h3>
                   <p className="text-muted-foreground text-sm">{service.desc}</p>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </section>
    </Layout>
  );
}
