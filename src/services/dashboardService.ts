// src/services/dashboardService.ts
import apiClient from './apiClient';
import { DashboardMetrics, DashboardGrowth } from '../types/dashboard';

// === THE CORRECTED PATHS (relative to the baseURL) ===
const METRICS_PATH = 'dashboard/metrics'; // No leading slash
const GROWTH_PATH = 'dashboard/growth';   // No leading slash
// ======================================================

// Function to get the main numbers
const getMetrics = async (): Promise<DashboardMetrics> => {
  const response = await apiClient.get(METRICS_PATH);
  return response.data.data;
};

// Function to get the growth percentages
const getGrowth = async (): Promise<DashboardGrowth> => {
  const response = await apiClient.get(GROWTH_PATH);
  return response.data.data;
};

// A single function to fetch all dashboard data concurrently
export const getDashboardData = async (): Promise<{ metrics: DashboardMetrics; growth: DashboardGrowth }> => {
  try {
    const [metrics, growth] = await Promise.all([
      getMetrics(),
      getGrowth()
    ]);
    return { metrics, growth };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};