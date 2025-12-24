import * as admin from 'firebase-admin';
import { 
  type User, 
  type InsertUser,
  type Project,
  type InsertProject,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import type { IStorage } from "./storage";

let db: admin.firestore.Firestore;

function getDb() {
  if (!db) {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase credentials not configured. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        })
      });
    }
    db = admin.firestore();
  }
  return db;
}

export class FirebaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const doc = await getDb().collection('users').doc(id).get();
    if (!doc.exists) return undefined;
    return { id: doc.id, ...doc.data() } as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await getDb().collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    if (snapshot.empty) return undefined;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const docRef = await getDb().collection('users').add({
      ...insertUser,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as User;
  }

  async getAllProjects(): Promise<Project[]> {
    const snapshot = await getDb().collection('projects')
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    })) as Project[];
  }

  async getProject(id: string): Promise<Project | undefined> {
    const doc = await getDb().collection('projects').doc(id).get();
    if (!doc.exists) return undefined;
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date()
    } as Project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const docRef = await getDb().collection('projects').add({
      ...insertProject,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date()
    } as Project;
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const docRef = getDb().collection('projects').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return undefined;
    
    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();
    return { 
      id: updatedDoc.id, 
      ...data,
      createdAt: data?.createdAt?.toDate() || new Date()
    } as Project;
  }

  async deleteProject(id: string): Promise<boolean> {
    const docRef = getDb().collection('projects').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    const snapshot = await getDb().collection('contactSubmissions')
      .orderBy('submittedAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      submittedAt: doc.data().submittedAt?.toDate() || new Date()
    })) as ContactSubmission[];
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const docRef = await getDb().collection('contactSubmissions').add({
      ...insertSubmission,
      submittedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      submittedAt: data?.submittedAt?.toDate() || new Date()
    } as ContactSubmission;
  }
}
