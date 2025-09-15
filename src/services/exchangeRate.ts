import apiClient from "./apiClient";

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  buyRate: string;
  sellRate: string;
  createdAt: string;
  updatedAt: string;
  adminId: string | null;
}

interface ExchangeRateResponse {
  success: boolean;
  data: ExchangeRate; // Changed from { rate: ExchangeRate }
}

interface ExchangeRateHistoryResponse {
  success: boolean;
  data: {
    rates: ExchangeRate[];
    pagination: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

interface CreateRateRequest {
  fromCurrency: string;
  toCurrency: string;
  buyRate: number;
  sellRate: number;
}

interface ChartDataResponse {
  success: boolean;
  data: {
    labels: string[];
    rates: number[];
  };
}

interface ChartDataParams {
  fromCurrency: string;
  toCurrency: string;
  days?: number;
}

const RATE_PATH = "rate";

export const createExchangeRate = async (
  data: CreateRateRequest
): Promise<ExchangeRate> => {
  try {
    const response = await apiClient.post<ExchangeRate>(
      `${RATE_PATH}/create`,
      data
    );

    if (!response.data) {
      throw new Error("Invalid response format from server");
    }

    return response.data; // Return the response data directly as it matches our ExchangeRate interface
  } catch (error) {
    console.error("Failed to create exchange rate:", error);
    throw error;
  }
};

export const getLatestExchangeRate = async (): Promise<ExchangeRate[]> => {
  try {
    const response = await apiClient.get<ExchangeRate[]>(`${RATE_PATH}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch latest exchange rate:", error);
    throw error;
  }
};

export const updateExchangeRate = async (
  rate: number
): Promise<ExchangeRate> => {
  try {
    const response = await apiClient.patch<ExchangeRateResponse>(
      `${RATE_PATH}/update-rate`,
      {
        rate,
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update exchange rate:", error);
    throw error;
  }
};

export const getExchangeRateHistory = async (
  page = 1,
  limit = 10
): Promise<ExchangeRateHistoryResponse> => {
  try {
    const response = await apiClient.get<ExchangeRateHistoryResponse>(
      `${RATE_PATH}/history`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch exchange rate history:", error);
    throw error;
  }
};

export const getExchangeRateChartData = async (
  params: ChartDataParams
): Promise<any> => {
  try {
    const response = await apiClient.get<any>(`${RATE_PATH}/chart`, {
      params: {
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        days: params.days || 30,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch exchange rate chart data:", error);
    throw error;
  }
};
