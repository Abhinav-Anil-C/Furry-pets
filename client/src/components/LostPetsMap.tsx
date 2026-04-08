import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

export default function LostPetsMap({ pets }: { pets: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map (default center Mumbai)
    const map = L.map(mapRef.current).setView([19.076, 72.8777], 12);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Marker cluster
    const markers = (L as any).markerClusterGroup();

    // Add dog markers
    const validPets = pets.filter(
      (pet) =>
        pet &&
        typeof pet.latitude === "number" &&
        typeof pet.longitude === "number"
    );

    validPets.forEach((pet) => {
      const marker = L.marker([pet.latitude, pet.longitude], {
        icon: L.divIcon({
          html: `<span style="font-size: 28px">🐶</span>`,
          className: "dog-marker",
        }),
      });

      marker.bindPopup(`
        <b>${pet.name}</b><br/>
        📍 ${pet.lastSeenLocation}<br/>
        📞 ${pet.contactPhone}<br/>
        ${pet.photo ? `<img src="${pet.photo}" class="w-32 h-32 object-cover rounded mt-2"/>` : ""}
      `);

      markers.addLayer(marker);
    });

    map.addLayer(markers);

    // Add user location and fit bounds
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        // Blue dot
        L.circleMarker([userLat, userLng], {
          radius: 8,
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.8,
        })
          .addTo(map)
          .bindPopup("📍 You are here");

        const allCoords = validPets.map((p) => [p.latitude, p.longitude]);
        allCoords.push([userLat, userLng]);

        if (allCoords.length > 0) {
          const group = L.featureGroup(allCoords.map((c: number[]) => L.marker(c)));
          map.fitBounds(group.getBounds().pad(0.2));
        }
      },
      () => {
        // Fit only pets if location denied
        if (validPets.length > 0) {
          const group = L.featureGroup(
            validPets.map((p) => L.marker([p.latitude, p.longitude]))
          );
          map.fitBounds(group.getBounds().pad(0.2));
        }
      }
    );

    return () => map.remove();
  }, [pets]);

  return <div ref={mapRef} className="w-full h-96 rounded-lg" />;
}

