import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, Lightbulb, PenTool, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";

export function Services() {
  const services = [
    {
      title: "Residential Design",
      price: "From $5k per room",
      description: "Complete interior design services for homes, from renovation planning to furniture selection.",
      features: ["Space Planning", "Material Selection", "Custom Furniture", "Project Management"]
    },
    {
      title: "Set & Production Design",
      price: "Project Based",
      description: "Creating immersive environments for film, television, commercials, and brand activations.",
      features: ["Concept Development", "3D Rendering", "Prop Sourcing", "On-Set Styling"]
    },
    {
      title: "Commercial Interiors",
      price: "From $10k",
      description: "Designing branded environments for retail, hospitality, and office spaces.",
      features: ["Brand Integration", "Customer Flow", "Lighting Design", "Permitting Support"]
    },
    {
      title: "Styling & Consultation",
      price: "From $150/hr",
      description: "Expert eye for finishing touches, art curation, and layout optimization.",
      features: ["Art Direction", "Decor Sourcing", "Color Consultation", "Home Staging"]
    }
  ];

  return (
    <Layout>
       <div className="container px-6 py-20">
         <div className="max-w-3xl mx-auto text-center mb-20">
           <h1 className="text-4xl md:text-6xl font-serif mb-6">Services</h1>
           <p className="text-muted-foreground text-lg">
             We offer a comprehensive range of design services tailored to your specific needs.
             Whether it's a single room update or a full-scale commercial build-out, we approach every project with the same level of detail.
           </p>
         </div>

         {/* Process */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-border z-0" />
            
            {[
              { icon: Lightbulb, title: "Discover", desc: "We start by understanding your vision, needs, and the unique constraints of the space." },
              { icon: PenTool, title: "Design", desc: "We develop concepts, 3D visualizations, and material palettes to bring the vision to life." },
              { icon: HomeIcon, title: "Deliver", desc: "We manage the execution, sourcing, and installation to ensure a flawless result." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-background md:bg-transparent text-center px-4">
                <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-medium mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
         </div>

         {/* Service List */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
           {services.map((service, index) => (
             <div key={index} className="border border-border p-8 md:p-12 hover:border-primary/30 transition-all duration-300 bg-card">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl font-serif">{service.title}</h3>
                 <span className="text-sm font-mono bg-secondary px-2 py-1 rounded text-muted-foreground">{service.price}</span>
               </div>
               <p className="text-muted-foreground mb-8">{service.description}</p>
               <ul className="space-y-3 mb-8">
                 {service.features.map((feature) => (
                   <li key={feature} className="flex items-center text-sm">
                     <Check className="h-4 w-4 mr-3 text-primary/50" /> {feature}
                   </li>
                 ))}
               </ul>
               <Link href="/contact">
                 <Button variant="outline" className="w-full">Inquire Now</Button>
               </Link>
             </div>
           ))}
         </div>

         <div className="bg-primary text-primary-foreground p-12 md:p-24 text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Ready to transform your space?</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">Let's discuss your project and see how we can help bring your vision to reality.</p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-8">Book a Consultation</Button>
            </Link>
         </div>
       </div>
    </Layout>
  );
}
