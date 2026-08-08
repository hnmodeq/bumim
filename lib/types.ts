export type ProjectType = "video" | "image" | "audio";

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  type: ProjectType;
  src: string;
  poster: string;
  orientation: string;
  hasDescription: boolean;
  description: string;
  detailAutoplay: boolean;
  planId: string;
  planLabel: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectCategory {
  key: string;
  label: string;
  sortOrder?: number;
}

export interface TeamSocial {
  icon: string;
  link: string;
  text: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  socials: Record<string, TeamSocial>;
}

export interface PricingData {
  basePrice: number;
  multipliers: Record<string, number>;
  updatedAt?: string;
}

export interface UploadResult {
  url: string;
  path: string;
}
