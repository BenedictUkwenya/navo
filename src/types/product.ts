// src/types/product.ts
export interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    productStatus: string;
    image: string[];
  }

  export interface ProductApiResponse {
    status: string;
    data: {
      products: Product[];
      // Add pagination if the API provides it for this endpoint
      };
    }