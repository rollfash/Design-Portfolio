import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, Lightbulb, PenTool, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";

export function Services() {
  const services = [
    {
      title: "עיצוב פנים למגורים",
      description: "שירותי עיצוב מלאים לבתים, מתכנון שיפוץ ועד בחירת הריהוט.",
      features: ["תכנון חלל", "בחירת חומרים", "ריהוט בהתאמה אישית", "ניהול פרויקט"]
    },
    {
      title: "עיצוב סטים והפקה",
      description: "יצירת סביבות סוחפות לקולנוע, טלוויזיה, פרסומות ואירועי מותג.",
      features: ["פיתוח קונספט", "הדמיות תלת מימד", "רכש אביזרים", "סטיילינג על הסט"]
    },
    {
      title: "חללים מסחריים",
      description: "עיצוב סביבות מותג לחנויות, אירוח ומשרדים.",
      features: ["אינטגרציית מותג", "זרימת לקוחות", "עיצוב תאורה", "ליווי רישוי"]
    },
    {
      title: "ייעוץ וסטיילינג",
      description: "עין מקצועית לגימורים, אוצרות אמנות ואופטימיזציה של החלל.",
      features: ["ניהול אומנותי", "רכש דקורציה", "ייעוץ צבע", "הום סטיילינג"]
    }
  ];

  return (
    <Layout>
       <div className="container px-6 py-20 flex flex-col items-center">
         <div className="max-w-3xl mx-auto text-center mb-20">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">שירותים</h1>
           <p className="text-muted-foreground text-lg">
             אני מציע מגוון שירותי עיצוב המותאמים אישית לצרכים שלך.
             בין אם מדובר בשדרוג חדר בודד או בבניית מתחם מסחרי שלם, אני ניגש לכל פרויקט באותה רמת דיוק.
           </p>
         </div>

         {/* Process */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 relative w-full max-w-6xl">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-border z-0" />
            
            {[
              { icon: Lightbulb, title: "גילוי", desc: "מתחילים בהבנת החזון, הצרכים והאילוצים הייחודיים של החלל." },
              { icon: PenTool, title: "עיצוב", desc: "פיתוח קונספטים, הדמיות ופלטות חומרים כדי להפיח חיים בחזון." },
              { icon: HomeIcon, title: "ביצוע", desc: "ניהול הביצוע, הרכש וההתקנה להבטחת תוצאה מושלמת." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-background md:bg-transparent text-center px-4 flex flex-col items-center">
                <div className="w-24 h-24 mx-auto bg-secondary rounded-full flex items-center justify-center mb-6 text-primary">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-medium mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
         </div>

         {/* Service List */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 w-full max-w-6xl">
           {services.map((service, index) => (
             <div key={index} className="border border-border p-8 md:p-12 hover:border-primary/30 transition-all duration-300 bg-card flex flex-col items-center text-center">
               <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
               <p className="text-muted-foreground mb-8">{service.description}</p>
               <ul className="space-y-3 mb-8 w-full">
                 {service.features.map((feature) => (
                   <li key={feature} className="flex items-center justify-center text-sm">
                     <Check className="h-4 w-4 ml-3 text-primary" /> {feature}
                   </li>
                 ))}
               </ul>
               <Link href="/contact">
                 <Button variant="outline" className="w-full md:w-auto md:px-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">לפרטים נוספים</Button>
               </Link>
             </div>
           ))}
         </div>

         <div className="bg-primary text-primary-foreground p-12 md:p-24 text-center rounded-sm w-full max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכנים לשדרג את החלל?</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">בואו נדבר על הפרויקט שלכם ונראה איך אפשר להפוך את החזון למציאות.</p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-12 font-bold text-primary">תיאום פגישת ייעוץ</Button>
            </Link>
         </div>
       </div>
    </Layout>
  );
}
