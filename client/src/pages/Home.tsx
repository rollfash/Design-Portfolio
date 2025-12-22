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
import heroBg from "@assets/generated_images/subtle_textured_noise_gradient_background.png";

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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        
        <div className="container px-6 z-10 relative text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-[1.1] mb-12"
          >
            Gal shinhorn
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl mx-auto space-y-10 mb-12"
          >
            {/* English Block - LTR */}
            <div dir="ltr" className="text-center text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              <p className="mb-4">
                Gal Shinhorn Studio is a design firm that specializes in representative spaces, experience spaces, and exhibitions. We've been in business for over 20 years and have helped many clients create powerful and impactful spaces.
              </p>
              <p>
                Our team of experienced designers are passionate about creating projects that are both visually stunning and functional. We believe in taking a holistic approach to design, and strive to create spaces that are both aesthetically pleasing and emotionally resonant. With our unique blend of creativity and technical expertise, we are sure to make your vision come to life.
              </p>
            </div>

            {/* Hebrew Block - RTL */}
            <div dir="rtl" className="text-center text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              <p className="mb-4">
                סטודיו גל שינהורן הינו משרד עיצוב המתמחה בחללים ייצוגיים, חללי חוויה ותערוכות. אנו עוסקים יותר מ-20 שנה ועזרנו ללקוחות רבים ליצור חללים עוצמתיים ומשפיעים.
              </p>
              <p>
                צוות המעצבים המנוסים שלנו נלהב ליצור פרויקטים שהם גם מדהימים ויזואלית וגם פונקציונליים. אנו מאמינים בגישה הוליסטית לעיצוב, ושואפים ליצור חללים שהם גם אסתטיים וגם מהדהדים רגשית. עם השילוב הייחודי שלנו של יצירתיות ומומחיות טכנית, אנו בטוחים שנגרום לחזון שלך להתעורר לחיים.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10"
          >
             <Link href="/portfolio">
              <Button size="lg" className="rounded-none px-10 py-7 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                לתיק העבודות
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="rounded-none px-10 py-7 text-lg border-primary/20 hover:bg-secondary hover:text-primary transition-all">
                תיאום פגישה
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/60 text-sm tracking-widest uppercase"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          גלילה
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-background">
        <div className="container px-6 flex flex-col items-center">
          <div className="text-center mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">עבודות נבחרות</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">מבחר פרויקטים אחרונים בעיצוב פנים וסטים המשלבים אסתטיקה ופונקציונליות.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 w-full max-w-6xl mb-16">
            {PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                {...project} 
                className={index % 2 === 1 ? "md:translate-y-16" : ""}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/portfolio">
              <Button variant="outline" className="px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2">
                לכל העבודות <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary/30">
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
               <div key={i} className="bg-background p-8 border border-border/50 hover:border-primary transition-all duration-300 group">
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
