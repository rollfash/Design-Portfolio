import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertContactSubmissionSchema } from "@shared/schema";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { getResendClient } from "./resend-client";
import multer from "multer";

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
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      console.error("Error creating project:", error);
      res.status(400).json({ error: error.message || "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
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
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // Send email notification via Resend
      try {
        const { client } = await getResendClient();
        // Use Resend's default sender - custom domains require verification
        const senderEmail = 'Gal Shinhorn Portfolio <onboarding@resend.dev>';
        console.log("Sending email from:", senderEmail);
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
