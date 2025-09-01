// src/services/shipmentService.ts
import apiClient from "./apiClient";
import {
  ShipmentsApiResponse,
  ShipmentDetailApiResponse,
  Shipment,
  ShipmentSettingsApiResponse,
} from "../types/shipment";

interface ShipmentStatusUpdate {
  shipmentId: string;
  newStatus:
    | "PENDING"
    | "IN_TRANSIT"
    | "SHIPPED"
    | "PACKED"
    | "CHECKED_IN"
    | "CHECKED_OUT"
    | "NOT_CHECKED"
    | "ARRIVED_AT_LOCAL_HUB"
    | "ARRIVED_AT_NIGERIA_HUB"
    | "ARRIVED_AT_UK_HUB"
    | "COMPLETED"
    | "CANCELED"
    | "PROCESSING"
    | "DECLINED"
    | "ORDER_SUBMITTED"
    | "ORDER_PAID_SUCCESSFULLY"
    | "ORDER_PAYMENT_FAILED"
    | "ORDER_VERIFIED"
    | "AWAITING_SHIPMENT"
    | "FLIGHT_SEA_DEPARTURE"
    | "CUSTOM_CLEARANCE"
    | "ARRIVE_AT_THE_RECEIVING_HUB_CENTER";
  reason?: string;
}

// ... rest of the file remains the same ...
const SHIPMENTS_PATH = "shipments";

export const getShipments = async (
  page = 1,
  limit = 9
): Promise<ShipmentsApiResponse> => {
  try {
    const response = await apiClient.get<ShipmentsApiResponse>(SHIPMENTS_PATH, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shipments:", error);
    throw error;
  }
};

export const getShipmentById = async (id: string): Promise<Shipment> => {
  try {
    const response = await apiClient.get<ShipmentDetailApiResponse>(
      `${SHIPMENTS_PATH}/${id}`
    );

    // Extract the nested shipment object and return it directly.
    // This is what the component expects.
    return response.data.data.shipment;
  } catch (error) {
    console.error(`Failed to fetch shipment with id ${id}:`, error);
    throw error;
  }
};

export const getShipmentSettings = async (
  page = 1,
  limit = 9
): Promise<ShipmentSettingsApiResponse> => {
  try {
    const response = await apiClient.get<ShipmentSettingsApiResponse>(
      `${SHIPMENTS_PATH}/settings`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shipment settings:", error);
    throw error;
  }
};

export const createShipmentSettings = async (
  settingsData: any
): Promise<any> => {
  try {
    const response = await apiClient.post(
      `${SHIPMENTS_PATH}/create-rate`,
      settingsData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create/update shipment settings:", error);
    throw error;
  }
};

export const updateShipmentRate = async (
  shippingRateId: string,
  updateData: any
): Promise<any> => {
  try {
    const response = await apiClient.patch(
      `${SHIPMENTS_PATH}/update/${shippingRateId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update shipping rate:", error);
    throw error;
  }
};

export const declineShipment = async (
  shipmentId: string,
  reason: string
): Promise<any> => {
  try {
    const response = await apiClient.patch(
      `${SHIPMENTS_PATH}/decline-shipment`,
      {
        shipmentId,
        reason,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to decline shipment:", error);
    throw error;
  }
};

export const updateShipmentStatus = async (
  updateData: ShipmentStatusUpdate
): Promise<any> => {
  try {
    const response = await apiClient.patch(`${SHIPMENTS_PATH}/update-status`, {
      shipmentId: updateData.shipmentId,
      newStatus: updateData.newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update shipment status:", error);
    throw error;
  }
};
