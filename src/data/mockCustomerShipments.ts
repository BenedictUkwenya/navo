// src/data/mockCustomerShipments.ts

export interface CustomerShipment {
    id: string;
    userId: string;
    name: string;
    avatarUrl: string;
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
  
  export const mockCustomerShipments: CustomerShipment[] = [
    { id: '1', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Send', deliveryType: 'Home Delivery', status: 'Packed', goodsType: 'General goods', location: 'Nigeria', weight: '350kg' },
    { id: '2', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Receive', deliveryType: 'Pick up from Hub', status: 'Verified', goodsType: 'Sensitive goods', location: 'United Kingdom', weight: '120kg' },
    { id: '3', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Send', deliveryType: 'Home Delivery', status: 'Packed', goodsType: 'General goods', location: 'Nigeria', weight: '350kg' },
    // Add 6 more mock shipments to match the screenshot...
    { id: '4', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Send', deliveryType: 'Home Delivery', status: 'Packed', goodsType: 'General goods', location: 'Nigeria', weight: '350kg' },
    { id: '5', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Receive', deliveryType: 'Pick up from Hub', status: 'Verified', goodsType: 'Sensitive goods', location: 'United Kingdom', weight: '120kg' },
    { id: '6', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Send', deliveryType: 'Home Delivery', status: 'Packed', goodsType: 'General goods', location: 'Nigeria', weight: '350kg' },
    { id: '7', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Send', deliveryType: 'Home Delivery', status: 'Packed', goodsType: 'General goods', location: 'Nigeria', weight: '350kg' },
    { id: '8', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Receive', deliveryType: 'Pick up from Hub', status: 'Verified', goodsType: 'Sensitive goods', location: 'United Kingdom', weight: '120kg' },
    { id: '9', userId: '476328', name: 'Oladapo Koiki', avatarUrl: '/path/to/profilepic.png', shipmentId: 'F92487YHFUPQW', trackId: '2175w8ere9df7', timeline: '4 Weeks', amount: '₦2,050,000', serviceType: 'Send', deliveryType: 'Home Delivery', status: 'Packed', goodsType: 'General goods', location: 'Nigeria', weight: '350kg' },
  ];