// src/services/dashboardService.ts
import apiClient from './apiClient';
import { DashboardMetrics, DashboardGrowth } from '../types/dashboard';

// Define the paths relative to the base URL
const METRICS_PATH = '/v1/dashboard/metrics';
const GROWTH_PATH = '/v1/dashboard/growth';

// A single function to fetch all dashboard data concurrently
export const getDashboardData = async (): Promise<{ metrics: DashboardMetrics; growth: DashboardGrowth }> => {
  try {
    // Promise.all lets us make both API requests at the same time
    const [metricsResponse, growthResponse] = await Promise.all([
      apiClient.get(METRICS_PATH),
      apiClient.get(GROWTH_PATH)
    ]);
    
    // Extract the 'data' property from each response
    const metrics = metricsResponse.data.data;
    const growth = growthResponse.data.data;
    
    return { metrics, growth };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    // Re-throw the error so the component can catch it and show a message
    throw error;
  }
};