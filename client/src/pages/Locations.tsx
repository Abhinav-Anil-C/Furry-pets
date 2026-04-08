import { useEffect, useState, useCallback } from 'react';
import { MapPin, Phone, Navigation, Filter } from 'lucide-react';
import { getLocations } from '@/api/locations';
import { PetLocation } from '@/types/location';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LocationsMapPlain } from "@/components/LocationsMapPlain";
export function Locations() {
  const [locations, setLocations] = useState<PetLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [manualAddress, setManualAddress] = useState('');
  const [usingManualLocation, setUsingManualLocation] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadLocations();
    }
  }, [userLocation, selectedType]);

  const getUserLocation = useCallback(() => {
    setUsingManualLocation(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ latitude: 40.7128, longitude: -74.006 });

          toast({
            title: 'Location Access',
            description: 'Using default location. Enable location access for better results.',
            variant: 'destructive',
          });
        }
      );
    }
  }, [toast]);

  // ⭐ Nominatim Address → Coordinates
  const getCoordinatesFromAddress = async () => {
    if (!manualAddress) {
      toast({
        title: 'Enter address',
        description: 'Please enter an address first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          manualAddress
        )}&format=json&limit=1`
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];

        setUserLocation({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        });

        setUsingManualLocation(true);
      } else {
        toast({
          title: 'Address not found',
          description: 'Try a different address.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch location.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = useCallback(async () => {
    if (!userLocation) return;

    setLoading(true);

    try {
      const response = await getLocations(
        userLocation.latitude,
        userLocation.longitude,
        selectedType
      );

      setLocations(response.locations);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userLocation, selectedType, toast]);

  const handleGetDirections = (location: PetLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const filterTypes = [
    { label: 'All', value: undefined },
    { label: 'Parks', value: 'Park' },
    { label: 'Vet Clinics', value: 'Vet Clinic' },
    { label: 'Pet Hospitals', value: 'Pet Hospital' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Park':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Vet Clinic':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      case 'Pet Hospital':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Park':
        return '🏞️';
      case 'Vet Clinic':
      case 'Pet Hospital':
        return '🏥';
      default:
        return '📍';
    }
  };

  if (loading) {
    return (
      <div className="pb-20">
        <LoadingSpinner message="Finding pet-friendly locations..." />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="max-w-4xl mx-auto">

        <div className="mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Pet-Friendly Locations
          </h1>
          <p className="text-muted-foreground mt-1">
            Find parks, clinics, and hospitals near you
          </p>
        </div>

        {usingManualLocation && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing results near: {manualAddress}
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-3 mb-6">

          <Button onClick={getUserLocation} variant="outline">
            <Navigation className="h-4 w-4 mr-2" />
            Use My Location
          </Button>

          <input
            type="text"
            placeholder="Enter address manually..."
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="border rounded-md px-3 py-2 flex-1"
          />

          <Button onClick={getCoordinatesFromAddress}>
            <MapPin className="h-4 w-4 mr-2" />
            Search
          </Button>

        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filterTypes.map((filter) => (
            <Button
              key={filter.label}
              variant={selectedType === filter.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(filter.value)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>
        {/* {userLocation && locations.length > 0 && (
  <div className="mb-6">
    <LocationsMap
      locations={locations}
      center={userLocation}
    />
  </div>
)} */}
        // Inside your JSX
{userLocation && locations.length > 0 && (
  <div className="mb-6">
    <LocationsMapPlain
      locations={locations}
      center={userLocation}
    />
  </div>
)}

        <div className="space-y-4">
          {locations.map((location) => (
            <Card key={location._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">

                <div className="flex items-start justify-between mb-4">

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getTypeIcon(location.type)}</span>
                      <h3 className="text-xl font-semibold">{location.name}</h3>
                    </div>

                    <Badge className={getTypeColor(location.type)}>
                      {location.type}
                    </Badge>
                  </div>

                  {location.distance && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{location.distance}</p>
                      <p className="text-sm text-muted-foreground">km away</p>
                    </div>
                  )}

                </div>

                <div className="space-y-2 mb-4">

                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <p className="text-sm">{location.address}</p>
                  </div>

                  {location.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm">{location.phone}</p>
                    </div>
                  )}

                  {location.rating && (
                    <div className="flex items-center gap-2">
                      ⭐ <p className="text-sm font-medium">{location.rating} / 5.0</p>
                    </div>
                  )}

                </div>

                <div className="flex gap-2">

                  <Button
                    onClick={() => handleGetDirections(location)}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>

                  {location.phone && (
                    <Button
                      onClick={() => handleCall(location.phone)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  )}

                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}