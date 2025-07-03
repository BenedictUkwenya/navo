// src/services/adminService.ts
import apiClient from './apiClient';
import { Role, AdminUser } from '../types/admin';

// We'll assume an endpoint to get all admins exists
export const getAdmins = async (): Promise<any> => {
    // Replace with the actual endpoint when available
    return apiClient.get('/admin/all'); 
}

// We'll assume an endpoint to get all roles exists
export const getRoles = async (): Promise<{ roles: Role[] }> => {
    // Replace with the actual endpoint when available
    return apiClient.get('/admin/roles');
}

export const createAdmin = async (adminData: Omit<AdminUser, 'id' | 'customRole'> & { customRole: string, password?: string }): Promise<{ user: AdminUser }> => {
  try {
    const response = await apiClient.post('/admin/create-admin', adminData);
    return response.data;
  } catch (error) {
    console.error('Failed to create admin:', error);
    throw error;
  }
};

export const createRole = async (name: string): Promise<{ role: Role }> => {
    try {
        const response = await apiClient.post('/admin/create-role', { name });
        return response.data;
    } catch (error) {
        console.error('Failed to create role:', error);
        throw error;
    }
}