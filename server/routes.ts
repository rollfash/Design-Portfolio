import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { webcrypto } from "crypto";
const crypto = webcrypto as Crypto;
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertProjectSchema, insertContactSubmissionSchema, insertBlogPostSchema, pageViews } from "@shared/schema";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { getResendClient } from "./resend-client";
import { translateText, translateFields, isTranslationAvailable } from "./translate";
import multer from "multer";
import xss from "xss";
import { db } from "./db";
import { gte, sql, desc, count } from "drizzle-orm";

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

// In-memory session store: token -> expiry timestamp
const adminSessions = new Map<string, number>();
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function createSession(): string {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  adminSessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function isValidSession(token: string): boolean {
  const expiry = adminSessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) { adminSessions.delete(token); return false; }
  return true;
}

// Middleware: require valid admin session token
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token'] as string;
  if (!token || !isValidSession(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Strict rate limiter for admin login (5 attempts per 15 minutes per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validate that a project ID only contains safe characters (Firebase IDs)
function isValidId(id: string): boolean {
  return typeof id === 'string' && id.length > 0 && id.length <= 128 && /^[a-zA-Z0-9_\-]+$/.test(id);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // Admin login (strict rate limit: 5 attempts per 15 min per IP)
  app.post("/api/admin/login", loginLimiter, (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return res.status(500).json({ error: "Server misconfigured" });
    if (password === adminPassword) {
      const token = createSession();
      return res.json({ token });
    }
    return res.status(401).json({ error: "סיסמה שגויה" });
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    const token = req.headers['x-admin-token'] as string;
    if (token) adminSessions.delete(token);
    res.json({ ok: true });
  });

  // Admin session verify
  app.get("/api/admin/verify", (req, res) => {
    const token = req.headers['x-admin-token'] as string;
    res.json({ valid: isValidSession(token) });
  });

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

  // File upload endpoint - uploads to object storage for persistence (admin only)
  app.post("/api/upload", requireAdmin, upload.single("file"), async (req, res) => {
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

      const text = String(req.body.text ?? "").trim();
      const from = String(req.body.from ?? "Hebrew").slice(0, 32);
      const to   = String(req.body.to   ?? "English").slice(0, 32);

      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }
      if (text.length > 10000) {
        return res.status(400).json({ error: "Text is too long (max 10,000 characters)" });
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
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
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

  app.post("/api/projects", requireAdmin, async (req, res) => {
    try {
      const sanitizedBody = sanitizeObject(req.body);
      const validatedData = insertProjectSchema.parse(sanitizedBody);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: error.message || "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", requireAdmin, async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    try {
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

  app.delete("/api/projects/:id", requireAdmin, async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
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

  // Blog Posts API
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog", requireAdmin, async (req, res) => {
    try {
      const sanitizedBody = sanitizeObject(req.body);
      const validatedData = insertBlogPostSchema.parse(sanitizedBody);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ error: error.message || "Failed to create blog post" });
    }
  });

  app.patch("/api/blog/:id", requireAdmin, async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }
    try {
      const sanitizedBody = sanitizeObject(req.body);
      const validatedData = insertBlogPostSchema.partial().parse(sanitizedBody);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      if (!post) return res.status(404).json({ error: "Blog post not found" });
      res.json(post);
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      res.status(400).json({ error: error.message || "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", requireAdmin, async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ error: "Invalid blog post ID" });
    }
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) return res.status(404).json({ error: "Blog post not found" });
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Known bot user-agent patterns to filter out
  const BOT_PATTERNS = /bot|crawl|spider|slurp|baidu|bingpreview|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora|showyoubot|outbrain|pinterest|developers\.google\.com|wget|curl|python-requests|go-http-client|java\/|libwww/i;

  // Analytics - Record page view
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const userAgent = req.headers['user-agent'] || '';
      if (BOT_PATTERNS.test(userAgent)) {
        return res.status(200).json({ ok: true });
      }
      const { path, sessionId, duration } = req.body;
      if (!path || typeof path !== 'string') return res.status(400).json({ error: 'Invalid path' });
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || null;
      await db.insert(pageViews).values({
        path: path.slice(0, 500),
        sessionId: sessionId || null,
        ip,
        userAgent: userAgent.slice(0, 500),
        duration: typeof duration === 'number' ? duration : null,
      });
      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to record' });
    }
  });

  // Analytics - Get stats (for admin panel)
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const now = new Date();
      const day7ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const day30ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [totalToday] = await db.select({ count: count() }).from(pageViews).where(gte(pageViews.viewedAt, todayStart));
      const [total7days] = await db.select({ count: count() }).from(pageViews).where(gte(pageViews.viewedAt, day7ago));
      const [total30days] = await db.select({ count: count() }).from(pageViews).where(gte(pageViews.viewedAt, day30ago));

      // Top pages in last 30 days
      const topPages = await db.select({
        path: pageViews.path,
        count: count(),
      }).from(pageViews)
        .where(gte(pageViews.viewedAt, day30ago))
        .groupBy(pageViews.path)
        .orderBy(desc(count()))
        .limit(5);

      // Daily counts for last 7 days
      const dailyCounts = await db.select({
        day: sql<string>`to_char(${pageViews.viewedAt}, 'YYYY-MM-DD')`,
        count: count(),
      }).from(pageViews)
        .where(gte(pageViews.viewedAt, day7ago))
        .groupBy(sql`to_char(${pageViews.viewedAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(${pageViews.viewedAt}, 'YYYY-MM-DD')`);

      // Unique visitors (by IP) in last 30 days
      const [uniqueVisitors] = await db.select({
        count: sql<number>`count(distinct ${pageViews.ip})`,
      }).from(pageViews).where(gte(pageViews.viewedAt, day30ago));

      res.json({
        today: totalToday.count,
        last7days: total7days.count,
        last30days: total30days.count,
        uniqueVisitors30days: uniqueVisitors.count,
        topPages,
        dailyCounts,
      });
    } catch (error) {
      console.error("Analytics stats error:", error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  return httpServer;
}
