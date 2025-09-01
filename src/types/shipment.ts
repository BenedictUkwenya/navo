// src/types/shipment.ts

interface ShipmentUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar?: string | null;
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
  deliveryDays?: number;
  toCountry?: string;
  shipmentType?: string;
  amount?: number;
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

// src/types/shipment.ts

// ... your existing types ...

export interface ShipmentSettingsPagination {
  currentPage: number;
  hasMore: boolean;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ShipmentSetting {
  id: string;
  fromCountry: string;
  toCountry: string;
  pricePerKg: number;
  clearanceFee: number;
  deliveryDays: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  category: string | null;
  goodType: string | null;
  deliveryType: string | null;
  shipmentType: string | null;
  weight: string | null;
}

export interface ShipmentSettingState {
  id: string;
  fromCountry: string;
  toCountry: string;
  pricePerKg: number;
  clearanceFee: number;
  deliveryDays: number | string;
  currency: string;
  category: string;
  goodType: string;
  shipmentType: string;
  deliveryType: string;
  weight: string | number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentSettingsApiResponse {
  data: {
    pagination: ShipmentSettingsPagination;
    settings: ShipmentSetting[];
  };
}

export type ViewMode = "table" | "form";

export interface MockShipmentSetting extends ShipmentSetting {
  pickUpFrom: string;
  deliverTo: string;
  pricing: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  fromCountry: string;
  toCountry: string;
  pricePerKg: number;
  clearanceFee: number;
  deliveryDays: number | string;
  currency: string;
  category: string;
  goodType: string;
  shipmentType: string;
  deliveryType: string;
  weight: string | number;
}
