import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";

// Storage interface for all data operations
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Contact Submissions
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

// Use PostgreSQL database for persistent storage across deployments
import { DatabaseStorage } from "./database-storage";
export const storage = new DatabaseStorage();
