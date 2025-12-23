import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import type { IStorage } from "./storage";

interface FileStorageData {
  projects: Project[];
  contacts: ContactSubmission[];
  users?: User[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileStorage implements IStorage {
  private dataFile: string;
  private data: FileStorageData | null = null;

  constructor(dataFilePath: string = path.join(__dirname, 'projects.json')) {
    this.dataFile = dataFilePath;
  }

  private async loadData(): Promise<FileStorageData> {
    if (this.data) {
      return this.data;
    }

    try {
      const fileContent = await fs.readFile(this.dataFile, 'utf-8');
      this.data = JSON.parse(fileContent);
      return this.data!;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Data file not found, creating new one');
        this.data = { projects: [], contacts: [], users: [] };
        await this.saveData();
        return this.data;
      }
      console.error('Error loading data file:', error);
      throw new Error(`Failed to load data: ${error.message}`);
    }
  }

  private async saveData(): Promise<void> {
    if (!this.data) {
      throw new Error('No data to save');
    }

    try {
      const jsonContent = JSON.stringify(this.data, null, 2);
      await fs.writeFile(this.dataFile, jsonContent, 'utf-8');
    } catch (error: any) {
      console.error('Error saving data file:', error);
      throw new Error(`Failed to save data: ${error.message}`);
    }
  }

  // User methods (basic implementation for auth compatibility)
  async getUser(id: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users?.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const data = await this.loadData();
    return data.users?.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const data = await this.loadData();
    if (!data.users) {
      data.users = [];
    }

    const user: User = {
      id: randomUUID(),
      ...insertUser,
    };

    data.users.push(user);
    await this.saveData();
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    const data = await this.loadData();
    return data.projects.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA; // Sort descending (newest first)
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    const data = await this.loadData();
    return data.projects.find(p => p.id === id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const data = await this.loadData();

    const project: Project = {
      id: randomUUID(),
      title: insertProject.title,
      titleEn: insertProject.titleEn ?? null,
      category: insertProject.category,
      categoryEn: insertProject.categoryEn ?? null,
      image: insertProject.image,
      date: insertProject.date ?? null,
      year: insertProject.year,
      location: insertProject.location ?? null,
      locationEn: insertProject.locationEn ?? null,
      role: insertProject.role ?? null,
      roleEn: insertProject.roleEn ?? null,
      description: insertProject.description ?? null,
      descriptionEn: insertProject.descriptionEn ?? null,
      services: insertProject.services ?? null,
      servicesEn: insertProject.servicesEn ?? null,
      gallery: insertProject.gallery ?? null,
      createdAt: new Date(),
    };

    data.projects.push(project);
    await this.saveData();
    
    console.log(`Project created: ${project.id} - ${project.title}`);
    return project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const data = await this.loadData();
    const projectIndex = data.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      return undefined;
    }

    data.projects[projectIndex] = {
      ...data.projects[projectIndex],
      ...updateData,
    };

    await this.saveData();
    console.log(`Project updated: ${id}`);
    return data.projects[projectIndex];
  }

  async deleteProject(id: string): Promise<boolean> {
    const data = await this.loadData();
    const initialLength = data.projects.length;
    data.projects = data.projects.filter(p => p.id !== id);

    if (data.projects.length === initialLength) {
      return false;
    }

    await this.saveData();
    console.log(`Project deleted: ${id}`);
    return true;
  }

  // Contact Submission methods
  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const data = await this.loadData();
    return data.contacts.sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0).getTime();
      const dateB = new Date(b.submittedAt || 0).getTime();
      return dateB - dateA;
    });
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const data = await this.loadData();

    const submission: ContactSubmission = {
      id: randomUUID(),
      name: insertSubmission.name,
      email: insertSubmission.email,
      type: insertSubmission.type,
      budget: insertSubmission.budget ?? null,
      message: insertSubmission.message,
      submittedAt: new Date(),
    };

    data.contacts.push(submission);
    await this.saveData();
    
    console.log(`Contact submission created: ${submission.id} from ${submission.email}`);
    return submission;
  }
}
