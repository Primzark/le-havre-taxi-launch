import { useEffect, useMemo } from "react";
import L from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Station } from "@/data/stations";

const DEFAULT_CENTER: [number, number] = [49.49437, 0.10793];

const stationMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type FitBoundsProps = {
  stations: Station[];
};

const FitBounds = ({ stations }: FitBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    if (stations.length === 0) {
      map.setView(DEFAULT_CENTER, 12, { animate: true });
      return;
    }

    if (stations.length === 1) {
      map.setView([stations[0].latitude, stations[0].longitude], 14, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(stations.map((station) => [station.latitude, station.longitude]));
    map.fitBounds(bounds, { padding: [35, 35] });
  }, [map, stations]);

  return null;
};

type FocusSelectionProps = {
  station?: Station;
};

const FocusSelection = ({ station }: FocusSelectionProps) => {
  const map = useMap();

  useEffect(() => {
    if (!station) {
      return;
    }

    map.flyTo([station.latitude, station.longitude], Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.6,
    });
  }, [map, station]);

  return null;
};

type StationsMapProps = {
  stations: Station[];
  selectedStationId?: number | null;
  onSelect?: (station: Station) => void;
};

const StationsMap = ({ stations, selectedStationId, onSelect }: StationsMapProps) => {
  const selectedStation = useMemo(
    () => stations.find((station) => station.id === selectedStationId),
    [stations, selectedStationId],
  );

  return (
    <div className="isolate overflow-hidden rounded-lg border bg-background">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        scrollWheelZoom={false}
        className="relative z-0 h-[360px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds stations={stations} />
        <FocusSelection station={selectedStation} />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={stationMarkerIcon}
            eventHandlers={{
              click: () => onSelect?.(station),
            }}
          >
            <Popup>
              <p className="font-semibold">{station.name}</p>
              <p className="text-sm">{station.address}</p>
              <a
                className="text-sm text-blue-700 underline"
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Itinéraire
              </a>
            </Popup>
          </Marker>
        ))}

        {selectedStation && (
          <Circle
            center={[selectedStation.latitude, selectedStation.longitude]}
            pathOptions={{ color: "#f97316", fillColor: "#f97316", fillOpacity: 0.15 }}
            radius={180}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default StationsMap;
