// src/data/mockDashboardData.ts

export interface Transaction {
  id: string;
  description: string;
  trackingId: string;
  date: string;
  time: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
}

export const mockUserData = {
  name: 'Oladapo',
  avatarUrl: 'placeholder.png' 
};

// We will simplify this and add the icons directly in the component
export const mockStatCards = [
  { id: 'total-shipments', title: 'Total Shipments', value: '15', percentageChange: '+15%', color: 'blue' },
  { id: 'total-customers', title: 'Total Customers', value: '25', percentageChange: '+15%', color: 'orange' },
  { id: 'completed-shipments', title: 'Completed Shipments', value: '50', percentageChange: '+15%', color: 'blue' },
];

export const mockRecentTransactions: Transaction[] = [
  { id: '1', description: 'Shipment to the UK', trackingId: 'ID:68732BR42378Q6', date: '13th Feb, 2024', time: '4:45PM', amount: '£61.74', status: 'pending' },
  { id: '2', description: 'Shipment to the UK', trackingId: 'ID:68732BR42378Q6', date: '13th Feb, 2024', time: '4:45PM', amount: '₦121,087.50', status: 'completed' },
  { id: '3', description: 'Shipment to the UK', trackingId: 'ID:68732BR42378Q6', date: '13th Feb, 2024', time: '4:45PM', amount: '£61.74', status: 'failed' },
];