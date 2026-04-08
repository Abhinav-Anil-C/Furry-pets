import Location, { ILocation } from '../models/Location';

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getLocations = async (
  latitude: number,
  longitude: number,
  type?: string,
  maxDistance: number = 50 // km
): Promise<any[]> => {
  console.log(`Fetching locations near (${latitude}, ${longitude}), type: ${type || 'all'}`);

  // Build query
  const query: any = {};
  if (type) {
    query.type = type;
  }

  // Get all locations (in production, you'd use geospatial queries with proper indexing)
  const locations = await Location.find(query);

  // Calculate distances and filter by max distance
  const locationsWithDistance = locations.map(loc => {
    const distance = calculateDistance(latitude, longitude, loc.latitude, loc.longitude);
    return {
      _id: loc._id,
      name: loc.name,
      type: loc.type,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      rating: loc.rating,
      phone: loc.phone,
    };
  }).filter(loc => loc.distance <= maxDistance);

  // Sort by distance
  locationsWithDistance.sort((a, b) => a.distance - b.distance);

  console.log(`Found ${locationsWithDistance.length} locations`);
  return locationsWithDistance;
};

export const createLocation = async (locationData: Partial<ILocation>): Promise<ILocation> => {
  console.log(`Creating new location: ${locationData.name}`);
  const location = new Location(locationData);
  await location.save();
  console.log(`Location created with ID: ${location._id}`);
  return location;
};

export const getAllLocationsForAdmin = async (): Promise<ILocation[]> => {
  console.log('Fetching all locations');
  const locations = await Location.find().sort({ name: 1 });
  return locations;
};
