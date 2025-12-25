import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { useSEO } from "@/lib/seo";
import { Home, ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  const { language, direction } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  useSEO({
    title: language === 'he' ? 'דף לא נמצא - 404' : '404 - Page Not Found',
    description: language === 'he' 
      ? 'הדף שחיפשת לא נמצא. חזור לדף הבית או עיין בתיק העבודות שלנו.'
      : 'The page you are looking for could not be found. Return home or browse our portfolio.',
    noindex: true
  });

  return (
    <Layout>
      <div className="container px-6 max-w-[1920px] py-32 flex flex-col items-center justify-center min-h-[60vh] mx-auto">
        <div className="text-center max-w-2xl">
          <h1 className="text-8xl md:text-9xl font-bold mb-6 text-primary/20">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'he' ? 'הדף לא נמצא' : 'Page Not Found'}
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            {language === 'he' 
              ? 'מצטערים, הדף שחיפשת לא קיים או הועבר למיקום אחר.'
              : 'Sorry, the page you are looking for does not exist or has been moved.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="gap-2" size="lg">
                <Home className="h-5 w-5" />
                {language === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" className="gap-2" size="lg">
                {language === 'he' ? 'לתיק העבודות' : 'View Portfolio'}
                <ArrowIcon className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
