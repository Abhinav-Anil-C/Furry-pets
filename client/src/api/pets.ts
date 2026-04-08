import api from './api';
import { Pet, PetFormData } from '@/types/pet';

// Description: Get all pets for the current user
// Endpoint: GET /api/pets
// Request: {}
// Response: { pets: Pet[] }
export const getPets = async (): Promise<{ pets: Pet[] }> => {
  try {
    const response = await api.get('/api/pets');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get a single pet by ID
// Endpoint: GET /api/pets/:id
// Request: { id: string }
// Response: { pet: Pet }
export const getPetById = async (id: string): Promise<{ pet: Pet }> => {
  try {
    const response = await api.get(`/api/pets/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Create a new pet
// Endpoint: POST /api/pets
// Request: { pet: PetFormData }
// Response: { pet: Pet, message: string }
export const createPet = async (data: PetFormData): Promise<{ pet: Pet; message: string }> => {
  try {
    const response = await api.post('/api/pets', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update an existing pet
// Endpoint: PUT /api/pets/:id
// Request: { id: string, pet: PetFormData }
// Response: { pet: Pet, message: string }
export const updatePet = async (id: string, data: PetFormData): Promise<{ pet: Pet; message: string }> => {
  try {
    const response = await api.put(`/api/pets/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Delete a pet
// Endpoint: DELETE /api/pets/:id
// Request: { id: string }
// Response: { message: string }
export const deletePet = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/api/pets/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
