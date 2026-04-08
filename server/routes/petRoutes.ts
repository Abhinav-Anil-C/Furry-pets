import express, { Request, Response } from 'express';
import { requireUser } from './middlewares/auth';
import * as petService from '../services/petService';

const router = express.Router();

// Description: Get all pets for the current user
// Endpoint: GET /api/pets
// Request: {}
// Response: { pets: Pet[] }
router.get('/', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const pets = await petService.getAllPets(userId);
    res.status(200).json({ pets });
  } catch (error: any) {
    console.error(`Error fetching pets: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to fetch pets' });
  }
});

// Description: Get a single pet by ID
// Endpoint: GET /api/pets/:id
// Request: { id: string }
// Response: { pet: Pet }
router.get('/:id', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const pet = await petService.getPetById(id, userId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ pet });
  } catch (error: any) {
    console.error(`Error fetching pet: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to fetch pet' });
  }
});

// Description: Create a new pet
// Endpoint: POST /api/pets
// Request: { pet: PetFormData }
// Response: { pet: Pet, message: string }
router.post('/', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const petData = req.body;

    const pet = await petService.createPet(petData, userId);

    res.status(201).json({ pet, message: 'Pet added successfully!' });
  } catch (error: any) {
    console.error(`Error creating pet: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to create pet' });
  }
});

// Description: Update an existing pet
// Endpoint: PUT /api/pets/:id
// Request: { id: string, pet: PetFormData }
// Response: { pet: Pet, message: string }
router.put('/:id', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;
    const petData = req.body;

    const pet = await petService.updatePet(id, petData, userId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ pet, message: 'Pet updated successfully!' });
  } catch (error: any) {
    console.error(`Error updating pet: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to update pet' });
  }
});

// Description: Delete a pet
// Endpoint: DELETE /api/pets/:id
// Request: { id: string }
// Response: { message: string }
router.delete('/:id', requireUser(), async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id.toString();
    const { id } = req.params;

    const deleted = await petService.deletePet(id, userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.status(200).json({ message: 'Pet has been removed' });
  } catch (error: any) {
    console.error(`Error deleting pet: ${error.message}`);
    res.status(500).json({ message: error.message || 'Failed to delete pet' });
  }
});

export default router;
