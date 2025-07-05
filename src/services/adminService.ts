// src/services/adminService.ts

import apiClient from './apiClient';
import { AdminCreationPayload, RoleCreationPayload, AdminApiResponse, RolesApiResponse } from '../types/admin';

// CREATE ADMIN
export const createAdmin = async (adminData: AdminCreationPayload) => {
  
  // === THE FIX IS HERE ===
  // We receive an object like { name: "...", customRole: "MANAGER" } from the component.
  // We need to transform it into the object the API expects: { ..., role: "MANAGER" }.
  const apiPayload = {
    name: adminData.name,
    email: adminData.email,
    password: adminData.password,
    role: adminData.role // Map customRole to role
  };

  // Now we send the correctly structured payload to the API.
  const response = await apiClient.post('/admin/create-admin', apiPayload);
  return response.data;
};


// GET ALL ADMINS
export const getAdmins = async (): Promise<AdminApiResponse> => {
  const response = await apiClient.get<AdminApiResponse>('/admin/get-roles');
  return response.data; // Return the data part of the response
};

// CREATE A ROLE
export const createRole = async (roleData: RoleCreationPayload) => {
  const response = await apiClient.post('/admin/create-role', roleData);
  return response.data; // Return the data part of the response
};

// GET ALL ROLES (with the corrected endpoint)
export const getRoles = async (): Promise<RolesApiResponse> => {
  const response = await apiClient.get<RolesApiResponse>('/admin/get-roles');
  
  // === THE FIX IS HERE ===
  // The API sends the array directly, so we just return response.data
  return response.data;
};