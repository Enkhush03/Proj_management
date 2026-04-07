import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingsApi } from '../api/bookingsApi';

export default function PaymentsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('QPAY');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentBooking = orders.find((order) => order.id === bookingId);

  useEffect(() => {
    bookingsApi.getMine().then((data) => setOrders(data.bookings));
  }, [bookingId]);

  async function handlePay() {
    try {
      setLoading(true);
      await bookingsApi.pay(bookingId, { paymentMethod: method });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  }

  if (!currentBooking) return <div className="page"><div className="card">Захиалга хайж байна...</div></div>;

  return (
    <div className="page stack">
      <div className="card stack">
        <h2 style={{ margin: 0 }}>Төлбөр</h2>
        <div className="row-between"><span className="muted">Захиалга</span><strong>{currentBooking.parkName}</strong></div>
        <div className="row-between"><span className="muted">Хугацаа</span><strong>{currentBooking.hours} цаг</strong></div>
        <div className="row-between"><span className="muted">Нийт дүн</span><strong>₮{currentBooking.total.toLocaleString()}</strong></div>
      </div>

      <div className="card stack">
        <div className="field">
          <label>Төлбөрийн хэрэгсэл</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="QPAY">QPay</option>
            <option value="VISA">Visa</option>
            <option value="SOCIALPAY">SocialPay</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={handlePay} disabled={loading}>
          {loading ? 'Төлбөр боловсруулж байна...' : 'Төлбөр хийх'}
        </button>
      </div>
    </div>
  );
}
