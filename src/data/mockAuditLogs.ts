// src/data/mockAuditLogs.ts

export interface AuditLog {
    id: string;
    userName: string;
    actionTaken: string;
    date: string;
    ipAddress: string;
    phoneType: 'Android' | 'iOS' | 'Web';
    browserPage: string;
  }
  
  export const mockAuditLogs: AuditLog[] = [
    { id: 'log_001', userName: 'Oladapo Koiki', actionTaken: 'Click button', date: '13/02/2025', ipAddress: '192.168.1.1', phoneType: 'Android', browserPage: 'Shipment tracking' },
    { id: 'log_002', userName: 'Adebayo Tunde', actionTaken: 'Login', date: '13/02/2025', ipAddress: '10.0.0.5', phoneType: 'Web', browserPage: 'Login Page' },
    { id: 'log_003', userName: 'Chioma Nwosu', actionTaken: 'View transaction details', date: '12/02/2025', ipAddress: '172.16.0.10', phoneType: 'iOS', browserPage: 'Transactions' },
    { id: 'log_004', userName: 'Oladapo Koiki', actionTaken: 'Update profile', date: '12/02/2025', ipAddress: '192.168.1.1', phoneType: 'Android', browserPage: 'Settings' },
    { id: 'log_005', userName: 'Musa Aliyu', actionTaken: 'Submit support ticket', date: '11/02/2025', ipAddress: '203.0.113.45', phoneType: 'Web', browserPage: 'Support Ticket' },
    // Add more entries to test pagination
    { id: 'log_006', userName: 'Titi Benson', actionTaken: 'Export CSV', date: '11/02/2025', ipAddress: '198.51.100.2', phoneType: 'Web', browserPage: 'Customers' },
    { id: 'log_007', userName: 'Oladapo Koiki', actionTaken: 'Click button', date: '13/02/2025', ipAddress: '192.168.1.1', phoneType: 'Android', browserPage: 'Shipment tracking' },
    { id: 'log_008', userName: 'Oladapo Koiki', actionTaken: 'Click button', date: '13/02/2025', ipAddress: '192.168.1.1', phoneType: 'Android', browserPage: 'Shipment tracking' },
    { id: 'log_009', userName: 'Oladapo Koiki', actionTaken: 'Click button', date: '13/02/2025', ipAddress: '192.168.1.1', phoneType: 'Android', browserPage: 'Shipment tracking' },
  ];