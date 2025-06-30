// src/types/quote.ts

// This interface now matches the fields from your API response
export interface Quote {
  id: string;
  email: string;
  serviceType: string;
  locationFrom: string;
  locationTo: string;
  goodsType: string;
  weight: number;
  totalCost: number;
  createdAt: string;
}

// This interface now matches the FULL API response structure
export interface QuotesApiResponse {
  status: string;
  data: {
    quotes: Quote[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
      hasMore: boolean;
    };
  };
}