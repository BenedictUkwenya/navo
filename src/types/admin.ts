// src/types/admin.ts
export interface Role {
  id: string;
  name: string;
  description?: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  status?: 'Active' | 'Inactive';
  customRole: Role;
}

export interface AdminCreationPayload {
  name: string;
  email: string;
  password: string;
  role: string; // The role NAME, not the object
}

export interface RoleCreationPayload {
  name: string;
}

// For API responses
export interface AdminApiResponse {
  success: boolean;
  data: {
    users: AdminUser[];
    // ...other potential pagination data
  }
}

export type RolesApiResponse = Role[];