import { Layout } from "@/components/layout/Layout";
import stockOwner from "@assets/stock_images/interior_designer_sk_b3da91c4.jpg";

export function About() {
  return (
    <Layout>
      <div className="container px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
           <div className="relative">
              <div className="aspect-[3/4] bg-muted overflow-hidden">
                <img src={stockOwner} alt="גל שינהורן" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-background p-8 border border-border hidden md:block max-w-xs text-right">
                <p className="font-bold italic text-lg leading-relaxed">
                  "עיצוב הוא לא רק איך שזה נראה, אלא איך שזה גורם לך להרגיש."
                </p>
              </div>
           </div>

           <div className="pt-8">
             <h1 className="text-4xl md:text-6xl font-bold mb-8">אהלן, אני גל.</h1>
             <div className="prose prose-lg text-muted-foreground mb-12">
               <p className="mb-6">
                 אני מעצב פנים וסטים מתל אביב, אובססיבי למשחקי אור, טקסטורה וצורה.
                 עם רקע באמנות וארכיטקטורה, אני ניגש לכל חלל כאל קומפוזיציה – ומאזן בין פונקציונליות לעומק נרטיבי.
               </p>
               <p className="mb-6">
                 העבודה שלי משלבת פרויקטים למגורים ברמה גבוהה, חללים מסחריים ועיצוב הפקה לקולנוע וטלוויזיה.
                 אני מאמין שלסביבה יש כוח להשפיע על רגש והתנהגות, ואני שואף ליצור חללים שמרגישים מבוססים אך בו זמנית מעוררי השראה.
               </p>
               <p>
                 כשאני לא מעצב, אפשר למצוא אותי מחפש מציאות בשוק הפשפשים, משרטט במוזיאונים או חוקר את ההיסטוריה האדריכלית של העיר.
               </p>
             </div>

             <div className="grid grid-cols-2 gap-8 mb-12">
               <div>
                 <h3 className="font-bold text-xl mb-4">גישה</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   מינימליסטית, אורגנית ומונעת מסיפור. אני נותן עדיפות לחומרים טבעיים ולפרקטיקה בת-קיימא ככל האפשר.
                 </p>
               </div>
               <div>
                 <h3 className="font-bold text-xl mb-4">כלים</h3>
                 <ul className="text-sm text-muted-foreground space-y-1">
                   <li>AutoCAD & SketchUp</li>
                   <li>Adobe Creative Suite</li>
                   <li>Blender (הדמיה תלת מימדית)</li>
                   <li>סקיצות ידניות</li>
                 </ul>
               </div>
             </div>

             <div className="border-t border-border pt-8">
               <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">פרסומים</h4>
               <div className="flex gap-8 opacity-50 grayscale">
                 {/* Placeholders for logos - simple text for now */}
                 <span className="font-bold text-xl">VOGUE</span>
                 <span className="font-bold text-xl">AD</span>
                 <span className="font-bold text-xl">dwell</span>
                 <span className="font-bold text-xl">DEZEEN</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </Layout>
  );
}
