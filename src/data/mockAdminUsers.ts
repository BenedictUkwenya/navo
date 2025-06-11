// src/data/mockAdminUsers.ts

export type UserStatus = 'Active' | 'Inactive';

// 1. ADD phone and jobTitle to the interface
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  jobTitle: string;
  status: UserStatus;
}

// 2. UPDATE the mock data array
export const mockAdminUsers: AdminUser[] = [
  { id: 'usr_01', name: 'Oladapo Koiki', email: 'khalid@buylogding.com', phone: '+234 802 938 6768', role: 'Data Analysts', jobTitle: 'Data Manager', status: 'Active' },
  { id: 'usr_02', name: 'Adebayo Tunde', email: 'adebayo.t@example.com', phone: '+234 803 123 4567', role: 'Administrator', jobTitle: 'Head of Operations', status: 'Inactive' },
  { id: 'usr_03', name: 'Chioma Nwosu', email: 'chioma.n@example.com', phone: '+234 804 234 5678', role: 'Support Staff', jobTitle: 'Customer Support Lead', status: 'Active' },
  { id: 'usr_04', name: 'Musa Aliyu', email: 'musa.a@example.com', phone: '+234 805 345 6789', role: 'Data Analysts', jobTitle: 'Junior Analyst', status: 'Active' },
  // ... add more if you like
];