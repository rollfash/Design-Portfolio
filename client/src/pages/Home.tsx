import { Layout } from "@/components/layout/Layout";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; 
import { Link } from "wouter";
import { motion } from "framer-motion";

// Asset imports
import stock1 from "@assets/stock_images/minimalist_interior__cce91859.jpg";
import stock2 from "@assets/stock_images/modern_set_design_st_d7e6dca9.jpg";
import stock3 from "@assets/stock_images/boutique_hotel_lobby_961ec732.jpg";
import stock4 from "@assets/stock_images/architectural_detail_6a7295b9.jpg";
// We don't use the hero bg image anymore, we rely on the CSS grid background

const PROJECTS = [
  { id: "desert-loft", title: "שיפוץ לופט במדבר", category: "מגורים", image: stock1, year: "2024" },
  { id: "studio-talk", title: "סט תוכנית אירוח", category: "עיצוב סט", image: stock2, year: "2023" },
  { id: "hotel-lobby", title: "לובי מלון בוטיק", category: "מסחרי", image: stock3, year: "2024" },
  { id: "concrete-villa", title: "וילת בטון", category: "מגורים", image: stock4, year: "2023" },
];

export function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-20 pb-20 overflow-hidden">
        
        <div className="container px-6 z-10 relative flex flex-col items-center max-w-7xl mx-auto">
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold leading-[1.1] mb-24 text-center tracking-tight"
          >
            Gal shinhorn
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-6xl mx-auto mb-20"
          >
             <div className="flex flex-col md:flex-row gap-8 md:gap-0 relative items-stretch">
                {/* 
                  RTL Layout Logic: 
                  Flex container in RTL starts from right.
                  We want: Hebrew (Left visually) | English (Right visually)
                  In RTL: 
                  [Element 1 (Right)] | [Element 2 (Left)]
                  So Element 1 should be English, Element 2 should be Hebrew.
                */}

                {/* English Block (Visually Right) */}
                <div className="flex-1 md:pl-16 text-left order-1 md:order-1">
                  <div dir="ltr" className="text-muted-foreground text-base md:text-lg leading-relaxed space-y-6">
                    <p>
                      Gal Shinhorn Studio is a design firm that specializes in representative spaces, experience spaces, and exhibitions. We've been in business for over 20 years and have helped many clients create powerful and impactful spaces.
                    </p>
                    <p>
                      Our team of experienced designers are passionate about creating projects that are both visually stunning and functional. We believe in taking a holistic approach to design, and strive to create spaces that are both aesthetically pleasing and emotionally resonant. With our unique blend of creativity and technical expertise, we are sure to make your vision come to life.
                    </p>
                  </div>
                </div>

                 {/* Divider - Mobile: Horizontal, Desktop: Vertical */}
                 <div className="hidden md:block w-[1px] bg-border mx-0 order-2"></div>
                 <div className="md:hidden h-[1px] w-full bg-border my-4 order-2"></div>

                {/* Hebrew Block (Visually Left) */}
                <div className="flex-1 md:pr-16 text-right order-3 md:order-3">
                   <div dir="rtl" className="text-muted-foreground text-base md:text-lg leading-relaxed space-y-6">
                      <p>
                        סטודיו גל שינהורן הינו משרד עיצוב המתמחה בחללים ייצוגיים, חללי חוויה ותערוכות. אנו עוסקים יותר מ-20 שנה ועזרנו ללקוחות רבים ליצור חללים עוצמתיים ומשפיעים.
                      </p>
                      <p>
                        צוות המעצבים המנוסים שלנו נלהב ליצור פרויקטים שהם גם מדהימים ויזואלית וגם פונקציונליים. אנו מאמינים בגישה הוליסטית לעיצוב, ושואפים ליצור חללים שהם גם אסתטיים וגם מהדהדים רגשית. עם השילוב הייחודי שלנו של יצירתיות ומומחיות טכנית, אנו בטוחים שנגרום לחזון שלך להתעורר לחיים.
                      </p>
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
             <Link href="/portfolio">
              <Button size="lg" className="rounded-none px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all min-w-[200px]">
                לתיק העבודות
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-none px-10 py-6 text-lg border-primary/30 hover:bg-secondary hover:text-primary transition-all min-w-[200px]">
                תיאום פגישה
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator - Positioned absolutely at bottom */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/40 text-sm tracking-[0.2em] uppercase z-20 pointer-events-none"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          גלילה
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container px-6 flex flex-col items-center">
          <div className="text-center mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">עבודות נבחרות</h2>
            <div className="w-12 h-[2px] bg-primary/30 mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">מבחר פרויקטים אחרונים בעיצוב פנים וסטים המשלבים אסתטיקה ופונקציונליות.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 w-full max-w-6xl mb-16">
            {PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                {...project} 
                className={index % 2 === 1 ? "md:translate-y-20" : ""}
              />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/portfolio">
              <Button variant="outline" className="px-8 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground gap-2">
                לכל העבודות <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary/30 border-t border-border">
        <div className="container px-6 flex flex-col items-center text-center">
           <div className="max-w-3xl mb-16">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">שירותים</h2>
             <p className="text-muted-foreground text-lg leading-relaxed mb-8">
               מהקונספט ועד הביצוע, אני יוצר סביבות שמעצימות את המותג או את חווית המגורים שלך.
             </p>
             <Link href="/services">
               <Button className="gap-2 bg-primary text-primary-foreground">לכל השירותים <ArrowLeft className="h-4 w-4"/></Button>
             </Link>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
             {[
               { title: "עיצוב מגורים", desc: "שיפוצים מקיפים וסטיילינג לבתים פרטיים ודירות." },
               { title: "עיצוב סטים", desc: "סביבות קונספטואליות לצילומים, טלוויזיה ואירועים." },
               { title: "חללים מסחריים", desc: "עיצוב חנויות ומשרדים שמעוררים עניין ומחזקים מותג." },
               { title: "סטיילינג", desc: "בחירת ריהוט, אמנות ודקורציה להשלמת המראה." }
             ].map((service, i) => (
               <div key={i} className="bg-background p-8 border border-border/60 hover:border-primary/50 transition-all duration-300 group shadow-sm">
                 <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                 <p className="text-muted-foreground text-sm">{service.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>
    </Layout>
  );
}
