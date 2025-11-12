export interface Blueprint {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  editionsCount?: number;
  draftEditionsCount?: number;
  activeEditionsCount?: number;
  historicEditionsCount?: number;
}

export interface CreateBlueprintRequest {
  title: string;
  description?: string;
  thumbnail?: string;
  isActive?: boolean;
}

export type UpdateBlueprintRequest = Partial<CreateBlueprintRequest>;
