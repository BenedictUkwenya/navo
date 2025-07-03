// src/types/tracking.ts

interface TrackingUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface TrackingShipment {
  id: string;
  shipmentStatus: string;
  deliveryTypeTo: string; // The specific delivery type for the shipment
  createdAt: string;
}

export interface TrackingItem {
  id: string; // This is the ID of the tracking entry itself
  trackingId: string; // This is the visible tracking number
  shipmentId: string;
  userId: string;
  user: TrackingUser;
  shipment: TrackingShipment;
}

export interface TrackingsApiResponse {
  status: string;
  data: {
    filtered: TrackingItem[];
    // We'll assume it might have pagination later if needed
  };
}