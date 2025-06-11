// src/data/mockPurchaseOrders.ts

export type OrderStatus = 'Request' | 'Priced' | 'Paid' | 'Parcel Packed' | 'Delivered';

export interface CartSubItem {
  name: string;
  price?: number;
}

export interface CartItem {
  id: string;
  goodType: string;
  itemCategory: string;
  storeLink: string;
  details: string;
  subItems: CartSubItem[];
  totalCost?: number;
}

// --- NEW/UPDATED INTERFACE ---
export interface PurchaseOrder {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  totalQuantity: number;
  category: string;
  status: OrderStatus;
  cartItems: CartItem[];
  // New optional fields for the upcoming steps
  paymentDetails?: {
    paymentDate: string;
    totalAmount: number;
  };
  trackingInfo?: {
    trackingNumber: string;
    courier: string;
    checkinDate: string;
  };
}

// --- UPDATED MOCK DATA ---
export const mockPurchaseOrders: PurchaseOrder[] = [
  // Order to be priced (same as before)
  {
    id: 'PO-101',
    userId: '476328',
    customerName: 'Oladapo Kiki',
    email: 'oladapo.k@gmail.com',
    phone: '08021386798',
    country: 'Nigeria',
    totalQuantity: 50,
    category: 'Groceries',
    status: 'Request',
    cartItems: [
      {
        id: 'cart-1a',
        goodType: 'General goods',
        itemCategory: 'Groceries',
        storeLink: 'https://www.dummylink/',
        details: 'Lorem ipsum is placeholder text commonly used...',
        subItems: [{ name: 'Chips (5 packs)' }, { name: 'Cookies (10 packs)' }],
      },
    ],
  },
  // NEW: Order that has been priced, waiting for payment confirmation
  {
    id: 'PO-104',
    userId: '476331',
    customerName: 'Bola Ahmed',
    email: 'bola.a@example.com',
    phone: '07011223344',
    country: 'Nigeria',
    totalQuantity: 3,
    category: 'Electronics',
    status: 'Priced',
    cartItems: [
        {
            id: 'cart-4a',
            goodType: 'Computer Parts',
            itemCategory: 'Hardware',
            storeLink: 'https://www.compu.com/',
            details: 'High-performance RAM for custom PC build.',
            subItems: [
                { name: 'Corsair Vengeance RAM 16GB', price: 45000 },
            ],
            totalCost: 45000,
          },
    ],
  },
  // NEW: Order that has been paid, waiting for parcel check-in
  {
    id: 'PO-105',
    userId: '476332',
    customerName: 'Fatima Yusuf',
    email: 'fatima.y@example.com',
    phone: '08055667788',
    country: 'Nigeria',
    totalQuantity: 1,
    category: 'Home Goods',
    status: 'Paid',
    cartItems: [
        {
            id: 'cart-5a',
            goodType: 'Appliances',
            itemCategory: 'Kitchen',
            storeLink: 'https://www.homehub.com/',
            details: 'Latest model air fryer.',
            subItems: [ { name: 'Ninja Air Fryer AF100', price: 89000 } ],
            totalCost: 89000,
        },
    ],
    paymentDetails: {
        paymentDate: '2023-10-06',
        totalAmount: 89000,
    }
  },
  // Order that is already delivered (same as before)
  {
    id: 'PO-102',
    userId: '476329',
    customerName: 'Amina Salihu',
    email: 'amina.s@gmail.com',
    phone: '09012345678',
    country: 'United Kingdom',
    totalQuantity: 2,
    category: 'Fashion',
    status: 'Delivered',
    cartItems: [],
  },
];