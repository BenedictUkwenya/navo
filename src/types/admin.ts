// src/types/admin.ts

export interface Role {
    id: string;
    name: string;
  }
  
  export interface AdminUser {
    id: string;
    name: string;
    email: string;
    customRole: {
      name: string;
    };
    // Add other fields from your user list table if needed
    status?: 'Active' | 'Inactive';
  }
  
  // For the GET /api/v1/admin/all-admins endpoint (assuming it exists)
  export interface AdminUsersApiResponse {
    // Assuming a similar structure to other list endpoints
    data: {
      users: AdminUser[];
      pagination: any;
    }
  }