import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

const parkIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedParkIcon = new L.DivIcon({
  html: '<div style="width:22px;height:22px;border-radius:999px;background:#10b981;border:4px solid white;box-shadow:0 0 0 8px rgba(16,185,129,.18)"></div>',
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const userIcon = new L.DivIcon({
  html: '<div style="width:14px;height:14px;border-radius:999px;background:#2563eb;border:3px solid white;box-shadow:0 0 0 6px rgba(37,99,235,.18)"></div>',
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function ParksMap({
  center,
  parks,
  height = 360,
  radiusKm = 0,
  selectedParkId,
  onSelectPark,
  showRadius = false,
  showRoute = false,
}) {
  const selectedPark = parks.find((park) => park.id === selectedParkId) || null;
  const routePoints =
    showRoute && selectedPark
      ? [
          [center.lat, center.lng],
          [selectedPark.latitude, selectedPark.longitude],
        ]
      : null;

  return (
    <div className="map-shell" style={{ height }}>
      <MapContainer center={[center.lat, center.lng]} zoom={14} scrollWheelZoom className="leaflet-map">
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[center.lat, center.lng]} icon={userIcon}>
          <Popup>Таны одоогийн байршил</Popup>
        </Marker>

        {showRadius && radiusKm > 0 && (
          <Circle center={[center.lat, center.lng]} radius={radiusKm * 1000} pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.08 }} />
        )}

        {routePoints && <Polyline positions={routePoints} pathOptions={{ color: '#10b981', weight: 4, dashArray: '10 10' }} />}

        {parks.map((park) => {
          const isSelected = selectedParkId === park.id;
          return (
            <Marker
              key={park.id}
              position={[park.latitude, park.longitude]}
              icon={isSelected ? selectedParkIcon : parkIcon}
              eventHandlers={{ click: () => onSelectPark?.(park) }}
            >
              <Popup>
                <div className="stack" style={{ gap: 8, minWidth: 180 }}>
                  <strong>{park.name}</strong>
                  <span>{park.address}</span>
                  <span>₮{park.hourlyRate.toLocaleString()}/цаг</span>
                  {park.distanceKm != null && <span>{park.distanceKm} км зайтай</span>}
                  <button type="button" className="btn btn-secondary" onClick={() => onSelectPark?.(park)}>
                    Чиглэл харах
                  </button>
                  <Link to={`/parks/${park.id}`} className="btn btn-primary" style={{ textAlign: 'center' }}>
                    Дэлгэрэнгүй
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
