import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PetLocation } from "@/types/location";

interface Props {
  locations: PetLocation[];
  center: { latitude: number; longitude: number };
}

// Fix default marker issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function LocationsMap({ locations, center }: Props) {
  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker
          key={location._id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <strong>{location.name}</strong>
            <br />
            {location.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}