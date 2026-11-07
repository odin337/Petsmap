export const PIN_ROLE_OPTIONS = [
  "Заводчик",
  "Питомник",
  "Клуб",
  "Хендлер",
  "Ветеринар",
] as const;

export type PinRole = (typeof PIN_ROLE_OPTIONS)[number];

export interface PinCoordinates {
  lat: number;
  lng: number;
}

export interface PedigreeEntry {
  id: string;
  name: string;
  note?: string;
}

export interface PedigreeGeneration {
  label: string;
  entries: PedigreeEntry[];
}

export interface PedigreeTreeData {
  generations: PedigreeGeneration[];
}

export interface DysplasiaDocument {
  name: string;
  url: string;
  mimeType: "application/pdf" | "application/msword" | "other";
  description?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export interface PinRecord {
  id: string;
  role: PinRole;
  species: string;
  breed: string;
  petName: string;
  birthDate: string;
  titles: string[];
  location: PinCoordinates;
  city: string;
  contactName: string;
  description: string;
  isRainbow: boolean;
  pedigree: PedigreeTreeData | null;
  dysplasiaTest: DysplasiaDocument | null;
  gallery: GalleryImage[];
  videoUrl: string;
}
