import { Layout } from "@/components/layout/Layout";
import stockOwner from "@assets/stock_images/interior_designer_sk_b3da91c4.jpg";

export function About() {
  return (
    <Layout>
      <div className="container px-6 py-20 flex flex-col items-center">
        <div className="max-w-5xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             {/* Order changed on mobile vs desktop to center the layout visually */}
             <div className="relative order-2 md:order-1 flex justify-center md:justify-end">
                <div className="aspect-[3/4] bg-muted overflow-hidden max-w-sm w-full relative">
                  <img src={stockOwner} alt="גל שינהורן" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border border-primary/20 m-4 pointer-events-none"></div>
                </div>
             </div>

             <div className="order-1 md:order-2 text-center md:text-right">
               <h1 className="text-4xl md:text-6xl font-bold mb-8 text-primary">אהלן, אני גל.</h1>
               <div className="prose prose-lg text-muted-foreground mb-12 mx-auto md:mx-0">
                 <p className="mb-6">
                   אני מעצב פנים וסטים מתל אביב, אובססיבי למשחקי אור, טקסטורה וצורה.
                   עם רקע באמנות וארכיטקטורה, אני ניגש לכל חלל כאל קומפוזיציה – ומאזן בין פונקציונליות לעומק נרטיבי.
                 </p>
                 <p className="mb-6">
                   העבודה שלי משלבת פרויקטים למגורים ברמה גבוהה, חללים מסחריים ועיצוב הפקה לקולנוע וטלוויזיה.
                   אני מאמין שלסביבה יש כוח להשפיע על רגש והתנהגות.
                 </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 text-center md:text-right">
                 <div className="bg-secondary/20 p-6 border border-border">
                   <h3 className="font-bold text-xl mb-4 text-primary">גישה</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     מינימליסטית, אורגנית ומונעת מסיפור. עדיפות לחומרים טבעיים ולקיימות.
                   </p>
                 </div>
                 <div className="bg-secondary/20 p-6 border border-border">
                   <h3 className="font-bold text-xl mb-4 text-primary">כלים</h3>
                   <ul className="text-sm text-muted-foreground space-y-1 list-none">
                     <li>AutoCAD & SketchUp</li>
                     <li>Adobe Creative Suite</li>
                     <li>Blender (הדמיה תלת מימדית)</li>
                     <li>סקיצות ידניות</li>
                   </ul>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="mt-20 pt-12 border-t border-border text-center">
             <div className="bg-primary/5 inline-block p-8 md:p-12 rounded-lg max-w-3xl">
                <p className="font-bold italic text-2xl leading-relaxed text-primary/80">
                  "עיצוב הוא לא רק איך שזה נראה, אלא איך שזה גורם לך להרגיש."
                </p>
             </div>
             
             <div className="mt-16">
               <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-8">פרסומים</h4>
               <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
                 <span className="font-bold text-2xl">VOGUE</span>
                 <span className="font-bold text-2xl">AD</span>
                 <span className="font-bold text-2xl">dwell</span>
                 <span className="font-bold text-2xl">DEZEEN</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
