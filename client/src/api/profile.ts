// import api from './api';

// export interface UserProfile {
//   _id: string;
//   name: string;
//   email: string;
//   location: string;
//   photo: string;
//   memberSince: string;
// }

// export interface UpdateProfileData {
//   name: string;
//   location: string;
//   photo: string;
// }

// // Description: Get user profile
// // Endpoint: GET /api/profile
// // Request: {}
// // Response: { profile: UserProfile }
// export const getProfile = async (): Promise<{ profile: UserProfile }> => {
//   try {
//     const response = await api.get('/api/profile');
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error?.response?.data?.message || error.message);
//   }
// };

// // Description: Update user profile
// // Endpoint: PUT /api/profile
// // Request: { profile: UpdateProfileData }
// // Response: { profile: UserProfile, message: string }
// export const updateProfile = async (data: UpdateProfileData): Promise<{ profile: UserProfile; message: string }> => {
//   try {
//     const response = await api.put('/api/profile', data);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(error?.response?.data?.message || error.message);
//   }
// };

import api from './api';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  location: string;
  photo: string;
  memberSince: string;
  phone: string; // Added phone field
  geoLocation: {
    type: string;
    coordinates: [number, number]; // GeoLocation for storing lat/lng
  };
}

export interface UpdateProfileData {
  name: string;
  location: string;
  photo: string;
  phone: string; // Added phone field in update request
  geoLocation?: {
    coordinates: [number, number]; // Optional geoLocation update
  };
}

// Description: Get user profile
// Endpoint: GET /api/profile
// Request: {}
// Response: { profile: UserProfile }
export const getProfile = async (): Promise<{ profile: UserProfile }> => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update user profile
// Endpoint: PUT /api/profile
// Request: { profile: UpdateProfileData }
// Response: { profile: UserProfile, message: string }
export const updateProfile = async (data: UpdateProfileData): Promise<{ profile: UserProfile; message: string }> => {
  try {
    const response = await api.put('/api/profile', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};