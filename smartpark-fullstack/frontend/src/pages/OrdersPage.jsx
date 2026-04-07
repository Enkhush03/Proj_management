import { useEffect, useState } from 'react';
import { bookingsApi } from '../api/bookingsApi';

export default function OrdersPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingsApi.getMine().then((data) => setBookings(data.bookings));
  }, []);

  return (
    <div className="page stack">
      <div className="row-between">
        <div>
          <h2 style={{ marginBottom: 6 }}>Миний захиалгууд</h2>
          <div className="muted">Идэвхтэй болон өмнөх захиалгууд</div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="card">Одоогоор захиалга алга.</div>
      ) : (
        bookings.map((booking) => (
          <div className="card stack" key={booking.id}>
            <div className="row-between">
              <strong>{booking.parkName}</strong>
              <span className={`badge ${booking.status === 'PAID' ? 'badge-green' : booking.status === 'CREATED' ? 'badge-blue' : 'badge-red'}`}>
                {booking.status}
              </span>
            </div>
            <div className="muted">{booking.vehiclePlate}</div>
            <div className="row-between">
              <span>{booking.hours} цаг</span>
              <strong>₮{booking.total.toLocaleString()}</strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
