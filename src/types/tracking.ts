// src/types/tracking.ts

export interface TrackingUser {
    id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  }
  
  export interface TrackingItem {
    id: string; // This is the main tracking ID
    shipment: {
      // The API shows this as empty, but we might get an ID inside it.
      id?: string;
    };
    user: TrackingUser;
  }