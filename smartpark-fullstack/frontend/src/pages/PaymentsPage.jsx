import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookingsApi } from '../api/bookingsApi';
import QRCode from 'qrcode';

export default function PaymentsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('QPAY');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentBooking = orders.find((order) => order.id === bookingId);

  // --- QPAY EXTENSION STATES ---
  const [selectedBank, setSelectedBank] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');

  // --- QPAY EXTENSION LOGIC ---
  useEffect(() => {
    if (selectedBank && currentBooking) {
      const mockInvoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      setInvoiceId(mockInvoiceId);
      const qrContent = `Bank: ${selectedBank}\nAmount: ${currentBooking.total}\nInvoice ID: ${mockInvoiceId}\nBooking Info: ${currentBooking.parkName} (${currentBooking.hours}h)`;
      QRCode.toDataURL(qrContent, { width: 200, margin: 2 })
        .then(url => setQrCodeDataUrl(url))
        .catch(err => console.error(err));
      setPaymentStatus('Pending');
    }
  }, [selectedBank, currentBooking]);

  const handleCheckPayment = () => {
    setIsCheckingPayment(true);
    setTimeout(() => {
      setIsCheckingPayment(false);
      setPaymentStatus('Paid');
      // Automatically trigger the main handlePay logic to complete flow
      handlePay();
    }, 1500);
  };

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

        {/* --- QPAY EXTENSION UI START --- */}
        {method === 'QPAY' && (
          <div className="field" style={{ marginTop: '1rem' }}>
            <label>Select Bank / Банк сонгох</label>
            <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
              <option value="">-- Сонгоно уу --</option>
              <option value="Khan Bank">Khan Bank</option>
              <option value="Golomt Bank">Golomt Bank</option>
              <option value="TDB">TDB</option>
              <option value="State Bank">State Bank</option>
              <option value="XacBank">XacBank</option>
            </select>
          </div>
        )}

        {method === 'QPAY' && selectedBank && qrCodeDataUrl && (
          <div className="card stack" style={{ alignItems: 'center', textAlign: 'center', marginTop: '1rem' }}>
            <img src={qrCodeDataUrl} alt="QPay QR Code" />
            <div style={{ margin: '10px 0', lineHeight: '1.5' }}>
              <div><strong>Selected Bank:</strong> {selectedBank}</div>
              <div><strong>Amount:</strong> ₮{currentBooking.total.toLocaleString()}</div>
              <div><strong>Invoice ID:</strong> {invoiceId}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Status:</strong>{' '}
                <span style={{
                  color: paymentStatus === 'Paid' ? 'green' : '#f0ad4e',
                  fontWeight: 'bold',
                  display: 'inline-block',
                }}>
                  {paymentStatus} {paymentStatus === 'Pending' ? '...' : '✓'}
                </span>
              </div>
            </div>

            {paymentStatus === 'Pending' && (
              <button
                className="btn"
                style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', marginTop: '0.5rem' }}
                onClick={handleCheckPayment}
                disabled={isCheckingPayment}
              >
                {isCheckingPayment ? 'Checking...' : 'Check Payment'}
              </button>
            )}
          </div>
        )}
        {/* --- QPAY EXTENSION UI END --- */}

        <button className="btn btn-primary" onClick={handlePay} disabled={loading}>
          {loading ? 'Төлбөр боловсруулж байна...' : 'Төлбөр хийх'}
        </button>
      </div>
    </div>
  );
}
