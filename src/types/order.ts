// src/types/order.ts

// Define the shape of a user within an order
interface OrderUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  }
  
  // Define the shape of a single order
  export interface Order {
    id: string;
    user: OrderUser;
    items: any[]; // The API shows this as empty, so we'll use 'any' for now
    createdAt: string; // ISO date string
    // We'll add more fields as we see them in the data, e.g., status, totalAmount
  }
  
  // For the list of all orders
  export interface OrdersApiResponse {
    data: {
      allOrders: Order[];
      pagination: {
        currentPage: number;
        totalPages: number;
        limit: number;
      };
    };
  }
  
  // For a single order's details
  export interface OrderDetailApiResponse {
    status: string;
    data: {
      order: Order;
    };
  }