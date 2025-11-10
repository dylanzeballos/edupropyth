export interface Blueprint {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlueprintRequest {
  title: string;
  description?: string;
  thumbnail?: string;
  isActive?: boolean;
}

export type UpdateBlueprintRequest = Partial<CreateBlueprintRequest>;
