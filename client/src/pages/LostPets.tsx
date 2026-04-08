// import { useEffect, useState } from "react";
// import { getLostPets, createLostPet, deleteLostPet } from "@/api/lostPets";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BottomNav } from "@/components/BottomNav";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/useToast";
// import { useAuth } from "@/contexts/AuthContext";
// import LostPetsMap from "@/components/LostPetsMap";

// export default function LostPets() {
//   const { toast } = useToast();
//   const { user } = useAuth();

//   const [pets, setPets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     breed: "",
//     description: "",
//     lastSeenLocation: "",
//     contactPhone: "",
//     photo: "",
//     latitude: null as number | null,
//     longitude: null as number | null,
//   });

//   // Load pets
//   useEffect(() => {
//     loadPets();
//   }, []);

//   const loadPets = async () => {
//     try {
//       const data = await getLostPets();
//       setPets(data.pets || []);
//     } catch (error) {
//       console.error("Error loading lost pets:", error);
//     }
//   };

//   // Handle image upload
//   const handleImage = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
//     reader.readAsDataURL(file);
//   };

//   // Get user location (click GPS button)
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//           );
//           const data = await res.json();

//           setForm((prev) => ({
//             ...prev,
//             latitude: lat,
//             longitude: lng,
//             // Only overwrite lastSeenLocation if user hasn't typed manually
//             lastSeenLocation: prev.lastSeenLocation || data.display_name || "Unknown location",
//           }));

//           toast({
//             title: "Location detected",
//             description: data.display_name,
//           });
//         } catch {
//           setForm((prev) => ({
//             ...prev,
//             latitude: lat,
//             longitude: lng,
//           }));
//         }

//         setLocationLoading(false);
//       },
//       () => {
//         toast({
//           title: "Location error",
//           description: "Please allow location access",
//           variant: "destructive",
//         });
//         setLocationLoading(false);
//       }
//     );
//   };

//   // Submit lost dog
//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!form.name || !form.breed || !form.lastSeenLocation || !form.contactPhone) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     let payload = { ...form };

//     // If coordinates missing, geocode manually typed address
//     if (!form.latitude || !form.longitude) {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             form.lastSeenLocation
//           )}`
//         );
//         const data = await res.json();
//         if (data.length > 0) {
//           payload.latitude = parseFloat(data[0].lat);
//           payload.longitude = parseFloat(data[0].lon);
//         }
//       } catch (err) {
//         console.error("Geocoding failed", err);
//         toast({
//           title: "Error",
//           description: "Unable to get coordinates from address",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       await createLostPet(payload);

//       toast({
//         title: "Lost dog reported",
//         description: "Your report is now visible to the community.",
//       });

//       // Reset form
//       setForm({
//         name: "",
//         breed: "",
//         description: "",
//         lastSeenLocation: "",
//         contactPhone: "",
//         photo: "",
//         latitude: null,
//         longitude: null,
//       });

//       loadPets();
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to report lost dog",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete pet
//   const handleDelete = async (id: string) => {
//     try {
//       await deleteLostPet(id);
//       toast({ title: "Removed", description: "Lost dog report deleted" });
//       loadPets();
//     } catch {
//       toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="pb-20 max-w-5xl mx-auto p-4">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Lost & Found Dogs</h1>
//         <p className="text-muted-foreground">Help reunite dogs with their owners</p>
//       </div>

//       {/* Form */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Report Lost Dog</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Input
//             placeholder="Dog Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <Input
//             placeholder="Breed"
//             value={form.breed}
//             onChange={(e) => setForm({ ...form, breed: e.target.value })}
//           />
//           <Input
//             placeholder="Last Seen Location"
//             value={form.lastSeenLocation}
//             onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
//           />
//           <Input
//             placeholder="Contact Phone"
//             value={form.contactPhone}
//             onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
//           />
//           <Textarea
//             placeholder="Description (optional)"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//           <Input type="file" accept="image/*" onChange={handleImage} />
//           <Button onClick={getCurrentLocation} variant="outline">
//             {locationLoading ? "Getting location..." : "Use Current Location"}
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Submitting..." : "Report Lost Dog"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Map */}
//       {pets.length > 0 && <LostPetsMap pets={pets} />}

//       {/* List */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Community Lost Dogs</CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-2 gap-4">
//           {pets.length === 0 && (
//             <p className="text-muted-foreground">No lost dogs reported yet.</p>
//           )}
//           {pets.map((pet) => (
//             <Card key={pet._id}>
//               <CardContent className="p-4 space-y-2">
//                 {pet.photo && (
//                   <img
//                     src={pet.photo}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 )}
//                 <h3 className="text-xl font-semibold">{pet.name}</h3>
//                 <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>
//                 <p className="text-sm">Last Seen: {pet.lastSeenLocation}</p>
//                 <p className="text-sm">Contact: {pet.contactPhone}</p>
//                 <p className="text-sm text-muted-foreground">{pet.description}</p>
//                 {user && pet.userId === user._id && (
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(pet._id)}
//                   >
//                     Mark as Found / Delete
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>

//       <BottomNav />
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { getLostPets, createLostPet, deleteLostPet } from "@/api/lostPets";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BottomNav } from "@/components/BottomNav";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/useToast";
// import { useAuth } from "@/contexts/AuthContext";
// import LostPetsMap from "@/components/LostPetsMap";

// // Haversine formula to calculate distance between two lat/lng points
// const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
//   const R = 6371; // Earth's radius in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in km
//   return distance;
// };

// export default function LostPets() {
//   const { toast } = useToast();
//   const { user } = useAuth();

//   const [pets, setPets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     breed: "",
//     description: "",
//     lastSeenLocation: "",
//     contactPhone: "",
//     photo: "",
//     latitude: null as number | null,
//     longitude: null as number | null,
//   });

//   const [userLat, setUserLat] = useState<number | null>(null);
//   const [userLng, setUserLng] = useState<number | null>(null);

//   // Load pets
//   useEffect(() => {
//     loadPets();
//   }, []);

//   const loadPets = async () => {
//     try {
//       const data = await getLostPets();
//       console.log("Loaded pets:", data.pets); // Debugging pets loaded
//       setPets(data.pets || []);
//     } catch (error) {
//       console.error("Error loading lost pets:", error);
//     }
//   };

//   // Filter pets based on proximity using Haversine formula
//   const filterNearbyPets = (pets: any[], maxDistance: number) => {
//     return pets.filter((pet) => {
//       if (!userLat || !userLng) return false;
//       const distance = haversineDistance(userLat, userLng, pet.latitude, pet.longitude);
//       console.log(`Distance to pet ${pet.name}:`, distance); // Debugging distance calculation
//       return distance <= maxDistance; // Only include pets within maxDistance (in km)
//     });
//   };

//   // Handle image upload
//   const handleImage = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
//     reader.readAsDataURL(file);
//   };

//   // Get user location (click GPS button)
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const lat = pos.coords.latitude;
//         const lng = pos.coords.longitude;

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//           );
//           const data = await res.json();

//           setForm((prev) => ({
//             ...prev,
//             latitude: lat,
//             longitude: lng,
//             lastSeenLocation: prev.lastSeenLocation || data.display_name || "Unknown location",
//           }));

//           setUserLat(lat);
//           setUserLng(lng);

//           toast({
//             title: "Location detected",
//             description: data.display_name,
//           });
//         } catch {
//           setForm((prev) => ({
//             ...prev,
//             latitude: lat,
//             longitude: lng,
//           }));
//           setUserLat(lat);
//           setUserLng(lng);
//         }

//         setLocationLoading(false);
//       },
//       () => {
//         toast({
//           title: "Location error",
//           description: "Please allow location access",
//           variant: "destructive",
//         });
//         setLocationLoading(false);
//       }
//     );
//   };

//   // Submit lost dog
//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!form.name || !form.breed || !form.lastSeenLocation || !form.contactPhone) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     let payload = { ...form };

//     // If coordinates missing, geocode manually typed address
//     if (!form.latitude || !form.longitude) {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             form.lastSeenLocation
//           )}`
//         );
//         const data = await res.json();
//         if (data.length > 0) {
//           payload.latitude = parseFloat(data[0].lat);
//           payload.longitude = parseFloat(data[0].lon);
//         }
//       } catch (err) {
//         console.error("Geocoding failed", err);
//         toast({
//           title: "Error",
//           description: "Unable to get coordinates from address",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       await createLostPet(payload);

//       toast({
//         title: "Lost dog reported",
//         description: "Your report is now visible to the community.",
//       });

//       // Reset form
//       setForm({
//         name: "",
//         breed: "",
//         description: "",
//         lastSeenLocation: "",
//         contactPhone: "",
//         photo: "",
//         latitude: null,
//         longitude: null,
//       });

//       loadPets();
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to report lost dog",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete pet
//   const handleDelete = async (id: string) => {
//     try {
//       await deleteLostPet(id);
//       toast({ title: "Removed", description: "Lost dog report deleted" });
//       loadPets();
//     } catch {
//       toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
//     }
//   };

//   // Get nearby pets
//   const maxDistance = 10; // Max distance in km
//   const nearbyPets = filterNearbyPets(pets, maxDistance);

//   console.log("Nearby pets:", nearbyPets); // Debugging the filtered pets

//   return (
//     <div className="pb-20 max-w-5xl mx-auto p-4">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Lost & Found Dogs</h1>
//         <p className="text-muted-foreground">Help reunite dogs with their owners</p>
//       </div>

//       {/* Form */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Report Lost Dog</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Input
//             placeholder="Dog Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <Input
//             placeholder="Breed"
//             value={form.breed}
//             onChange={(e) => setForm({ ...form, breed: e.target.value })}
//           />
//           <Input
//             placeholder="Last Seen Location"
//             value={form.lastSeenLocation}
//             onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
//           />
//           <Input
//             placeholder="Contact Phone"
//             value={form.contactPhone}
//             onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
//           />
//           <Textarea
//             placeholder="Description (optional)"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//           <Input type="file" accept="image/*" onChange={handleImage} />
//           <Button onClick={getCurrentLocation} variant="outline">
//             {locationLoading ? "Getting location..." : "Use Current Location"}
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Submitting..." : "Report Lost Dog"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Map */}
//       {nearbyPets.length > 0 && <LostPetsMap pets={nearbyPets} />}

//       {/* List */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Community Lost Dogs</CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-2 gap-4">
//           {nearbyPets.length === 0 && (
//             <p className="text-muted-foreground">No lost dogs reported yet.</p>
//           )}
//           {nearbyPets.map((pet) => (
//             <Card key={pet._id}>
//               <CardContent className="p-4 space-y-2">
//                 {pet.photo && (
//                   <img
//                     src={pet.photo}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 )}
//                 <h3 className="text-xl font-semibold">{pet.name}</h3>
//                 <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>
//                 <p className="text-sm">Last Seen: {pet.lastSeenLocation}</p>
//                 <p className="text-sm">Contact: {pet.contactPhone}</p>
//                 <p className="text-sm text-muted-foreground">{pet.description}</p>
//                 {user && pet.userId === user._id && (
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(pet._id)}
//                   >
//                     Mark as Found / Delete
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>

//       <BottomNav />
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { getLostPets, createLostPet, deleteLostPet } from "@/api/lostPets";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BottomNav } from "@/components/BottomNav";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/useToast";
// import { useAuth } from "@/contexts/AuthContext";
// import LostPetsMap from "@/components/LostPetsMap";

// // Function to calculate distance between two coordinates in kilometers using Haversine formula
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Earth radius in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };

// export default function LostPets() {
//   const { toast } = useToast();
//   const { user } = useAuth();  // User context containing user data including location

//   const [pets, setPets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [radius, setRadius] = useState(5); // Default radius of 5 km
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     breed: "",
//     description: "",
//     lastSeenLocation: "",
//     contactPhone: "",
//     photo: "",
//     latitude: null as number | null,
//     longitude: null as number | null,
//   });

//   // Set user location from profile (if available) when the component mounts
//   useEffect(() => {
//     if (user && user.latitude && user.longitude) {
//       // If user profile has location data, set it
//       setUserLocation({
//         latitude: user.latitude,
//         longitude: user.longitude,
//       });
//     } else {
//       // Optionally, you can get the location from the geolocation API if it's not in the profile
//       getCurrentLocation();
//     }
//   }, [user]);

//   // Load pets within the specified radius
//   useEffect(() => {
//     if (userLocation) {
//       loadPets();
//     }
//   }, [userLocation, radius]);

//   // Load lost pets data
//   const loadPets = async () => {
//     try {
//       const data = await getLostPets();
//       const filteredPets = data.pets.filter((pet: any) => {
//         if (!userLocation || !pet.latitude || !pet.longitude) return false;
//         const distance = calculateDistance(
//           userLocation.latitude,
//           userLocation.longitude,
//           pet.latitude,
//           pet.longitude
//         );
//         return distance <= radius;
//       });
//       setPets(filteredPets);
//     } catch (error) {
//       console.error("Error loading lost pets:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load lost pets",
//         variant: "destructive",
//       });
//     }
//   };

//   // Get current location from the browser if user doesn't have location in profile
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation({ latitude, longitude });
//         toast({
//           title: "Location detected",
//           description: `Latitude: ${latitude}, Longitude: ${longitude}`,
//         });
//         setLocationLoading(false);
//       },
//       () => {
//         toast({
//           title: "Location error",
//           description: "Please allow location access",
//           variant: "destructive",
//         });
//         setLocationLoading(false);
//       }
//     );
//   };

//   // Handle image upload
//   const handleImage = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
//     reader.readAsDataURL(file);
//   };

//   // Handle form submission for reporting a lost pet
//   const handleSubmit = async () => {
//     if (!form.name || !form.breed || !form.lastSeenLocation || !form.contactPhone) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     let payload = { ...form };

//     if (!form.latitude || !form.longitude) {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             form.lastSeenLocation
//           )}`
//         );
//         const data = await res.json();
//         if (data.length > 0) {
//           payload.latitude = parseFloat(data[0].lat);
//           payload.longitude = parseFloat(data[0].lon);
//         }
//       } catch (err) {
//         console.error("Geocoding failed", err);
//         toast({
//           title: "Error",
//           description: "Unable to get coordinates from address",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       await createLostPet(payload);
//       toast({
//         title: "Lost dog reported",
//         description: "Your report is now visible to the community.",
//       });
//       setForm({
//         name: "",
//         breed: "",
//         description: "",
//         lastSeenLocation: "",
//         contactPhone: "",
//         photo: "",
//         latitude: null,
//         longitude: null,
//       });
//       loadPets();
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to report lost dog",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete pet report
//   const handleDelete = async (id: string) => {
//     try {
//       await deleteLostPet(id);
//       toast({ title: "Removed", description: "Lost dog report deleted" });
//       loadPets();
//     } catch {
//       toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="pb-20 max-w-5xl mx-auto p-4">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Lost & Found Dogs</h1>
//         <p className="text-muted-foreground">Help reunite dogs with their owners</p>
//       </div>

//       {/* Form */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Report Lost Dog</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Input
//             placeholder="Dog Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <Input
//             placeholder="Breed"
//             value={form.breed}
//             onChange={(e) => setForm({ ...form, breed: e.target.value })}
//           />
//           <Input
//             placeholder="Last Seen Location"
//             value={form.lastSeenLocation}
//             onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
//           />
//           <Input
//             placeholder="Contact Phone"
//             value={form.contactPhone}
//             onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
//           />
//           <Textarea
//             placeholder="Description (optional)"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//           <Input type="file" accept="image/*" onChange={handleImage} />
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Submitting..." : "Report Lost Dog"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Map */}
//       {pets.length > 0 && <LostPetsMap pets={pets} />}

//       {/* List */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Community Lost Dogs</CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-2 gap-4">
//           {pets.length === 0 && (
//             <p className="text-muted-foreground">No lost dogs reported yet.</p>
//           )}
//           {pets.map((pet) => (
//             <Card key={pet._id}>
//               <CardContent className="p-4 space-y-2">
//                 {pet.photo && (
//                   <img
//                     src={pet.photo}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 )}
//                 <h3 className="text-xl font-semibold">{pet.name}</h3>
//                 <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>
//                 <p className="text-sm">Last Seen: {pet.lastSeenLocation}</p>
//                 <p className="text-sm">Contact: {pet.contactPhone}</p>
//                 <p className="text-sm text-muted-foreground">{pet.description}</p>
//                 {user && pet.userId === user._id && (
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(pet._id)}
//                   >
//                     Mark as Found / Delete
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>

//       <BottomNav />
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getLostPets, createLostPet, deleteLostPet } from "@/api/lostPets";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BottomNav } from "@/components/BottomNav";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/useToast";
// import { useAuth } from "@/contexts/AuthContext";
// import LostPetsMap from "@/components/LostPetsMap";

// // Function to calculate distance between two coordinates in kilometers using Haversine formula
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Earth radius in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };

// export default function LostPets() {
//   const { toast } = useToast();
//   const { user } = useAuth();  // User context containing user data including location

//   const [pets, setPets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [radius, setRadius] = useState(5); // Default radius of 5 km
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     breed: "",
//     description: "",
//     lastSeenLocation: "",
//     contactPhone: "",
//     photo: "",
//     latitude: null as number | null,
//     longitude: null as number | null,
//   });

//   // Set user location from profile (if available) when the component mounts
//   useEffect(() => {
//     if (user && user.location) {
//       // If user profile has location data (text location), geocode it to latitude and longitude
//       geocodeLocation(user.location);
//     } else {
//       // Optionally, you can get the location from the geolocation API if it's not in the profile
//       getCurrentLocation();
//     }
//   }, [user]);

//   // Load pets within the specified radius
//   useEffect(() => {
//     if (userLocation) {
//       loadPets();
//     }
//   }, [userLocation, radius]);

//   // Load lost pets data
//   const loadPets = async () => {
//     try {
//       const data = await getLostPets();
//       const filteredPets = data.pets.filter((pet: any) => {
//         if (!userLocation || !pet.latitude || !pet.longitude) return false;
//         const distance = calculateDistance(
//           userLocation.latitude,
//           userLocation.longitude,
//           pet.latitude,
//           pet.longitude
//         );
//         return distance <= radius;
//       });
//       setPets(filteredPets);
//     } catch (error) {
//       console.error("Error loading lost pets:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load lost pets",
//         variant: "destructive",
//       });
//     }
//   };

//   // Geocode user location (convert address to coordinates)
//   const geocodeLocation = async (address: string) => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
//       );
//       const data = await res.json();
//       if (data.length > 0) {
//         const latitude = parseFloat(data[0].lat);
//         const longitude = parseFloat(data[0].lon);
//         setUserLocation({ latitude, longitude });
//       } else {
//         toast({
//           title: "Location error",
//           description: "Unable to geocode user location",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Geocoding failed", error);
//       toast({
//         title: "Geocoding error",
//         description: "Failed to convert location into coordinates",
//         variant: "destructive",
//       });
//     }
//   };

//   // Get current location from the browser if user doesn't have location in profile
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation({ latitude, longitude });
//         toast({
//           title: "Location detected",
//           description: `Latitude: ${latitude}, Longitude: ${longitude}`,
//         });
//         setLocationLoading(false);
//       },
//       () => {
//         toast({
//           title: "Location error",
//           description: "Please allow location access",
//           variant: "destructive",
//         });
//         setLocationLoading(false);
//       }
//     );
//   };

//   // Handle image upload
//   const handleImage = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
//     reader.readAsDataURL(file);
//   };

//   // Handle form submission for reporting a lost pet
//   const handleSubmit = async () => {
//     if (!form.name || !form.breed || !form.lastSeenLocation || !form.contactPhone) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     let payload = { ...form };

//     if (!form.latitude || !form.longitude) {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             form.lastSeenLocation
//           )}`
//         );
//         const data = await res.json();
//         if (data.length > 0) {
//           payload.latitude = parseFloat(data[0].lat);
//           payload.longitude = parseFloat(data[0].lon);
//         }
//       } catch (err) {
//         console.error("Geocoding failed", err);
//         toast({
//           title: "Error",
//           description: "Unable to get coordinates from address",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       await createLostPet(payload);
//       toast({
//         title: "Lost dog reported",
//         description: "Your report is now visible to the community.",
//       });
//       setForm({
//         name: "",
//         breed: "",
//         description: "",
//         lastSeenLocation: "",
//         contactPhone: "",
//         photo: "",
//         latitude: null,
//         longitude: null,
//       });
//       loadPets();
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to report lost dog",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete pet report
//   const handleDelete = async (id: string) => {
//     try {
//       await deleteLostPet(id);
//       toast({ title: "Removed", description: "Lost dog report deleted" });
//       loadPets();
//     } catch {
//       toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="pb-20 max-w-5xl mx-auto p-4">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Lost & Found Dogs</h1>
//         <p className="text-muted-foreground">Help reunite dogs with their owners</p>
//       </div>

//       {/* Form */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Report Lost Dog</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Input
//             placeholder="Dog Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <Input
//             placeholder="Breed"
//             value={form.breed}
//             onChange={(e) => setForm({ ...form, breed: e.target.value })}
//           />
//           <Input
//             placeholder="Last Seen Location"
//             value={form.lastSeenLocation}
//             onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
//           />
//           <Input
//             placeholder="Contact Phone"
//             value={form.contactPhone}
//             onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
//           />
//           <Textarea
//             placeholder="Description (optional)"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//           <Input type="file" accept="image/*" onChange={handleImage} />
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Submitting..." : "Report Lost Dog"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Map */}
//       {pets.length > 0 && <LostPetsMap pets={pets} />}

//       {/* List */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Community Lost Dogs</CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-2 gap-4">
//           {pets.length === 0 && (
//             <p className="text-muted-foreground">No lost dogs reported yet.</p>
//           )}
//           {pets.map((pet) => (
//             <Card key={pet._id}>
//               <CardContent className="p-4 space-y-2">
//                 {pet.photo && (
//                   <img
//                     src={pet.photo}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 )}
//                 <h3 className="text-xl font-semibold">{pet.name}</h3>
//                 <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>
//                 <p className="text-sm">Last Seen: {pet.lastSeenLocation}</p>
//                 <p className="text-sm">Contact: {pet.contactPhone}</p>
//                 <p className="text-sm text-muted-foreground">{pet.description}</p>
//                 {user && pet.userId === user._id && (
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(pet._id)}
//                   >
//                     Mark as Found / Delete
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>

//       <BottomNav />
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getLostPets, createLostPet, deleteLostPet } from "@/api/lostPets";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { BottomNav } from "@/components/BottomNav";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/useToast";
// import { useAuth } from "@/contexts/AuthContext";
// import LostPetsMap from "@/components/LostPetsMap";

// // Function to calculate distance between two coordinates in kilometers using Haversine formula
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Earth radius in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// };

// export default function LostPets() {
//   const { toast } = useToast();
//   const { user } = useAuth();  // User context containing user data including location

//   const [pets, setPets] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [radius, setRadius] = useState(5); // Default radius of 5 km
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     breed: "",
//     description: "",
//     lastSeenLocation: "",
//     contactPhone: "",
//     photo: "",
//     latitude: null as number | null,
//     longitude: null as number | null,
//   });

//   // Set user location from profile (if available) when the component mounts
//   useEffect(() => {
//     if (user && user.location) {
//       // If user profile has location data (text location), geocode it to latitude and longitude
//       geocodeLocation(user.location);
//     } else {
//       // Only get current location if there's no location in the profile
//       getCurrentLocation();
//     }
//   }, [user]);

//   // Load pets within the specified radius
//   useEffect(() => {
//     if (userLocation) {
//       loadPets();
//     }
//   }, [userLocation, radius]);

//   // Load lost pets data
//   const loadPets = async () => {
//     try {
//       const data = await getLostPets();
//       const filteredPets = data.pets.filter((pet: any) => {
//         if (!userLocation || !pet.latitude || !pet.longitude) return false;
//         const distance = calculateDistance(
//           userLocation.latitude,
//           userLocation.longitude,
//           pet.latitude,
//           pet.longitude
//         );
//         return distance <= radius;
//       });
//       setPets(filteredPets);
//     } catch (error) {
//       console.error("Error loading lost pets:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load lost pets",
//         variant: "destructive",
//       });
//     }
//   };

//   // Geocode user location (convert address to coordinates)
//   const geocodeLocation = async (address: string) => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
//       );
//       const data = await res.json();
//       if (data.length > 0) {
//         const latitude = parseFloat(data[0].lat);
//         const longitude = parseFloat(data[0].lon);
//         setUserLocation({ latitude, longitude });
//       } else {
//         toast({
//           title: "Location error",
//           description: "Unable to geocode user location",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Geocoding failed", error);
//       toast({
//         title: "Geocoding error",
//         description: "Failed to convert location into coordinates",
//         variant: "destructive",
//       });
//     }
//   };

//   // Get current location from the browser if user doesn't have location in profile
//   const getCurrentLocation = () => {
//     setLocationLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setUserLocation({ latitude, longitude });
//         toast({
//           title: "Location detected",
//           description: `Latitude: ${latitude}, Longitude: ${longitude}`,
//         });
//         setLocationLoading(false);
//       },
//       () => {
//         toast({
//           title: "Location error",
//           description: "Please allow location access",
//           variant: "destructive",
//         });
//         setLocationLoading(false);
//       }
//     );
//   };

//   // Handle image upload
//   const handleImage = (e: any) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
//     reader.readAsDataURL(file);
//   };

//   // Handle form submission for reporting a lost pet
//   const handleSubmit = async () => {
//     if (!form.name || !form.breed || !form.lastSeenLocation || !form.contactPhone) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     let payload = { ...form };

//     if (!form.latitude || !form.longitude) {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//             form.lastSeenLocation
//           )}`
//         );
//         const data = await res.json();
//         if (data.length > 0) {
//           payload.latitude = parseFloat(data[0].lat);
//           payload.longitude = parseFloat(data[0].lon);
//         }
//       } catch (err) {
//         console.error("Geocoding failed", err);
//         toast({
//           title: "Error",
//           description: "Unable to get coordinates from address",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     try {
//       setLoading(true);
//       await createLostPet(payload);
//       toast({
//         title: "Lost dog reported",
//         description: "Your report is now visible to the community.",
//       });
//       setForm({
//         name: "",
//         breed: "",
//         description: "",
//         lastSeenLocation: "",
//         contactPhone: "",
//         photo: "",
//         latitude: null,
//         longitude: null,
//       });
//       loadPets();
//     } catch {
//       toast({
//         title: "Error",
//         description: "Failed to report lost dog",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete pet report
//   const handleDelete = async (id: string) => {
//     try {
//       await deleteLostPet(id);
//       toast({ title: "Removed", description: "Lost dog report deleted" });
//       loadPets();
//     } catch {
//       toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
//     }
//   };

//   return (
//     <div className="pb-20 max-w-5xl mx-auto p-4">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Lost & Found Dogs</h1>
//         <p className="text-muted-foreground">Help reunite dogs with their owners</p>
//       </div>

//       {/* Form */}
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Report Lost Dog</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           <Input
//             placeholder="Dog Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//           />
//           <Input
//             placeholder="Breed"
//             value={form.breed}
//             onChange={(e) => setForm({ ...form, breed: e.target.value })}
//           />
//           <Input
//             placeholder="Last Seen Location"
//             value={form.lastSeenLocation}
//             onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
//           />
//           <Input
//             placeholder="Contact Phone"
//             value={form.contactPhone}
//             onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
//           />
//           <Textarea
//             placeholder="Description (optional)"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//           />
//           <Input type="file" accept="image/*" onChange={handleImage} />
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? "Submitting..." : "Report Lost Dog"}
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Map */}
//       {pets.length > 0 && <LostPetsMap pets={pets} />}

//       {/* List */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Community Lost Dogs</CardTitle>
//         </CardHeader>
//         <CardContent className="grid md:grid-cols-2 gap-4">
//           {pets.length === 0 && (
//             <p className="text-muted-foreground">No lost dogs reported yet.</p>
//           )}
//           {pets.map((pet) => (
//             <Card key={pet._id}>
//               <CardContent className="p-4 space-y-2">
//                 {pet.photo && (
//                   <img
//                     src={pet.photo}
//                     className="w-full h-48 object-cover rounded"
//                   />
//                 )}
//                 <h3 className="text-xl font-semibold">{pet.name}</h3>
//                 <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>
//                 <p className="text-sm">Last Seen: {pet.lastSeenLocation}</p>
//                 <p className="text-sm">Contact: {pet.contactPhone}</p>
//                 <p className="text-sm text-muted-foreground">{pet.description}</p>
//                 {user && pet.userId === user._id && (
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(pet._id)}
//                   >
//                     Mark as Found / Delete
//                   </Button>
//                 )}
//               </CardContent>
//             </Card>
//           ))}
//         </CardContent>
//       </Card>

//       <BottomNav />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getLostPets, createLostPet, deleteLostPet } from "@/api/lostPets";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import LostPetsMap from "@/components/LostPetsMap";

// Function to calculate distance between two coordinates in kilometers using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default function LostPets() {
  const { toast } = useToast();
  const { user } = useAuth();  // User context containing user data including location

  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [radius, setRadius] = useState(5); // Default radius of 5 km
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    description: "",
    lastSeenLocation: "",
    contactPhone: "",
    photo: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  // Set user location from profile (if available) when the component mounts
  useEffect(() => {
    if (user && user.location) {
      // If user profile has location data (text location), geocode it to latitude and longitude
      geocodeLocation(user.location);
    } else {
      // Only get current location if there's no location in the profile
      getCurrentLocation();
    }
  }, [user]);

  // Load pets within the specified radius
  useEffect(() => {
    if (userLocation) {
      loadPets();
    }
  }, [userLocation, radius]);

  // Load lost pets data
  const loadPets = async () => {
    try {
      const data = await getLostPets();

      // Filter pets within radius for the map (proximity filter)
      const filteredPets = data.pets.filter((pet: any) => {
        if (!userLocation || !pet.latitude || !pet.longitude) return false;
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          pet.latitude,
          pet.longitude
        );
        return distance <= radius; // Only show within radius for map
      });

      // Include pets from the user, regardless of distance, for the list view
      const updatedPets = [
        ...filteredPets,
        ...data.pets.filter((pet: any) => pet.userId === user._id),
      ];
      setPets(updatedPets);
    } catch (error) {
      console.error("Error loading lost pets:", error);
      toast({
        title: "Error",
        description: "Failed to load lost pets",
        variant: "destructive",
      });
    }
  };

  // Geocode user location (convert address to coordinates)
  const geocodeLocation = async (address: string) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        setUserLocation({ latitude, longitude });
      } else {
        toast({
          title: "Location error",
          description: "Unable to geocode user location",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Geocoding failed", error);
      toast({
        title: "Geocoding error",
        description: "Failed to convert location into coordinates",
        variant: "destructive",
      });
    }
  };

  // Get current location from the browser if user doesn't have location in profile
  const getCurrentLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        toast({
          title: "Location detected",
          description: `Latitude: ${latitude}, Longitude: ${longitude}`,
        });
        setLocationLoading(false);
      },
      () => {
        toast({
          title: "Location error",
          description: "Please allow location access",
          variant: "destructive",
        });
        setLocationLoading(false);
      }
    );
  };

  // Handle image upload
  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  // Handle form submission for reporting a lost pet
  const handleSubmit = async () => {
    if (!form.name || !form.breed || !form.lastSeenLocation || !form.contactPhone) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    let payload = { ...form };

    if (!form.latitude || !form.longitude) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            form.lastSeenLocation
          )}`
        );
        const data = await res.json();
        if (data.length > 0) {
          payload.latitude = parseFloat(data[0].lat);
          payload.longitude = parseFloat(data[0].lon);
        }
      } catch (err) {
        console.error("Geocoding failed", err);
        toast({
          title: "Error",
          description: "Unable to get coordinates from address",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setLoading(true);
      await createLostPet(payload);
      toast({
        title: "Lost dog reported",
        description: "Your report is now visible to the community.",
      });
      setForm({
        name: "",
        breed: "",
        description: "",
        lastSeenLocation: "",
        contactPhone: "",
        photo: "",
        latitude: null,
        longitude: null,
      });
      loadPets();
    } catch {
      toast({
        title: "Error",
        description: "Failed to report lost dog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete pet report
  const handleDelete = async (id: string) => {
    try {
      await deleteLostPet(id);
      toast({ title: "Removed", description: "Lost dog report deleted" });
      loadPets();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Lost & Found Dogs</h1>
        <p className="text-muted-foreground">Help reunite dogs with their owners</p>
      </div>

      {/* Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Report Lost Dog</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Dog Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Breed"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
          />
          <Input
            placeholder="Last Seen Location"
            value={form.lastSeenLocation}
            onChange={(e) => setForm({ ...form, lastSeenLocation: e.target.value })}
          />
          <Input
            placeholder="Contact Phone"
            value={form.contactPhone}
            onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
          />
          <Textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input type="file" accept="image/*" onChange={handleImage} />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Report Lost Dog"}
          </Button>
        </CardContent>
      </Card>

      {/* Map */}
      {pets.length > 0 && <LostPetsMap pets={pets.filter((pet) => calculateDistance(userLocation.latitude, userLocation.longitude, pet.latitude, pet.longitude) <= radius)} />}

      {/* List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Community Lost Dogs</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {pets.length === 0 && (
            <p className="text-muted-foreground">No lost dogs reported yet.</p>
          )}
          {pets.map((pet) => (
            <Card key={pet._id}>
              <CardContent className="p-4 space-y-2">
                {pet.photo && (
                  <img
                    src={pet.photo}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <h3 className="text-xl font-semibold">{pet.name}</h3>
                <p className="text-sm text-muted-foreground">Breed: {pet.breed}</p>
                <p className="text-sm">Last Seen: {pet.lastSeenLocation}</p>
                <p className="text-sm">Contact: {pet.contactPhone}</p>
                <p className="text-sm text-muted-foreground">{pet.description}</p>
                {user && pet.userId === user._id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(pet._id)}
                  >
                    Mark as Found / Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <BottomNav />
    </div>
  );
}