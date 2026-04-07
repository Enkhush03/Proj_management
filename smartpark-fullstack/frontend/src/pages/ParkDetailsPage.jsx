import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { parksApi } from '../api/parksApi';
import ParksMap from '../components/ParksMap';
import { useCurrentLocation } from '../hooks/useCurrentLocation';

export default function ParkDetailsPage() {
  const { parkId } = useParams();
  const [park, setPark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { location } = useCurrentLocation();

  useEffect(() => {
    setLoading(true);
    setError('');
    parksApi
      .getOne(parkId)
      .then((data) => setPark(data.park))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [parkId]);

  const center = useMemo(() => location, [location]);
  const mapParks = useMemo(() => (park ? [park] : []), [park]);

  if (loading) return <div className="page"><div className="card">Ачааллаж байна...</div></div>;
  if (error) return <div className="page"><div className="error-box">{error}</div></div>;
  if (!park) return null;

  return (
    <div className="page stack">
      <section className="hero stack" style={{ gap: 10 }}>
        <h2 style={{ marginTop: 0 }}>{park.name}</h2>
        <div>{park.address}</div>
        <div className="hero-note">Чиглэл: таны байршлаас энэ зогсоол руу route line харуулж байна.</div>
      </section>

      <div className="grid grid-2">
        <div className="card stack">
          <div className="row-between"><span className="muted">Цагийн төлбөр</span><strong>₮{park.hourlyRate.toLocaleString()}</strong></div>
          <div className="row-between"><span className="muted">Өдрийн төлбөр</span><strong>₮{park.dailyRate.toLocaleString()}</strong></div>
          <div className="row-between"><span className="muted">Сул зогсоол</span><strong>{park.availableSlots} / {park.totalSlots}</strong></div>
          <div className="row-between"><span className="muted">GPS</span><strong>{park.latitude}, {park.longitude}</strong></div>
        </div>

        <div className="card stack">
          <h3 style={{ margin: 0 }}>Тоноглол</h3>
          <div className="row" style={{ flexWrap: 'wrap' }}>
            {park.features.map((feature) => (
              <span key={feature} className="badge badge-blue">{feature}</span>
            ))}
          </div>
          <Link className="btn btn-primary" to={`/booking/${park.id}`}>Захиалга үүсгэх</Link>
        </div>
      </div>

      <div className="card stack">
        <div className="row-between wrap-mobile">
          <h3 style={{ margin: 0 }}>Байршил ба чиглэл</h3>
          <span className="muted">Live route preview</span>
        </div>
        <ParksMap
          center={center}
          parks={mapParks}
          height={400}
          selectedParkId={park.id}
          showRoute
          onSelectPark={() => {}}
        />
      </div>
    </div>
  );
}
