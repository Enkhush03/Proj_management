import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { parksApi } from '../api/parksApi';
import ParksMap from '../components/ParksMap';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

const defaultFilters = {
  radiusKm: 5,
  maxHourlyRate: '',
  minAvailableSlots: 0,
};

export default function HomePage() {
  const [parks, setParks] = useState([]);
  const [selectedParkId, setSelectedParkId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const { location, locationError, isLocating } = useCurrentLocation();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    parksApi
      .getNearby({
        lat: location.lat,
        lng: location.lng,
        radiusKm: filters.radiusKm,
        maxHourlyRate: filters.maxHourlyRate || undefined,
        minAvailableSlots: filters.minAvailableSlots || undefined,
      })
      .then((data) => {
        if (!active) return;
        setParks(data.parks);
        setSelectedParkId((current) => {
          if (current && data.parks.some((park) => park.id === current)) return current;
          return data.parks[0]?.id || '';
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [location.lat, location.lng, filters]);

  const selectedPark = useMemo(
    () => parks.find((park) => park.id === selectedParkId) || parks[0] || null,
    [parks, selectedParkId],
  );

  const hasParks = parks.length > 0;
  const summary = useMemo(() => {
    if (!hasParks) return 'Ойролцоо зогсоол олдсонгүй';
    return `${parks.length} зогсоол ${filters.radiusKm} км дотор олдлоо`;
  }, [hasParks, parks.length, filters.radiusKm]);

  return (
    <div className="page stack">
      <section className="hero stack" style={{ gap: 10 }}>
        <div className="row-between wrap-mobile">
          <div>
            <h2 style={{ margin: 0 }}>Ойролцоох зогсоолууд</h2>
            <p style={{ opacity: 0.85, marginBottom: 0 }}>{summary}</p>
          </div>
          <span className="badge badge-green">Live map</span>
        </div>
        {isLocating && <div className="hero-note">Таны байршлыг тодорхойлж байна...</div>}
        {locationError && <div className="hero-note">{locationError}</div>}
      </section>

      <div className="card stack">
        <div className="row-between wrap-mobile">
          <h3 style={{ margin: 0 }}>Шүүлтүүр</h3>
          <button type="button" className="btn btn-secondary" onClick={() => setFilters(defaultFilters)}>
            Reset
          </button>
        </div>

        <div className="grid grid-filter">
          <div className="field">
            <label>Радиус</label>
            <select
              value={filters.radiusKm}
              onChange={(event) => setFilters((current) => ({ ...current, radiusKm: Number(event.target.value) }))}
            >
              <option value={1}>1 км</option>
              <option value={3}>3 км</option>
              <option value={5}>5 км</option>
              <option value={10}>10 км</option>
            </select>
          </div>

          <div className="field">
            <label>Дээд үнэ / цаг</label>
            <select
              value={filters.maxHourlyRate}
              onChange={(event) => setFilters((current) => ({ ...current, maxHourlyRate: event.target.value }))}
            >
              <option value="">Хязгааргүй</option>
              <option value="3000">₮3,000 хүртэл</option>
              <option value="4000">₮4,000 хүртэл</option>
              <option value="5000">₮5,000 хүртэл</option>
              <option value="6000">₮6,000 хүртэл</option>
            </select>
          </div>

          <div className="field">
            <label>Хамгийн бага сул зогсоол</label>
            <select
              value={filters.minAvailableSlots}
              onChange={(event) => setFilters((current) => ({ ...current, minAvailableSlots: Number(event.target.value) }))}
            >
              <option value={0}>Ямар ч байсан</option>
              <option value={5}>5+</option>
              <option value={10}>10+</option>
              <option value={20}>20+</option>
              <option value={40}>40+</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card stack">
        <div className="row-between wrap-mobile">
          <h3 style={{ margin: 0 }}>Газрын зураг</h3>
          <span className="muted">Төв цэг: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
        </div>
        <ParksMap
          center={location}
          parks={parks}
          height={460}
          radiusKm={filters.radiusKm}
          showRadius
          showRoute
          selectedParkId={selectedParkId}
          onSelectPark={(park) => setSelectedParkId(park.id)}
        />
      </div>

      {selectedPark && (
        <div className="card stack selected-summary">
          <div className="row-between wrap-mobile">
            <div>
              <div className="muted">Сонгосон зогсоол</div>
              <h3 style={{ margin: '4px 0 0' }}>{selectedPark.name}</h3>
            </div>
            <span className="badge badge-blue">{selectedPark.distanceKm ?? '-'} км</span>
          </div>
          <div className="muted">{selectedPark.address}</div>
          <div className="row wrap-mobile">
            <span className="badge badge-green">{selectedPark.availableSlots} сул</span>
            <span className="badge badge-blue">₮{selectedPark.hourlyRate.toLocaleString()}/цаг</span>
          </div>
          <Link to={`/parks/${selectedPark.id}`} className="btn btn-primary" style={{ textAlign: 'center' }}>
            Дэлгэрэнгүй харах
          </Link>
        </div>
      )}

      {loading ? (
        <div className="card">Зогсоолуудыг ачааллаж байна...</div>
      ) : !hasParks ? (
        <div className="card">Ойролцоо зогсоол олдсонгүй. Радиус эсвэл шүүлтүүрээ сулруулна уу.</div>
      ) : (
        <div className="grid grid-3">
          {parks.map((park) => (
            <button
              type="button"
              key={park.id}
              className={`card park-card park-card-button ${selectedParkId === park.id ? 'park-card-selected' : ''}`}
              onClick={() => setSelectedParkId(park.id)}
            >
              <div className="row-between">
                <h3 style={{ margin: 0 }}>{park.name}</h3>
                <span className="badge badge-blue">{park.distanceKm} км</span>
              </div>
              <div className="muted">{park.address}</div>
              <div className="row-between">
                <div>
                  <div className="park-price">₮{park.hourlyRate.toLocaleString()}</div>
                  <div className="muted">/ цаг</div>
                </div>
                <div>
                  <div className="stat">{park.availableSlots}</div>
                  <div className="muted">сул / {park.totalSlots}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
