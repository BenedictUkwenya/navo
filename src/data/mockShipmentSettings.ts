// src/data/mockShipmentSettings.ts

export interface ShipmentSettingColumn {
  title: string;
  options: string[];
}

export const mockShipmentSettings: ShipmentSettingColumn[] = [
  { title: 'Category', options: ['Individual', 'Business'] },
  { title: 'Good Type', options: ['General goods', 'Sensitive goods', 'Travelling extra luggage'] },
  { title: 'Shipment Type', options: ['Air', 'Sea'] },
  { title: 'Weight', options: ['0-2 kg', '3-5kg', '5-10kg', '11-20kg'] },
  { title: 'Delivery Type', options: ['Pick up from hub', 'Home delivery'] },
  { title: 'Pick up from', options: ['United Kingdom', 'Nigeria'] },
  { title: 'Deliver to', options: ['Nigeria', 'United Kingdom'] },
  { title: 'Pricing', options: [] },
];

// Updated to include the new fields
// ... keep the top part of the file the same ...

export const mockCurrentShipmentValues = {
  category: 'Individual',
  goodType: 'General goods',
  shipmentType: 'Sea Shipment',
  weight: '0-2 kg',
  pickup: 'London, UK',
  delivery: 'London, UK',
  deliveryType: 'Pick up from hub',
  deliveryDate: '2024-08-15',
  packagingPrice: '5.00',
  clearanceFee: '25.00',
  price: '150.00', // <-- NEW: Add the price field
};

// ... keep mockEmptyShipmentSettings ...
export const mockEmptyShipmentSettings: ShipmentSettingColumn[] = [];