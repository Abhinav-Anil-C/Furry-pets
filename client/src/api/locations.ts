import api from './api';
import { PetLocation } from '@/types/location';

// Description: Get pet-friendly locations near user
// Endpoint: GET /api/locations
// Request: { latitude: number, longitude: number, type?: string }
// Response: { locations: PetLocation[] }
export const getLocations = async (
  latitude: number,
  longitude: number,
  type?: string
): Promise<{ locations: PetLocation[] }> => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });

    if (type) params.append('type', type);

    const response = await api.get(`/api/locations?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
