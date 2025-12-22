import { Layout } from "@/components/layout/Layout";
import stockOwner from "@assets/stock_images/interior_designer_sk_b3da91c4.jpg";

export function About() {
  return (
    <Layout>
      <div className="container px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
           <div className="relative">
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img src={stockOwner} alt="Elena Vance" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-background p-8 border border-border hidden md:block max-w-xs">
                <p className="font-serif italic text-lg leading-relaxed">
                  "Design is not just about how it looks, but how it makes you feel."
                </p>
              </div>
           </div>

           <div className="pt-8">
             <h1 className="text-4xl md:text-6xl font-serif mb-8">Hello, I'm Elena.</h1>
             <div className="prose prose-lg text-muted-foreground mb-12">
               <p className="mb-6">
                 I am an interior and set designer based in Los Angeles, obsessed with the interplay of light, texture, and form. 
                 With a background in fine arts and architecture, I approach every space as a composition—balancing function with narrative depth.
               </p>
               <p className="mb-6">
                 My work spans high-end residential projects, commercial spaces, and production design for film and television. 
                 I believe that environments have the power to influence emotion and behavior, and I strive to create spaces that feel both grounded and ethereal.
               </p>
               <p>
                 When I'm not designing, you can find me scouring vintage markets, sketching in museums, or exploring the architectural history of the city.
               </p>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-12">
               <div>
                 <h3 className="font-serif text-xl mb-4">Approach</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Minimalist, organic, and narrative-driven. I prioritize natural materials and sustainable practices whenever possible.
                 </p>
               </div>
               <div>
                 <h3 className="font-serif text-xl mb-4">Toolset</h3>
                 <ul className="text-sm text-muted-foreground space-y-1">
                   <li>AutoCAD & SketchUp</li>
                   <li>Adobe Creative Suite</li>
                   <li>Blender (3D Visualization)</li>
                   <li>Hand Sketching</li>
                 </ul>
               </div>
             </div>

             <div className="border-t border-border pt-8">
               <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">As Featured In</h4>
               <div className="flex gap-8 opacity-50 grayscale">
                 {/* Placeholders for logos - simple text for now */}
                 <span className="font-serif text-xl font-bold">VOGUE</span>
                 <span className="font-serif text-xl font-bold">AD</span>
                 <span className="font-serif text-xl font-bold">dwell</span>
                 <span className="font-serif text-xl font-bold">DEZEEN</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
