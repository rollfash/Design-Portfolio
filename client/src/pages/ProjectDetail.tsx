import { Layout } from "@/components/layout/Layout";
import { useParams } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react"; // RTL Arrows

// Asset imports
import stock1 from "@assets/stock_images/minimalist_interior__cce91859.jpg";
import stock2 from "@assets/stock_images/modern_set_design_st_d7e6dca9.jpg";
import stock3 from "@assets/stock_images/boutique_hotel_lobby_961ec732.jpg";
import stock4 from "@assets/stock_images/architectural_detail_6a7295b9.jpg";

const PROJECTS = {
  "desert-loft": {
    title: "שיפוץ לופט במדבר",
    category: "מגורים",
    location: "מצפה רמון, ישראל",
    year: "2024",
    role: "מעצב ראשי",
    description: "שיפוץ מלא של מבנה מדברי משנות ה-70 והפיכתו למקום מפלט מינימליסטי. העיצוב מתמקד בחומרים גולמיים, אור טבעי וחיבור ישיר לנוף המדברי. השתמשנו בבטון חשוף, עץ ממוחזר ופלטת צבעים שקטה כדי ליצור תחושת רוגע ובידוד.",
    services: ["תכנון פנים", "עיצוב ריהוט", "סטיילינג"],
    images: [stock1, stock4, stock1, stock4, stock1, stock4] 
  },
  "studio-talk": {
    title: "סט תוכנית אירוח",
    category: "עיצוב סט",
    location: "תל אביב, ישראל",
    year: "2023",
    role: "מעצב הפקה",
    description: "עיצוב הסט המרכזי לתוכנית לייט-נייט חדשה. המטרה הייתה ליצור סביבה אינטימית אך ויזואלית מרשימה שעוברת מסך היטב מכל זווית. השתמשנו באלמנטים מודולריים ותאורת LED ניתנת לתכנות כדי לשנות את האווירה בין הסגמנטים השונים.",
    services: ["עיצוב סט", "תכנון תאורה", "רכש אביזרים"],
    images: [stock2, stock3, stock2, stock3, stock2, stock3]
  },
  // Fallback 
};

export function ProjectDetail() {
  const { id } = useParams();
  // @ts-ignore
  const project = PROJECTS[id] || PROJECTS["desert-loft"];

  return (
    <Layout>
      <div className="container px-6 pt-12 pb-24">
        <Link href="/portfolio">
          <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowRight className="h-4 w-4 ml-2" /> חזרה לתיק העבודות
          </a>
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-8">
            <span className="text-primary/60 uppercase tracking-widest text-sm block mb-4">{project.category}</span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">{project.title}</h1>
            <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl pl-8 border-r-2 border-border/50">
              {project.description}
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end space-y-6 md:pr-12">
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">מיקום</h4>
              <p className="text-muted-foreground">{project.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">שנה</h4>
              <p className="text-muted-foreground">{project.year}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">תפקיד</h4>
              <p className="text-muted-foreground">{project.role}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-1">שירותים</h4>
              <ul className="text-muted-foreground list-none">
                {project.services.map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Image Grid */}
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
               <ArrowRight className="h-4 w-4"/> פרויקט קודם
             </Button>
           </Link>
           <Link href="/portfolio">
             <Button variant="ghost" className="gap-2">
               פרויקט הבא <ArrowLeft className="h-4 w-4"/>
             </Button>
           </Link>
        </div>
      </div>
    </Layout>
  );
}
