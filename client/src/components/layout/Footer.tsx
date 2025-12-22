import { Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-4">ELENA VANCE</h3>
            <p className="text-muted-foreground max-w-sm">
              Creating minimalist spaces that breathe. Specializing in residential interiors and set design for film & photography.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Menu</h4>
            <ul className="space-y-3">
              <li><Link href="/portfolio"><a className="text-muted-foreground hover:text-primary transition-colors">Portfolio</a></Link></li>
              <li><Link href="/services"><a className="text-muted-foreground hover:text-primary transition-colors">Services</a></Link></li>
              <li><Link href="/about"><a className="text-muted-foreground hover:text-primary transition-colors">About</a></Link></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-primary transition-colors">Contact</a></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>hello@elenavance.com</li>
              <li>+1 (555) 123-4567</li>
              <li>Los Angeles, CA</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-background rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Elena Vance Design. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
