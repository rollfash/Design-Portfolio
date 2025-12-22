import { Layout } from "@/components/layout/Layout";
import { useParams } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react"; 
import { projects } from "@/data/projects";

export function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id) || projects[0];

  // Safely handle optional arrays
  const gallery = project.gallery || [project.image];
  const services = project.services || [];

  return (
    <Layout>
      <div className="container px-6 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <Link href="/portfolio">
            <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowRight className="h-4 w-4 ml-2" /> חזרה לתיק העבודות
            </a>
          </Link>

          {/* Header - Centered for emphasis */}
          <div className="text-center mb-16">
            <span className="text-primary font-bold uppercase tracking-widest text-sm block mb-4">{project.category}</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">{project.title}</h1>
            <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mx-auto">
              {project.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 border-y border-border py-8 text-center bg-secondary/10">
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">מיקום</h4>
                <p className="text-muted-foreground">{project.location}</p>
             </div>
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">שנה</h4>
                <p className="text-muted-foreground">{project.year}</p>
             </div>
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">תפקיד</h4>
                <p className="text-muted-foreground">{project.role}</p>
             </div>
             <div>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-primary">שירותים</h4>
                <div className="text-muted-foreground flex flex-col">
                  {services.map((s: string) => <span key={s}>{s}</span>)}
                </div>
             </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-24">
            {gallery.map((img: string, i: number) => (
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
               <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary">
                 <ArrowRight className="h-4 w-4"/> פרויקט קודם
               </Button>
             </Link>
             <Link href="/portfolio">
               <Button variant="ghost" className="gap-2 hover:text-primary">
                 פרויקט הבא <ArrowLeft className="h-4 w-4"/>
               </Button>
             </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
