// src/data/mockTrackingData.ts

// Define the possible delivery types and statuses as union types for strong typing
export type DeliveryType = 'Pick up' | 'Home Delivery';

export type ShipmentStatus =
  // Common statuses
  | 'Order submitted'
  | 'Order Paid successfully'
  | 'Order Verified'
  | 'Order Packed'
  | 'Awaiting shipment'
  | 'Order shipped'
  | 'Flight/sea departure'
  | 'Package arrived at station'
  | 'Custom clearance'
  | 'Arrive at the receiving hub center'
  | 'Order delivered'
  // Home Delivery specific statuses
  | 'On dispatch'
  | 'Arrived at site';

// Define the structure of a single shipment
export interface Shipment {
  id: string; // Use a unique string like a real ID
  shipmentId: string;
  trackingId: string;
  orderDate: string;
  deliveryTimeline: string;
  deliveryType: DeliveryType;
  status: ShipmentStatus;
}

// Lists of options for our dropdowns
export const PICKUP_STATUSES: ShipmentStatus[] = [
  'Order submitted', 'Order Paid successfully', 'Order Verified', 'Order Packed', 
  'Awaiting shipment', 'Order shipped', 'Flight/sea departure', 'Package arrived at station',
  'Custom clearance', 'Arrive at the receiving hub center', 'Order delivered'
];

export const HOME_DELIVERY_STATUSES: ShipmentStatus[] = [
  ...PICKUP_STATUSES, 'On dispatch', 'Arrived at site'
];


// Our mock data array
export const mockTrackingData: Shipment[] = [
  { id: 'sh1', shipmentId: '476328', trackingId: 'bjikoki@gmail.com', orderDate: '13/02/2025', deliveryTimeline: '4 Weeks', deliveryType: 'Pick up', status: 'Order submitted' },
  { id: 'sh2', shipmentId: '476329', trackingId: 'ameh@example.com', orderDate: '14/02/2025', deliveryTimeline: '2 Weeks', deliveryType: 'Home Delivery', status: 'Order Verified' },
  { id: 'sh3', shipmentId: '476330', trackingId: 'bola@example.com', orderDate: '15/02/2025', deliveryTimeline: '4 Weeks', deliveryType: 'Pick up', status: 'Order shipped' },
  { id: 'sh4', shipmentId: '476331', trackingId: 'chidi@example.com', orderDate: '16/02/2025', deliveryTimeline: '5 Weeks', deliveryType: 'Home Delivery', status: 'On dispatch' },
  // Add 5 more to have a good list to work with
  { id: 'sh5', shipmentId: '476332', trackingId: 'dayo@example.com', orderDate: '17/02/2025', deliveryTimeline: '3 Weeks', deliveryType: 'Pick up', status: 'Package arrived at station' },
  { id: 'sh6', shipmentId: '476333', trackingId: 'eze@example.com', orderDate: '18/02/2025', deliveryTimeline: '4 Weeks', deliveryType: 'Home Delivery', status: 'Awaiting shipment' },
  { id: 'sh7', shipmentId: '476334', trackingId: 'fola@example.com', orderDate: '19/02/2025', deliveryTimeline: '1 Week', deliveryType: 'Pick up', status: 'Order delivered' },
  { id: 'sh8', shipmentId: '476335', trackingId: 'goke@example.com', orderDate: '20/02/2025', deliveryTimeline: '4 Weeks', deliveryType: 'Home Delivery', status: 'Custom clearance' },
  { id: 'sh9', shipmentId: '476336', trackingId: 'hade@example.com', orderDate: '21/02/2025', deliveryTimeline: '2 Weeks', deliveryType: 'Pick up', status: 'Order Verified' },
];