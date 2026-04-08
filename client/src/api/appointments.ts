import api from './api';
import { Appointment, AppointmentFormData } from '@/types/appointment';

// Description: Get all appointments for the current user
// Endpoint: GET /api/appointments
// Response: { appointments: Appointment[] }
export const getAppointments = async (): Promise<{ appointments: Appointment[] }> => {
  try {
    const response = await api.get('/api/appointments');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Get a single appointment by ID
// Endpoint: GET /api/appointments/:id
// Response: { appointment: Appointment }
export const getAppointmentById = async (id: string): Promise<{ appointment: Appointment }> => {
  try {
    const response = await api.get(`/api/appointments/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Create a new appointment
// Endpoint: POST /api/appointments
// Request: AppointmentFormData
// Response: { appointment: Appointment, message: string }
export const createAppointment = async (
  data: AppointmentFormData
): Promise<{ appointment: Appointment; message: string }> => {
  try {
    const response = await api.post('/api/appointments', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update an existing appointment
// Endpoint: PUT /api/appointments/:id
// Request: AppointmentFormData
// Response: { appointment: Appointment, message: string }
export const updateAppointment = async (
  id: string,
  data: AppointmentFormData
): Promise<{ appointment: Appointment; message: string }> => {
  try {
    const response = await api.put(`/api/appointments/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Delete an appointment
// Endpoint: DELETE /api/appointments/:id
// Response: { message: string }
export const deleteAppointment = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/api/appointments/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Mark appointment as complete
// Endpoint: PATCH /api/appointments/:id/complete
// Response: { appointment: Appointment, message: string }
export const markAppointmentComplete = async (
  id: string
): Promise<{ appointment: Appointment; message: string }> => {
  try {
    const response = await api.patch(`/api/appointments/${id}/complete`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};
