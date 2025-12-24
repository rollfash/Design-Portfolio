import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, Lightbulb, PenTool, Home as HomeIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";

export function Services() {
  const { t, direction } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const services = [
    {
      title: t("service.exhibitions.title"),
      description: t("service.exhibitions.desc"),
      features: [t("feature.space_planning"), t("feature.materials"), t("feature.custom_furniture"), t("feature.project_mgmt")]
    },
    {
      title: t("service.set_design.title"),
      description: t("service.set_design.desc"),
      features: [t("feature.concept"), t("feature.3d"), t("feature.props"), t("feature.set_styling")]
    },
    {
      title: t("service.experience.title"),
      description: t("service.experience.desc"),
      features: [t("feature.brand"), t("feature.flow"), t("feature.lighting"), t("feature.permits")]
    },
    {
      title: t("service.styling.title"),
      description: t("service.styling.desc"),
      features: [t("feature.art"), t("feature.decor"), t("feature.color"), t("feature.home_styling")]
    }
  ];

  return (
    <Layout>
       <div className="container px-6 max-w-[1920px] py-20 flex flex-col items-center mx-auto">
         <div className="max-w-3xl mx-auto text-center mb-20">
           <h1 className="text-4xl md:text-6xl font-bold mb-6">{t("services.hero.title")}</h1>
           <p className="text-muted-foreground text-lg">
             {t("services.hero.subtitle")}
           </p>
         </div>

         {/* Process */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 relative w-full max-w-6xl">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-border z-0" />
            
            {[
              { icon: Lightbulb, title: t("services.process.discover"), desc: t("services.process.discover.desc") },
              { icon: PenTool, title: t("services.process.design"), desc: t("services.process.design.desc") },
              { icon: HomeIcon, title: t("services.process.execute"), desc: t("services.process.execute.desc") }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-background md:bg-transparent text-center px-8 py-8 flex flex-col items-center">
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
                     <Check className="h-4 w-4 mx-3 text-primary" /> {feature}
                   </li>
                 ))}
               </ul>
               <Link href="/contact">
                 <Button variant="outline" className="w-full md:w-auto md:px-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground">{t("services.more_info")}</Button>
               </Link>
             </div>
           ))}
         </div>

         <div className="bg-primary text-primary-foreground p-12 md:p-24 text-center rounded-sm w-full max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("services.cta.title")}</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">{t("services.cta.subtitle")}</p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="px-12 font-bold text-primary">{t("services.cta.button")}</Button>
            </Link>
         </div>
       </div>
    </Layout>
  );
}
