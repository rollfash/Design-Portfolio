import { Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-6 flex flex-col items-center text-center">
        
        <h3 className="text-3xl font-bold mb-4 text-primary">גל שינהורן</h3>
        <p className="text-muted-foreground max-w-sm mb-12">
          עיצוב פנים וסטים בגישה מינימליסטית. יצירת חללים שנושמים.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-4xl mb-16">
          <div>
            <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-primary">תפריט</h4>
            <ul className="space-y-3">
              <li><Link href="/portfolio"><a className="text-muted-foreground hover:text-primary transition-colors">עבודות</a></Link></li>
              <li><Link href="/services"><a className="text-muted-foreground hover:text-primary transition-colors">שירותים</a></Link></li>
              <li><Link href="/about"><a className="text-muted-foreground hover:text-primary transition-colors">אודות</a></Link></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-primary transition-colors">צור קשר</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-primary">יצירת קשר</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li><a href="mailto:hello@galshinhorn.com" className="hover:text-primary">hello@galshinhorn.com</a></li>
              <li>050-123-4567</li>
              <li>תל אביב, ישראל</li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
             <h4 className="font-semibold mb-6 text-sm tracking-wider uppercase text-primary">חברתי</h4>
             <div className="flex gap-4">
              <a href="#" className="p-3 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-3 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="w-full border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground max-w-4xl">
          <p>© {new Date().getFullYear()} גל שינהורן. כל הזכויות שמורות.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">מדיניות פרטיות</a>
            <a href="#" className="hover:text-primary">תנאי שימוש</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
