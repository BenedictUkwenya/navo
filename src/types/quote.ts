// src/types/quote.ts

// Based on the columns in your table, we can assume this structure.
// We will need to confirm this by looking at the real network response later.
export interface Quote {
    id: string;
    email: string;
    service: string;
    locationFrom: string;
    locationTo: string;
    goodsType: string;
    weight: string;
    date: string; // Or createdAt
  }
  
  export interface QuotesApiResponse {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    quotes: Quote[];
  }