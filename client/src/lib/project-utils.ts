import { Project } from "@shared/schema";

/**
 * Sort projects by date (YYYY-MM-DD format) or year, most recent first.
 * Projects with a `date` field are prioritized.
 * If both are missing or invalid, treats as oldest (1900-01-01).
 */
export function sortProjectsByDate(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const dateA = getProjectSortDate(a);
    const dateB = getProjectSortDate(b);
    return dateB.localeCompare(dateA);
  });
}

/**
 * Get a sortable date string for a project.
 * Returns YYYY-MM-DD format, with fallbacks:
 * - If `date` exists and valid: use it
 * - If only `year` exists: use YYYY-01-01
 * - Otherwise: use 1900-01-01 (treat as oldest)
 */
function getProjectSortDate(project: Project): string {
  if (project.date) {
    const trimmed = project.date.trim();
    if (trimmed && /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
  }
  
  if (project.year) {
    const yearNum = parseInt(project.year, 10);
    if (!isNaN(yearNum) && yearNum > 1900 && yearNum < 2100) {
      return `${yearNum}-01-01`;
    }
  }
  
  return '1900-01-01';
}

/**
 * Get the N most recent projects by date
 */
export function getMostRecentProjects(projects: Project[], count: number): Project[] {
  const sorted = sortProjectsByDate(projects);
  return sorted.slice(0, count);
}
