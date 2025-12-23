import { db } from "./db";
import { projects } from "@shared/schema";

const initialProjects = [
  { 
    title: "ביתן תערוכה במדבר", 
    titleEn: "Desert Exhibition Pavilion",
    category: "תערוכות", 
    categoryEn: "Exhibitions",
    image: "/attached_assets/stock_images/minimalist_interior__cce91859.jpg", 
    year: "2024",
    location: "מצפה רמון, ישראל",
    locationEn: "Mitzpe Ramon, Israel",
    role: "מעצב ראשי",
    roleEn: "Lead Designer",
    description: "עיצוב ביתן חוויתי בלב המדבר, המשלב בין הטבע הפראי לטכנולוגיה מתקדמת. המבנה משמש כחלל תצוגה לאמנות דיגיטלית.",
    descriptionEn: "Experiential pavilion design in the heart of the desert, merging wild nature with advanced technology. The structure serves as an exhibition space for digital art.",
    services: ["עיצוב ביתנים", "תכנון חוויה", "הפקה"],
    servicesEn: ["Booth Design", "Experience Planning", "Production"],
    gallery: ["/attached_assets/stock_images/minimalist_interior__cce91859.jpg", "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", "/attached_assets/stock_images/minimalist_interior__cce91859.jpg", "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", "/attached_assets/stock_images/minimalist_interior__cce91859.jpg", "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg"]
  },
  { 
    title: "סט תוכנית אירוח", 
    titleEn: "Talk Show Set",
    category: "עיצוב סט", 
    categoryEn: "Set Design",
    image: "/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", 
    year: "2023",
    location: "תל אביב, ישראל",
    locationEn: "Tel Aviv, Israel",
    role: "מעצב הפקה",
    roleEn: "Production Designer",
    description: "עיצוב הסט המרכזי לתוכנית לייט-נייט חדשה. המטרה הייתה ליצור סביבה אינטימית אך ויזואלית מרשימה שעוברת מסך היטב מכל זווית. השתמשנו באלמנטים מודולריים ותאורת LED ניתנת לתכנות כדי לשנות את האווירה בין הסגמנטים השונים.",
    descriptionEn: "Designing the main set for a new late-night show. The goal was to create an intimate yet visually impressive environment that translates well on screen from every angle. We used modular elements and programmable LED lighting to change the atmosphere between segments.",
    services: ["עיצוב סט", "תכנון תאורה", "רכש אביזרים"],
    servicesEn: ["Set Design", "Lighting Design", "Prop Sourcing"],
    gallery: ["/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg", "/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg", "/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg"]
  },
  { 
    title: "לובי מלון בוטיק", 
    titleEn: "Boutique Hotel Lobby",
    category: "חלל חוויה", 
    categoryEn: "Experience Space",
    image: "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg", 
    year: "2024",
    location: "ירושלים, ישראל",
    locationEn: "Jerusalem, Israel",
    role: "מעצב ראשי",
    roleEn: "Lead Designer",
    description: "עיצוב לובי כחלל חוויתי המזמין את האורחים למסע בזמן. השילוב בין ישן לחדש יוצר אווירה אלגנטית ומזמינה.",
    descriptionEn: "Lobby design as an experiential space inviting guests on a journey through time. The blend of old and new creates an elegant and inviting atmosphere.",
    services: ["עיצוב חלל", "שימור", "תאורה"],
    servicesEn: ["Space Design", "Preservation", "Lighting"],
    gallery: ["/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg", "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg", "/attached_assets/stock_images/minimalist_interior__cce91859.jpg"]
  },
  { 
    title: "חלל תצוגה בטון", 
    titleEn: "Concrete Showroom",
    category: "תערוכות", 
    categoryEn: "Exhibitions",
    image: "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", 
    year: "2023",
    location: "קיסריה, ישראל",
    locationEn: "Caesarea, Israel",
    role: "אדריכל פנים",
    roleEn: "Interior Architect",
    description: "אולם תצוגה למותג רכב יוקרתי, המאופיין בקווים נקיים ושימוש נרחב בבטון חשוף וזכוכית להעצמת המוצר.",
    descriptionEn: "Showroom for a luxury car brand, characterized by clean lines and extensive use of exposed concrete and glass to highlight the product.",
    services: ["תכנון", "עיצוב פנים", "פיקוח"],
    servicesEn: ["Planning", "Interior Design", "Supervision"],
    gallery: ["/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", "/attached_assets/stock_images/minimalist_interior__cce91859.jpg", "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", "/attached_assets/stock_images/minimalist_interior__cce91859.jpg"]
  },
  { 
    title: "מרכז מבקרים הייטק", 
    titleEn: "Tech Visitor Center",
    category: "חלל חוויה", 
    categoryEn: "Experience Space",
    image: "/attached_assets/stock_images/minimalist_interior__cce91859.jpg", 
    year: "2023",
    location: "הרצליה, ישראל",
    locationEn: "Herzliya, Israel",
    role: "מעצב ראשי",
    roleEn: "Lead Designer",
    description: "מרכז מבקרים אינטראקטיבי לחברת טכנולוגיה, המעודד יצירתיות ושיתוף פעולה דרך מיצגים פיזיים ודיגיטליים.",
    descriptionEn: "Interactive visitor center for a technology company, encouraging creativity and collaboration through physical and digital exhibits.",
    services: ["עיצוב חלל", "מיתוג חלל"],
    servicesEn: ["Space Design", "Space Branding"],
    gallery: ["/attached_assets/stock_images/minimalist_interior__cce91859.jpg", "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg", "/attached_assets/stock_images/minimalist_interior__cce91859.jpg", "/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg"]
  },
  { 
    title: "סט צילומי אופנה", 
    titleEn: "Fashion Shoot Set",
    category: "עיצוב סט", 
    categoryEn: "Set Design",
    image: "/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", 
    year: "2022",
    location: "סטודיו תל אביב",
    locationEn: "Tel Aviv Studio",
    role: "סט דרסר",
    roleEn: "Set Dresser",
    description: "עיצוב סט לצילומי קמפיין אופנה חורף 2024. שימוש בטקסטורות עשירות ותאורה דרמטית.",
    descriptionEn: "Set design for Winter 2024 fashion campaign. Using rich textures and dramatic lighting.",
    services: ["עיצוב סט", "הלבשת חלל"],
    servicesEn: ["Set Design", "Space Dressing"],
    gallery: ["/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", "/attached_assets/stock_images/architectural_detail_6a7295b9.jpg", "/attached_assets/stock_images/modern_set_design_st_d7e6dca9.jpg", "/attached_assets/stock_images/boutique_hotel_lobby_961ec732.jpg"]
  },
];

async function seed() {
  console.log("Seeding database...");
  
  // Check if projects already exist
  const existingProjects = await db.select().from(projects);
  
  if (existingProjects.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  // Insert projects
  for (const project of initialProjects) {
    await db.insert(projects).values(project);
  }

  console.log(`Seeded ${initialProjects.length} projects`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
