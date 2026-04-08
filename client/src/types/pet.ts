export interface Pet {
  _id: string;
  name: string;
  age: number;
  breed: string;
  color: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'inches';
  healthNotes: string;
  photo: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetFormData {
  name: string;
  age: number;
  breed: string;
  color: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'inches';
  healthNotes: string;
  photo: string;
}