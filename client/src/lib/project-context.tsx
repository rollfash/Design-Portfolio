import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project as DBProject } from '@shared/schema';

// Frontend Project interface extends DB Project (keeping compatibility)
export interface Project extends Omit<DBProject, 'createdAt'> {
  createdAt?: Date | string;
}

// Fallback projects when database is unavailable
const FALLBACK_PROJECTS: Project[] = [
  {
    id: "64c5cd4b-2f48-467f-9590-a13a185ae40b",
    title: "מה קורה פה?",
    titleEn: "What's Going On?",
    category: "עיצוב סט",
    categoryEn: "Set Design",
    image: "/objects/uploads/5c7773a7-0967-432a-9f89-96c39ad7b940",
    year: "2025",
    location: "אולפני הרצליה",
    locationEn: "Herzliya Studios",
    role: "Art Director",
    roleEn: "Art Director",
    description: "סט שעשועון \"מה קורה פה?\"\nרשת 13",
    descriptionEn: "Game show set design for \"What's Going On?\"\nChannel 13",
    date: "2025-07-01",
    services: null,
    servicesEn: null,
    gallery: [
      "/objects/uploads/d74520ac-5e3b-479a-8ae6-51cdac723123",
      "/objects/uploads/60eb5b5d-2533-468d-b30d-75e597166afd",
      "/objects/uploads/a3d09f4b-e44f-4a4a-b5e6-07cea24383a9"
    ],
    createdAt: "2025-12-23T20:52:56.067Z"
  },
  {
    id: "ac112d0b-a462-4580-9ea0-7a371d9a3a67",
    title: "הבוגדים",
    titleEn: "The Traitors",
    category: "עיצוב סט",
    categoryEn: "Set Design",
    image: "/objects/uploads/dea6d08b-4cf0-44e2-82be-30cc4545fb2e",
    year: "2023",
    location: "הונגריה",
    locationEn: "Hungary",
    role: "Art Director",
    roleEn: "Art Director",
    description: "ארט דיירקטור ואחראי תכנון משימות",
    descriptionEn: "Art Director and mission planning lead",
    date: "2023-06-07",
    services: null,
    servicesEn: null,
    gallery: [
      "/objects/uploads/dc22dec8-bb8c-4280-b694-6f8234216e24",
      "/objects/uploads/8a99a296-8a47-40fc-8076-6b77b9fea2c8"
    ],
    createdAt: "2025-12-23T18:55:34.383Z"
  }
];

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          console.warn('Failed to fetch projects from API, using fallback data');
          return FALLBACK_PROJECTS;
        }
        const data = await response.json() as Project[];
        return data.length > 0 ? data : FALLBACK_PROJECTS;
      } catch (error) {
        console.warn('API error, using fallback projects:', error);
        return FALLBACK_PROJECTS;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  const addMutation = useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'createdAt'>) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to create project (${response.status})`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Omit<Project, 'id' | 'createdAt'>> }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    await addMutation.mutateAsync(project);
  };

  const updateProject = async (id: string, updatedProject: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    await updateMutation.mutateAsync({ id, data: updatedProject });
  };

  const deleteProject = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <ProjectContext.Provider value={{ projects, isLoading, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
