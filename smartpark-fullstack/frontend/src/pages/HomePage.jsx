import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parksApi } from '../api/parksApi';

export default function HomePage() {
  const [parks, setParks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parksApi.getAll().then((data) => setParks(data.parks)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="row-between">
          <div>
            <h2 style={{ margin: 0 }}>Ойролцоох зогсоолууд</h2>
            <p style={{ opacity: 0.8, marginBottom: 0 }}>Бодит цагийн сул зогсоолын мэдээлэл</p>
          </div>
          <span className="badge badge-green">Live</span>
        </div>
      </section>

      {loading ? (
        <div className="card">Зогсоолуудыг ачааллаж байна...</div>
      ) : (
        <div className="grid grid-3">
          {parks.map((park) => (
            <div key={park.id} className="card park-card">
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
              <Link to={`/parks/${park.id}`} className="btn btn-primary" style={{ textAlign: 'center' }}>
                Дэлгэрэнгүй
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
