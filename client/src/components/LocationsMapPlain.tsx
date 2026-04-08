import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PetLocation } from "@/types/location";

interface Props {
  locations: PetLocation[];
  center: { latitude: number; longitude: number };
}

export function LocationsMapPlain({ locations, center }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([center.latitude, center.longitude], 13);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Helper: Get emoji based on type with proper order
    const getEmojiForType = (type?: string) => {
      if (!type) return "";
      const normalized = type.trim().toLowerCase();

      // Parks first
      if (normalized.includes("park")) return "🌳";

      // Hospital next (so "Pet Hospital" always shows 🏥)
      if (normalized.includes("hospital")) return "🏥";

      // Vet clinic after hospital (so "Vet Clinic" shows 🩺)
      if (normalized.includes("vet")) return "🩺";

      // Fallback
      return "";
    };

    // Add markers
    locations.forEach((loc) => {
      const emoji = getEmojiForType(loc.type);

      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: L.divIcon({
          html: `<span style="font-size: 28px">${emoji}</span>`,
          className: "", // remove default marker styles
        }),
      }).addTo(map);

      marker.bindPopup(`
        <b>${loc.name}</b><br/>
        ${loc.address}${loc.phone ? `<br/>📞 ${loc.phone}` : ""}
      `);
    });

    // Clean up map on unmount
    return () => map.remove();
  }, [locations, center]);

  return <div ref={mapRef} className="w-full h-96 rounded-md" />;
}