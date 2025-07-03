// src/types/supportTicket.ts

interface TicketUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }
  
  export interface SupportTicket {
    id: string;
    user: TicketUser;
    items: any[]; // We don't know the shape of this yet
    createdAt: string;
    // We'll need to see the real data to know the status field name
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  }
  
  export interface SupportTicketsApiResponse {
    data: {
      allOrders: SupportTicket[]; // Renaming 'allOrders' to 'tickets' would be ideal later
      pagination: {
        currentPage: number;
        totalPages: number;
        limit: number;
      };
    };
  }