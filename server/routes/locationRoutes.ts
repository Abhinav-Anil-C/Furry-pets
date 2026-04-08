import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/locations?latitude=...&longitude=...&type=...
router.get('/', async (req: Request, res: Response) => {
  const { latitude, longitude, type } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Missing latitude or longitude' });
  }

  const lat = parseFloat(latitude as string);
  const lon = parseFloat(longitude as string);
console.log("Loaded Google API Key:", process.env.GOOGLE_PLACES_API_KEY);

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing Google Places API key' });
  }

  try {
    // Default search term for pet-friendly places
    const keyword =
      (type as string)?.toLowerCase() ||
      'dog park|pet store|veterinary|pet hospital';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&keyword=${encodeURIComponent(
      keyword
    )}&key=${apiKey}`;

    const { data } = await axios.get(url);

    if (!data.results || data.results.length === 0) {
      return res.json({ locations: [] });
    }

    const locations = data.results.map((place: any) => ({
      _id: place.place_id,
      name: place.name,
      type: place.types?.[0] || 'Pet Place',
      address: place.vicinity,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      rating: place.rating || null,
      phone: place.formatted_phone_number || null,
      distance: null, // you can calculate with haversine if needed
    }));

    res.json({ locations });
  } catch (error: any) {
    console.error('Error fetching Google Places:', error.message);
    res.status(500).json({ message: 'Failed to fetch locations', error: error.message });
  }
});

export default router;


