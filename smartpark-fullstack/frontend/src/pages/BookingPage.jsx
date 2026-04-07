import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parksApi } from '../api/parksApi';
import { bookingsApi } from '../api/bookingsApi';

const SERVICE_FEE = 200;

export default function BookingPage() {
  const { parkId } = useParams();
  const navigate = useNavigate();
  const [park, setPark] = useState(null);
  const [hours, setHours] = useState(2);
  const [vehiclePlate, setVehiclePlate] = useState('1234УБА');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    parksApi.getOne(parkId).then((data) => setPark(data.park));
  }, [parkId]);

  const total = useMemo(() => {
    if (!park) return 0;
    return park.hourlyRate * hours + SERVICE_FEE;
  }, [park, hours]);

  async function handleBooking() {
    if (!vehiclePlate.trim()) {
      setError('Машины улсын дугаар оруулна уу.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await bookingsApi.create({ parkId, hours, vehiclePlate });
      navigate(`/payments/${data.booking.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!park) return <div className="page"><div className="card">Ачааллаж байна...</div></div>;

  return (
    <div className="page stack">
      <div className="card stack">
        <h2 style={{ margin: 0 }}>Захиалга баталгаажуулах</h2>
        <div className="muted">{park.name}</div>

        {error && <div className="error-box">{error}</div>}

        <div className="field">
          <label>Хугацаа</label>
          <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
            <option value={1}>1 цаг</option>
            <option value={2}>2 цаг</option>
            <option value={4}>4 цаг</option>
            <option value={8}>Өдөр</option>
          </select>
        </div>

        <div className="field">
          <label>Машины улсын дугаар</label>
          <input value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())} />
        </div>
      </div>

      <div className="card stack">
        <div className="row-between"><span className="muted">Зогсоолын төлбөр</span><strong>₮{(park.hourlyRate * hours).toLocaleString()}</strong></div>
        <div className="row-between"><span className="muted">Үйлчилгээний шимтгэл</span><strong>₮{SERVICE_FEE.toLocaleString()}</strong></div>
        <div className="row-between"><span>Нийт</span><strong>₮{total.toLocaleString()}</strong></div>
        <button className="btn btn-primary" onClick={handleBooking} disabled={loading}>
          {loading ? 'Үүсгэж байна...' : 'Төлбөр рүү үргэлжлүүлэх'}
        </button>
      </div>
    </div>
  );
}
