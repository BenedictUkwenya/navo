// src/types/shipment.ts

interface ShipmentUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface ShipmentTracking {
  id: string;
  trackingId: string;
}

// This interface now includes ALL the fields from the API and your component
export interface Shipment {
  id: string;
  userId: string;
  shipmentStatus: string;
  createdAt: string;
  trackingId: string | null;
  user: ShipmentUser;
  tracking: ShipmentTracking | null;
  
  // === THE MISSING FIELDS, NOW ADDED ===
  locationFrom?: string;
  locationTo?: string;
  weight?: string;
  totalCost?: number;
  serviceType?: string;
  goodsType?: string;
  estimatedDelivery?: number | null;
  currency?: string;
  // ======================================
}

// For the list of all shipments
export interface ShipmentsApiResponse {
  data: {
    shipments: Shipment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
    };
  };
}

// For a single shipment's details
export interface ShipmentDetailApiResponse {
  data: {
    shipment: Shipment;
  };
}
