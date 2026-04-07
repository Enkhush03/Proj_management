import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { parksApi } from '../api/parksApi';

export default function ParkDetailsPage() {
  const { parkId } = useParams();
  const [park, setPark] = useState(null);

  useEffect(() => {
    parksApi.getOne(parkId).then((data) => setPark(data.park));
  }, [parkId]);

  if (!park) return <div className="page"><div className="card">Ачааллаж байна...</div></div>;

  return (
    <div className="page stack">
      <section className="hero">
        <h2 style={{ marginTop: 0 }}>{park.name}</h2>
        <div>{park.address}</div>
      </section>

      <div className="grid grid-2">
        <div className="card stack">
          <div className="row-between">
            <span className="muted">Цагийн төлбөр</span>
            <strong>₮{park.hourlyRate.toLocaleString()}</strong>
          </div>
          <div className="row-between">
            <span className="muted">Өдрийн төлбөр</span>
            <strong>₮{park.dailyRate.toLocaleString()}</strong>
          </div>
          <div className="row-between">
            <span className="muted">Сул зогсоол</span>
            <strong>{park.availableSlots} / {park.totalSlots}</strong>
          </div>
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
    </div>
  );
}
