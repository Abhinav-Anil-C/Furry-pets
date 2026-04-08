export interface PetLocation {
  _id: string;
  name: string;
  type: 'Park' | 'Vet Clinic' | 'Pet Hospital';
  address: string;
  latitude: number;
  longitude: number;
  distance?: number;
  rating?: number;
  phone?: string;
}