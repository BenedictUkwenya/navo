// src/services/supportTicketService.ts
import apiClient from './apiClient';
import { SupportTicketsApiResponse } from '../types/supportTicket';

const SUPPORT_PATH = 'shopOrders'; // Using 'shop' as the path from the API docs

export const getSupportTickets = async (page = 1, limit = 10): Promise<SupportTicketsApiResponse> => {
  try {
    const response = await apiClient.get<SupportTicketsApiResponse>(SUPPORT_PATH, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch support tickets:', error);
    throw error;
  }
};

export const updateSupportTicketStatus = async (ticketId: string, newStatus: string): Promise<any> => {
    try {
        // The API endpoint uses 'shopId' in the body
        const response = await apiClient.patch(`${SUPPORT_PATH}/update-status`, {
            shopId: ticketId,
            newStatus: newStatus,
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to update status for ticket ${ticketId}:`, error);
        throw error;
    }
};