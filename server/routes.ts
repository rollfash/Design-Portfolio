import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertContactSubmissionSchema } from "@shared/schema";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { getResendClient } from "./resend-client";
import { translateText, translateFields, isTranslationAvailable } from "./translate";
import multer from "multer";
import xss from "xss";

// Sanitize user input to prevent XSS attacks
function sanitizeInput(input: string): string {
  return xss(input, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });
}

// Sanitize object fields recursively
function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized as T;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // Configure multer for file uploads (memory storage for object storage upload)
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 100 * 1024 * 1024, // 100MB max file size for videos
    },
    fileFilter: (req, file, cb) => {
      // Accept images and videos
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo',
        'video/x-matroska', 'video/mpeg', 'video/3gpp', 'video/x-flv'
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only image and video files are allowed"));
      }
      cb(null, true);
    },
  });

  // File upload endpoint - uploads to object storage for persistence
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { ObjectStorageService } = await import("./replit_integrations/object_storage");
      const objectStorageService = new ObjectStorageService();
      
      // Extract file extension from original filename
      const originalName = req.file.originalname;
      const extMatch = originalName.match(/\.([^.]+)$/);
      const extension = extMatch ? extMatch[1].toLowerCase() : undefined;
      
      // Get presigned URL for upload (includes extension for video detection)
      const uploadURL = await objectStorageService.getObjectEntityUploadURL(extension);
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      
      // Upload file buffer directly to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: req.file.buffer,
        headers: {
          "Content-Type": req.file.mimetype,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to object storage: ${uploadResponse.statusText}`);
      }
      
      console.log(`File uploaded to object storage: ${objectPath} (${req.file.size} bytes)`);
      
      res.json({
        url: objectPath,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        error: error.message || "Failed to upload file",
        details: error.toString()
      });
    }
  });

  // Error handler for multer
  app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File is too large. Maximum size is 100MB." });
      }
      return res.status(400).json({ error: error.message });
    }
    next(error);
  });

  // SEO endpoints
  // robots.txt
  app.get("/robots.txt", (req, res) => {
    const host = req.get('host') || 'gal-shinhorn-portfolio.replit.app';
    const protocol = req.protocol || 'https';
    const baseURL = `${protocol}://${host}`;
    
    res.type('text/plain');
    res.send(`# Robot Rules
User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${baseURL}/sitemap.xml
`);
  });

  // sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const host = req.get('host') || 'gal-shinhorn-portfolio.replit.app';
      const protocol = req.protocol || 'https';
      const baseURL = `${protocol}://${host}`;
      
      const projects = await storage.getAllProjects();
      const now = new Date().toISOString().split('T')[0];
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseURL}/</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${baseURL}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseURL}/" />
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <lastmod>${now}</lastmod>
  </url>
  <url>
    <loc>${baseURL}/portfolio</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${baseURL}/portfolio" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseURL}/portfolio" />
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${now}</lastmod>
  </url>
  <url>
    <loc>${baseURL}/services</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${baseURL}/services" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseURL}/services" />
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <lastmod>${now}</lastmod>
  </url>
  <url>
    <loc>${baseURL}/about</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${baseURL}/about" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseURL}/about" />
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${now}</lastmod>
  </url>
  <url>
    <loc>${baseURL}/contact</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${baseURL}/contact" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseURL}/contact" />
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${now}</lastmod>
  </url>
`;
      
      // Add project pages
      for (const project of projects) {
        const projectDate = project.createdAt 
          ? new Date(project.createdAt).toISOString().split('T')[0] 
          : now;
        sitemap += `  <url>
    <loc>${baseURL}/project/${project.id}</loc>
    <xhtml:link rel="alternate" hreflang="he" href="${baseURL}/project/${project.id}" />
    <xhtml:link rel="alternate" hreflang="en" href="${baseURL}/project/${project.id}" />
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${projectDate}</lastmod>
  </url>
`;
      }
      
      sitemap += `</urlset>`;
      
      res.type('application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Translation API
  app.post("/api/translate", async (req, res) => {
    try {
      if (!isTranslationAvailable()) {
        return res.status(503).json({ 
          error: "Translation service not configured",
          available: false 
        });
      }

      const { text, from = "Hebrew", to = "English" } = req.body;
      
      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Text is required" });
      }

      const translated = await translateText(text, from, to);
      res.json({ 
        original: text,
        translated,
        from,
        to 
      });
    } catch (error: any) {
      console.error("Translation error:", error);
      res.status(500).json({ error: error.message || "Translation failed" });
    }
  });

  // Check translation availability
  app.get("/api/translate/status", (req, res) => {
    res.json({ available: isTranslationAvailable() });
  });

  // Projects API
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      // Sanitize input before validation
      const sanitizedBody = sanitizeObject(req.body);
      const validatedData = insertProjectSchema.parse(sanitizedBody);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: error.message || "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      // Sanitize input before validation
      const sanitizedBody = sanitizeObject(req.body);
      const validatedData = insertProjectSchema.partial().parse(sanitizedBody);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      console.error("Error updating project:", error);
      res.status(400).json({ error: error.message || "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Contact Submissions API
  app.post("/api/contact", async (req, res) => {
    try {
      // Sanitize input before validation
      const sanitizedBody = sanitizeObject(req.body);
      const validatedData = insertContactSubmissionSchema.parse(sanitizedBody);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification via Resend
      try {
        const { client } = await getResendClient();
        // Use Resend's default sender - custom domains require verification
        const senderEmail = 'Gal Shinhorn Portfolio <onboarding@resend.dev>';
        console.log("Sending email from:", senderEmail);
        // All values are already sanitized
        const result = await client.emails.send({
          from: senderEmail,
          to: 'galart1@gmail.com',
          subject: `New Contact Form Submission from ${validatedData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.name}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Type:</strong> ${validatedData.type}</p>
            ${validatedData.budget ? `<p><strong>Budget:</strong> ${validatedData.budget}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
          `
        });
        console.log("Email send result:", JSON.stringify(result));
      } catch (emailError: any) {
        console.error("Failed to send email notification:", emailError?.message || emailError);
        // Don't fail the request if email fails - submission is still saved
      }
      
      res.status(201).json(submission);
    } catch (error: any) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ error: error.message || "Failed to submit contact form" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  return httpServer;
}
