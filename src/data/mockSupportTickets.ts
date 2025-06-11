// src/data/mockSupportTickets.ts

export type TicketStatus = 'Pending' | 'Answered' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High';

// 1. ADD NEW FIELDS TO THE INTERFACE
export interface SupportTicket {
  id: string;
  ticketId: string;
  customerName: string;
  email: string;
  phone: string; // Added phone
  title: string;
  complaint: string; // Added full complaint text
  dateTime: string; // Added full date and time (ISO format)
  attachment?: { // Attachment is optional
    name: string;
    type: 'Document' | 'Image';
  };
  priority: TicketPriority;
  status: TicketStatus;
}

// 2. UPDATE THE MOCK DATA ARRAY
export const mockSupportTickets: SupportTicket[] = [
  { id: 'tkt_001', ticketId: '000576497599964', customerName: 'Oladapo Koiki', email: 'okoiki@gmail.com', phone: '+234 802 938 6768', title: 'Crashing app', complaint: 'Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.', dateTime: '2025-02-06T10:30:00Z', attachment: { name: 'error_log.txt', type: 'Document'}, priority: 'Low', status: 'Pending' },
  { id: 'tkt_002', ticketId: '000576497599965', customerName: 'Adebayo Tunde', email: 'atunde@gmail.com', phone: '+234 803 123 4567', title: 'Payment failed', complaint: 'My card was charged but the payment is not reflecting on my dashboard. Please check.', dateTime: '2025-02-05T15:00:00Z', priority: 'High', status: 'Answered' },
  { id: 'tkt_003', ticketId: '000576497599966', customerName: 'Chioma Nwosu', email: 'cnwosu@gmail.com', phone: '+234 804 234 5678', title: 'How to track shipment?', complaint: 'I have a tracking ID but I can\'t find where to use it on the website. Please help.', dateTime: '2025-02-04T09:15:00Z', attachment: { name: 'screenshot.png', type: 'Image'}, priority: 'Medium', status: 'Closed' },
  // Add more entries as needed
];