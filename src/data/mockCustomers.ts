// src/data/mockCustomers.ts

export type CustomerStatus = 'Verified' | 'Blocked' | 'Unverified';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  dateCreated: string;
  status: CustomerStatus;
}

// A larger list to test pagination and search
export const mockCustomers: Customer[] = [
  { id: '476328', name: 'Oladapo Koliki', phone: '08029386768', email: 'b.koliki@gmail.com', dateCreated: '03/03/2025', status: 'Verified' },
  { id: '476329', name: 'Aisha Bello', phone: '09012345678', email: 'a.bello@example.com', dateCreated: '03/02/2025', status: 'Blocked' },
  { id: '476330', name: 'Emeka Nwosu', phone: '08187654321', email: 'emeka.n@example.com', dateCreated: '03/01/2025', status: 'Unverified' },
  { id: '476331', name: 'Fatima Garba', phone: '07055556666', email: 'fatima.g@example.com', dateCreated: '02/28/2025', status: 'Verified' },
  { id: '476332', name: 'Tunde Adebayo', phone: '08033334444', email: 't.adebayo@example.com', dateCreated: '02/27/2025', status: 'Verified' },
  { id: '476333', name: 'Chioma Okoro', phone: '09098765432', email: 'chi.okoro@example.com', dateCreated: '02/26/2025', status: 'Blocked' },
  { id: '476334', name: 'Musa Ibrahim', phone: '08123456789', email: 'm.ibrahim@example.com', dateCreated: '02/25/2025', status: 'Verified' },
  { id: '476335', name: 'Yemi Alade', phone: '07011223344', email: 'y.alade@example.com', dateCreated: '02/24/2025', status: 'Unverified' },
  { id: '476336', name: 'Segun Arinze', phone: '08056789012', email: 's.arinze@example.com', dateCreated: '02/23/2025', status: 'Verified' },
  { id: '476337', name: 'Ngozi Eze', phone: '09045678901', email: 'n.eze@example.com', dateCreated: '02/22/2025', status: 'Verified' },
  { id: '476338', name: 'David Adeleke', phone: '08167890123', email: 'davido@example.com', dateCreated: '02/21/2025', status: 'Blocked' },
  { id: '476339', name: 'Ayo Balogun', phone: '07034567890', email: 'wizkid@example.com', dateCreated: '02/20/2025', status: 'Verified' },
];