import { Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-right md:text-right">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">גל שינהורן</h3>
            <p className="text-muted-foreground max-w-sm ml-auto md:ml-0 md:mr-auto">
              עיצוב פנים וסטים בגישה מינימליסטית. יצירת חללים שנושמים.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">תפריט</h4>
            <ul className="space-y-3">
              <li><Link href="/portfolio"><a className="text-muted-foreground hover:text-primary transition-colors">עבודות</a></Link></li>
              <li><Link href="/services"><a className="text-muted-foreground hover:text-primary transition-colors">שירותים</a></Link></li>
              <li><Link href="/about"><a className="text-muted-foreground hover:text-primary transition-colors">אודות</a></Link></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-primary transition-colors">צור קשר</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">יצירת קשר</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>hello@galshinhorn.com</li>
              <li>050-123-4567</li>
              <li>תל אביב, ישראל</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
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
