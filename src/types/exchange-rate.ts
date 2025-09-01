export interface ExchangeRate {
  id?: string;
  rate: number;
  from_currency: string;
  to_currency: string;
  effective_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  change?: number;
}

export interface RateHistory {
  id: string;
  rate: number;
  from_currency: string;
  to_currency: string;
  created_at: string;
  notes?: string;
  is_active: boolean;
  change?: number;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total: number;
  per_page: number;
}

export interface CurrentRateResponse {
  rate: number;
  current_rate?: number;
  change?: number;
  last_updated?: string;
  updated_at?: string;
}

export interface MessageType {
  text: string;
  type: "success" | "error" | "info";
}

export interface CurrencyPair {
  from: string;
  to: string;
  label: string;
  rate: number | null;
  change: number | null;
  lastUpdated: string | null;
  isActive: boolean;
}
