// src/types/order.ts

// Using camelCase for consistency with your other types
interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  id: string;
  user: OrderUser;
  items: any[];
  createdAt: string;
}

// This interface now matches the FULL API response structure
export interface OrdersApiResponse {
  data: {
    allOrders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
      hasMore: boolean;
    };
  };
}

// We'll assume the detail response is also nested for consistency
export interface OrderDetailApiResponse {
  data: {
    order: Order;
  };
}