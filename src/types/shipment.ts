// src/types/shipment.ts
interface ShipmentUser {
    id: string;
    firstName: string;
    lastName: string;
  }
  interface ShipmentTracking {
    trackingId?: string;
  }
  export interface Shipment {
    id: string;
    user: ShipmentUser;
    tracking: ShipmentTracking;
    shipmentStatus: string;
    createdAt: string;
    // --- Fields from your existing mock data ---
    userId: string;
    name: string; // The full name, likely from user object
    shipmentId: string;
    trackId: string;
    timeline: string;
    amount: string;
    serviceType: 'Send' | 'Receive';
    deliveryType: 'Home Delivery' | 'Pick up from Hub';
    status: 'Packed' | 'Verified' | 'Pending';
    goodsType: string;
    location: string;
    weight: string;
  }
  export interface ShipmentsApiResponse {
    data: {
      shipments: Shipment[];
      pagination: {
        currentPage: number;
        totalPages: number;
      };
    };
  }
  export interface ShipmentDetailApiResponse {
      data: { shipment: Shipment; };
  }