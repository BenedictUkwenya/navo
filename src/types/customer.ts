// src/types/customer.ts

// NEW: Define the specific shape of a shipment object when it's part of a customer's details
export interface CustomerShipment {
  id: string;
  userId: string;
  locationFrom: string;
  locationTo: string;
  weight: string;
  shipmentStatus: string;
  totalCost: number;
  serviceType: string;
  goodsType: string;
  createdAt: string;
  trackingId: string | null;
  currency: string;
}

// Update the Customer interface to use this new, specific type
export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  profilePicture: string | null;
  gender: string | null;
  wallet?: {
    walletBalanceNGN: number;
    walletBalanceGBP: number;
  };
  shipments?: CustomerShipment[]; // <-- USE THE NEW TYPE HERE
  referral?: any;
}

// --- The rest of the file remains the same ---
export interface CustomerApiResponse {
  status: string;
  data: {
    customers: Customer[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasMore: boolean;
    };
  };
}

export interface CustomerDetailApiResponse {
  customer: Customer;
}