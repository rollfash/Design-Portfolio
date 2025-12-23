import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'he' | 'en';
type Direction = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { he: "בית", en: "Home" },
  "nav.portfolio": { he: "עבודות", en: "Portfolio" },
  "nav.services": { he: "שירותים", en: "Services" },
  "nav.about": { he: "אודות", en: "About" },
  "nav.contact": { he: "צור קשר", en: "Contact" },
  "nav.mode.dark": { he: "מצב כהה", en: "Dark Mode" },
  "nav.mode.light": { he: "מצב בהיר", en: "Light Mode" },
  "nav.lang.en": { he: "EN", en: "EN" },
  "nav.lang.he": { he: "עב", en: "HE" },

  // Footer
  "footer.rights": { he: "כל הזכויות שמורות.", en: "All rights reserved." },
  "footer.privacy": { he: "מדיניות פרטיות", en: "Privacy Policy" },
  "footer.terms": { he: "תנאי שימוש", en: "Terms of Use" },
  "footer.menu": { he: "תפריט", en: "Menu" },
  "footer.contact": { he: "יצירת קשר", en: "Contact" },
  "footer.social": { he: "חברתי", en: "Social" },
  "footer.tagline": { he: "עיצוב פנים וסטים בגישה מינימליסטית. יצירת חללים שנושמים.", en: "Minimalist interior and set design. Creating spaces that breathe." },

  // Home
  "home.hero.subtitle": { he: "עיצוב פנים וסטים", en: "Interior & Set Design" },
  "home.hero.title": { he: "חללים שמספרים סיפור", en: "Spaces That Tell A Story" }, // Note: HTML might handle the break
  "home.hero.cta.portfolio": { he: "לתיק העבודות", en: "View Portfolio" },
  "home.hero.cta.contact": { he: "תיאום פגישה", en: "Book Consultation" },
  "home.scroll": { he: "גלילה", en: "Scroll" },
  "home.featured.title": { he: "עבודות נבחרות", en: "Selected Work" },
  "home.featured.subtitle": { he: "מבחר פרויקטים אחרונים בעיצוב פנים וסטים המשלבים אסתטיקה ופונקציונליות.", en: "A selection of recent interior and set design projects combining aesthetics and functionality." },
  "home.featured.viewAll": { he: "לכל העבודות", en: "View All Projects" },
  "home.services.title": { he: "שירותים", en: "Services" },
  "home.services.subtitle": { he: "מהקונספט ועד הביצוע, אני יוצר סביבות שמעצימות את המותג או את חווית המגורים שלך.", en: "From concept to execution, I create environments that elevate your brand or living experience." },
  "home.services.cta": { he: "לכל השירותים", en: "All Services" },

  // Portfolio
  "portfolio.title": { he: "עבודות נבחרות", en: "Selected Work" },
  "portfolio.subtitle": { he: "אוסף חללים נבחרים שתוכננו למגורים, עבודה והופעה.", en: "A curated collection of spaces designed for living, working, and performance." },
  "filter.all": { he: "הכל", en: "All" },
  "filter.set_design": { he: "עיצוב סט", en: "Set Design" },
  "filter.stage_event": { he: "עיצוב במה ואירועים", en: "Stage & Event Design" },
  "filter.commercial": { he: "עיצוב מסחרי", en: "Commercial Design" },

  // Services Page
  "services.hero.title": { he: "שירותים", en: "Services" },
  "services.hero.subtitle": { he: "פתרונות עיצוב מתקדמים לחללים מסחריים, תערוכות וסטים.", en: "Advanced design solutions for commercial spaces, exhibitions, and sets." },
  "services.process.discover": { he: "גילוי", en: "Discover" },
  "services.process.discover.desc": { he: "הבנת ערכי המותג, קהל היעד ומטרות החוויה.", en: "Understanding brand values, target audience, and experience goals." },
  "services.process.design": { he: "עיצוב", en: "Design" },
  "services.process.design.desc": { he: "יצירת קונספט חזותי ופונקציונלי שמעביר מסר מדויק.", en: "Creating a visual and functional concept that conveys a precise message." },
  "services.process.execute": { he: "ביצוע", en: "Execute" },
  "services.process.execute.desc": { he: "ניהול הפקה ופיקוח עד למסירה מושלמת.", en: "Production management and supervision until perfect delivery." },
  "services.cta.title": { he: "מוכנים ליצור חוויה?", en: "Ready to create an experience?" },
  "services.cta.subtitle": { he: "בואו נדבר על הפרויקט שלכם ונהפוך אותו למציאות.", en: "Let's discuss your project and turn it into reality." },
  "services.cta.button": { he: "תיאום פגישת ייעוץ", en: "Book a Consultation" },
  "services.more_info": { he: "לפרטים נוספים", en: "Learn More" },

  // Service Items
  "service.exhibitions.title": { he: "עיצוב תערוכות וביתנים", en: "Exhibitions & Booths" },
  "service.exhibitions.desc": { he: "תכנון ועיצוב ביתנים שמושכים תשומת לב ומייצרים אינטראקציה.", en: "Planning and designing booths that attract attention and create interaction." },
  "service.set_design.title": { he: "עיצוב סטים והפקה", en: "Set Design & Production" },
  "service.set_design.desc": { he: "יצירת סביבות סוחפות לקולנוע, טלוויזיה, פרסומות ואירועי מותג.", en: "Creating immersive environments for film, TV, commercials, and brand events." },
  "service.experience.title": { he: "חללי חוויה ומבקרים", en: "Experience & Visitor Centers" },
  "service.experience.desc": { he: "עיצוב מסעות לקוח ומרכזי מבקרים שמספרים את סיפור המותג.", en: "Designing customer journeys and visitor centers that tell the brand story." },
  "service.styling.title": { he: "סטיילינג והלבשת חלל", en: "Styling & Space Dressing" },
  "service.styling.desc": { he: "דיוק הפרטים הקטנים להשלמת האווירה והנראות.", en: "Refining small details to complete the atmosphere and look." },

  // Features
  "feature.space_planning": { he: "תכנון חלל", en: "Space Planning" },
  "feature.materials": { he: "בחירת חומרים", en: "Material Selection" },
  "feature.custom_furniture": { he: "ריהוט בהתאמה אישית", en: "Custom Furniture" },
  "feature.project_mgmt": { he: "ניהול פרויקט", en: "Project Management" },
  "feature.concept": { he: "פיתוח קונספט", en: "Concept Development" },
  "feature.3d": { he: "הדמיות תלת מימד", en: "3D Rendering" },
  "feature.props": { he: "רכש אביזרים", en: "Prop Sourcing" },
  "feature.set_styling": { he: "סטיילינג על הסט", en: "On-Set Styling" },
  "feature.brand": { he: "אינטגרציית מותג", en: "Brand Integration" },
  "feature.flow": { he: "זרימת לקוחות", en: "Customer Flow" },
  "feature.lighting": { he: "עיצוב תאורה", en: "Lighting Design" },
  "feature.permits": { he: "ליווי רישוי", en: "Permitting Support" },
  "feature.art": { he: "ניהול אומנותי", en: "Art Direction" },
  "feature.decor": { he: "רכש דקורציה", en: "Decor Procurement" },
  "feature.color": { he: "ייעוץ צבע", en: "Color Consultation" },
  "feature.home_styling": { he: "הום סטיילינג", en: "Home Styling" },

  // About
  "about.quote": { he: "\"עיצוב הוא לא רק איך שזה נראה, אלא איך שזה גורם לך להרגיש.\"", en: "\"Design is not just what it looks like and feels like. Design is how it works.\"" },
  "about.title": { he: "אהלן, אני גל.", en: "Hi, I'm Gal." },
  "about.p1": { he: "אני מעצב פנים וסטים מתל אביב, אובססיבי למשחקי אור, טקסטורה וצורה. עם רקע באמנות וארכיטקטורה, אני ניגש לכל חלל כאל קומפוזיציה – ומאזן בין פונקציונליות לעומק נרטיבי.", en: "I'm an interior and set designer based in Tel Aviv, obsessed with the interplay of light, texture, and form. With a background in fine arts and architecture, I approach every space as a composition—balancing functionality with narrative depth." },
  "about.p2": { he: "העבודה שלי משלבת פרויקטים למגורים ברמה גבוהה, חללים מסחריים ועיצוב הפקה לקולנוע וטלוויזיה. אני מאמין שלסביבה יש כוח להשפיע על רגש והתנהגות.", en: "My work spans high-end residential projects, commercial spaces, and production design for film and television. I believe environments have the power to influence emotion and behavior." },
  "about.approach": { he: "גישה", en: "Approach" },
  "about.approach.desc": { he: "מינימליסטית, אורגנית ומונעת מסיפור. עדיפות לחומרים טבעיים ולקיימות.", en: "Minimalist, organic, and narrative-driven. Prioritizing natural materials and sustainability." },
  "about.tools": { he: "כלים", en: "Tools" },
  "about.tools.list": { he: "AutoCAD & SketchUp, Adobe Creative Suite, Blender (הדמיה תלת מימדית), סקיצות ידניות", en: "AutoCAD & SketchUp, Adobe Creative Suite, Blender (3D Visualization), Hand Sketching" },
  "about.publications": { he: "פרסומים", en: "Publications" },

  // Contact
  "contact.title": { he: "בוא ניצור משהו יפה.", en: "Let's create something beautiful." },
  "contact.subtitle": { he: "בין אם יש לך פרויקט ספציפי בראש או שסתם בא לך לבדוק אפשרויות, אשמח לשמוע ממך. מלא את הפרטים בטופס ואחזור אליך תוך 2-3 ימי עסקים.", en: "Whether you have a specific project in mind or just want to explore possibilities, I'd love to hear from you. Fill out the form and I'll get back to you within 2-3 business days." },
  "contact.email": { he: "אימייל", en: "Email" },
  "contact.studio": { he: "סטודיו", en: "Studio" },
  "contact.phone": { he: "טלפון", en: "Phone" },
  "contact.address": { he: "שדרות רוטשילד 45, תל אביב", en: "45 Rothschild Blvd, Tel Aviv" },
  "contact.form.name": { he: "שם מלא", en: "Full Name" },
  "contact.form.email": { he: "אימייל", en: "Email" },
  "contact.form.type": { he: "סוג פרויקט", en: "Project Type" },
  "contact.form.type.placeholder": { he: "בחר", en: "Select" },
  "contact.form.budget": { he: "תקציב משוער", en: "Estimated Budget" },
  "contact.form.budget.placeholder": { he: "אופציונלי", en: "Optional" },
  "contact.form.message": { he: "הודעה", en: "Message" },
  "contact.form.message.placeholder": { he: "ספר לי קצת על הפרויקט...", en: "Tell me a bit about the project..." },
  "contact.form.submit": { he: "שלח הודעה", en: "Send Message" },
  "contact.form.success.title": { he: "ההודעה התקבלה", en: "Message Received" },
  "contact.form.success.desc": { he: "תודה, {name}. נדבר בקרוב.", en: "Thanks, {name}. We'll talk soon." },
  "contact.form.sendAgain": { he: "שלח הודעה נוספת", en: "Send another message" },
  "contact.form.other": { he: "אחר", en: "Other" },

  // Project Detail
  "project.back": { he: "חזרה לתיק העבודות", en: "Back to Portfolio" },
  "project.location": { he: "מיקום", en: "Location" },
  "project.year": { he: "שנה", en: "Year" },
  "project.role": { he: "תפקיד", en: "Role" },
  "project.services": { he: "שירותים", en: "Services" },
  "project.prev": { he: "פרויקט קודם", en: "Previous Project" },
  "project.next": { he: "פרויקט הבא", en: "Next Project" },

  // Hero Blocks
  "hero.en.p1": { 
    he: "Gal Shinhorn Studio is a design firm that specializes in representative spaces, experience spaces, and exhibitions. We've been in business for over 20 years and have helped many clients create powerful and impactful spaces.",
    en: "Gal Shinhorn Studio is a design firm that specializes in representative spaces, experience spaces, and exhibitions. We've been in business for over 20 years and have helped many clients create powerful and impactful spaces."
  },
  "hero.en.p2": {
    he: "Our team of experienced designers are passionate about creating projects that are both visually stunning and functional. We believe in taking a holistic approach to design, and strive to create spaces that are both aesthetically pleasing and emotionally resonant. With our unique blend of creativity and technical expertise, we are sure to make your vision come to life.",
    en: "Our team of experienced designers are passionate about creating projects that are both visually stunning and functional. We believe in taking a holistic approach to design, and strive to create spaces that are both aesthetically pleasing and emotionally resonant. With our unique blend of creativity and technical expertise, we are sure to make your vision come to life."
  },
  "hero.he.p1": {
    he: "סטודיו גל שינהורן הינו משרד עיצוב המתמחה בחללים ייצוגיים, חללי חוויה ותערוכות. אנו עוסקים יותר מ-20 שנה ועזרנו ללקוחות רבים ליצור חללים עוצמתיים ומשפיעים.",
    en: "Gal Shinhorn Studio is a design firm that specializes in representative spaces, experience spaces, and exhibitions. We've been in business for over 20 years and have helped many clients create powerful and impactful spaces."
  },
  "hero.he.p2": {
    he: "צוות המעצבים המנוסים שלנו נלהב ליצור פרויקטים שהם גם מדהימים ויזואלית וגם פונקציונליים. אנו מאמינים בגישה הוליסטית לעיצוב, ושואפים ליצור חללים שהם גם אסתטיים וגם מהדהדים רגשית. עם השילוב הייחודי שלנו של יצירתיות ומומחיות טכנית, אנו בטוחים שנגרום לחזון שלך להתעורר לחיים.",
    en: "Our team of experienced designers are passionate about creating projects that are both visually stunning and functional. We believe in taking a holistic approach to design, and strive to create spaces that are both aesthetically pleasing and emotionally resonant. With our unique blend of creativity and technical expertise, we are sure to make your vision come to life."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('he');
  const [direction, setDirection] = useState<Direction>('rtl');

  useEffect(() => {
    // Load from local storage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    // Update direction and HTML tag
    const newDir = language === 'he' ? 'rtl' : 'ltr';
    setDirection(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
