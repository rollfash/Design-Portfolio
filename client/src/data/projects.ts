import stock1 from "@assets/stock_images/minimalist_interior__cce91859.jpg";
import stock2 from "@assets/stock_images/modern_set_design_st_d7e6dca9.jpg";
import stock3 from "@assets/stock_images/boutique_hotel_lobby_961ec732.jpg";
import stock4 from "@assets/stock_images/architectural_detail_6a7295b9.jpg";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string; // Main thumbnail
  year: string;
  location?: string;
  role?: string;
  description?: string;
  services?: string[];
  gallery?: string[]; // Detail page images
}

export const projects: Project[] = [
  { 
    id: "desert-loft", 
    title: "שיפוץ לופט במדבר", 
    category: "מגורים", 
    image: stock1, 
    year: "2024",
    location: "מצפה רמון, ישראל",
    role: "מעצב ראשי",
    description: "שיפוץ מלא של מבנה מדברי משנות ה-70 והפיכתו למקום מפלט מינימליסטי. העיצוב מתמקד בחומרים גולמיים, אור טבעי וחיבור ישיר לנוף המדברי. השתמשנו בבטון חשוף, עץ ממוחזר ופלטת צבעים שקטה כדי ליצור תחושת רוגע ובידוד.",
    services: ["תכנון פנים", "עיצוב ריהוט", "סטיילינג"],
    gallery: [stock1, stock4, stock1, stock4, stock1, stock4]
  },
  { 
    id: "studio-talk", 
    title: "סט תוכנית אירוח", 
    category: "עיצוב סט", 
    image: stock2, 
    year: "2023",
    location: "תל אביב, ישראל",
    role: "מעצב הפקה",
    description: "עיצוב הסט המרכזי לתוכנית לייט-נייט חדשה. המטרה הייתה ליצור סביבה אינטימית אך ויזואלית מרשימה שעוברת מסך היטב מכל זווית. השתמשנו באלמנטים מודולריים ותאורת LED ניתנת לתכנות כדי לשנות את האווירה בין הסגמנטים השונים.",
    services: ["עיצוב סט", "תכנון תאורה", "רכש אביזרים"],
    gallery: [stock2, stock3, stock2, stock3, stock2, stock3]
  },
  { 
    id: "hotel-lobby", 
    title: "לובי מלון בוטיק", 
    category: "מסחרי", 
    image: stock3, 
    year: "2024",
    location: "ירושלים, ישראל",
    role: "מעצב פנים",
    description: "עיצוב לובי למלון בוטיק היסטורי. השילוב בין ישן לחדש יוצר אווירה אלגנטית ומזמינה.",
    services: ["עיצוב פנים", "שימור", "תאורה"],
    gallery: [stock3, stock4, stock3, stock1]
  },
  { 
    id: "concrete-villa", 
    title: "וילת בטון", 
    category: "מגורים", 
    image: stock4, 
    year: "2023",
    location: "קיסריה, ישראל",
    role: "אדריכל פנים",
    description: "בית פרטי המאופיין בקווים נקיים ושימוש נרחב בבטון חשוף וזכוכית.",
    services: ["תכנון", "עיצוב פנים", "פיקוח"],
    gallery: [stock4, stock1, stock4, stock1]
  },
  { 
    id: "minimal-office", 
    title: "משרדי הייטק", 
    category: "מסחרי", 
    image: stock1, 
    year: "2023",
    location: "הרצליה, ישראל",
    role: "מעצב ראשי",
    description: "חלל עבודה גמיש ומודרני לחברת טכנולוגיה, המעודד יצירתיות ושיתוף פעולה.",
    services: ["עיצוב משרדים", "מיתוג חלל"],
    gallery: [stock1, stock3, stock1, stock2]
  },
  { 
    id: "fashion-shoot", 
    title: "סט צילומי אופנה", 
    category: "עיצוב סט", 
    image: stock2, 
    year: "2022",
    location: "סטודיו תל אביב",
    role: "סט דרסר",
    description: "עיצוב סט לצילומי קמפיין אופנה חורף 2024. שימוש בטקסטורות עשירות ותאורה דרמטית.",
    services: ["עיצוב סט", "הלבשת חלל"],
    gallery: [stock2, stock4, stock2, stock3]
  },
];
