// This file contains the database storage implementation
// It is NOT imported by default to avoid database connection at startup
// Only import this if you explicitly need database-backed storage

import { 
  users,
  projects,
  contactSubmissions,
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { db, withRetry } from "./db";
import { eq, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return withRetry(async () => {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    return withRetry(async () => {
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    });
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return withRetry(async () => {
      return await db.select().from(projects).orderBy(desc(projects.createdAt));
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return withRetry(async () => {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      return project || undefined;
    });
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    return withRetry(async () => {
      const [project] = await db
        .insert(projects)
        .values(insertProject)
        .returning();
      return project;
    });
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    return withRetry(async () => {
      const [project] = await db
        .update(projects)
        .set(updateData)
        .where(eq(projects.id, id))
        .returning();
      return project || undefined;
    });
  }

  async deleteProject(id: string): Promise<boolean> {
    return withRetry(async () => {
      const result = await db.delete(projects).where(eq(projects.id, id));
      return result.rowCount ? result.rowCount > 0 : false;
    });
  }

  // Contact Submissions
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return withRetry(async () => {
      return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.submittedAt));
    });
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    return withRetry(async () => {
      const [submission] = await db
        .insert(contactSubmissions)
        .values(insertSubmission)
        .returning();
      return submission;
    });
  }
}
