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

  const mapStatus = loading ? 'Шинэ мэдээлэл ачаалж байна...' : summary;

  return (
    <div className="page page-wide home-layout">
      <section className="hero stack">
        <div className="row-between wrap-mobile">
          <div className="page-heading" style={{ gap: 10 }}>
            <span className="badge badge-blue" style={{ width: 'fit-content' }}>Live parking map</span>
            <h2 className="hero-title">Ойролцоох зогсоолууд</h2>
            <p className="hero-subtitle">Газрын зураг, зай, үнэ, сул орон тоо зэргийг нэг дор харж, хамгийн тохиромжтой зогсоолоо хурдан сонгоорой.</p>
          </div>
          <span className="badge badge-green">{mapStatus}</span>
        </div>
        <div className="row wrap-mobile">
          {isLocating && <div className="hero-note">Таны байршлыг тодорхойлж байна...</div>}
          {locationError && <div className="hero-note">{locationError}</div>}
        </div>
      </section>

      {error && <div className="error-box">{error}</div>}

      <div className="home-main">
        <div className="stack">
          <div className="card stack">
            <div className="section-title wrap-mobile">
              <div className="page-heading">
                <h3>Газрын зураг</h3>
                <p>Таны одоогийн байршил дээр тулгуурласан ойролцоох зогсоолууд.</p>
              </div>
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

            {loading && (
              <div className="info-box">
                Газрын зураг дээрх зогсоолууд шинэчлэгдэж байна. Хамгийн сүүлийн мэдээлэл удахгүй гарч ирнэ.
              </div>
            )}
          </div>

          <div className="card stack">
            <div className="section-title wrap-mobile">
              <div className="page-heading">
                <h3>Сонгосон зогсоол</h3>
                <p>{selectedPark ? 'Дэлгэрэнгүй мэдээлэл болон шууд хандах холбоос.' : 'Жагсаалтаас нэг зогсоол сонгоно уу.'}</p>
              </div>
              {selectedPark && <span className="badge badge-blue">{selectedPark.distanceKm ?? '-'} км</span>}
            </div>

            {selectedPark ? (
              <div className="stack selected-summary">
                <div className="row-between wrap-mobile">
                  <div className="park-meta">
                    <div className="muted">Сонгосон зогсоол</div>
                    <h3 style={{ margin: 0 }}>{selectedPark.name}</h3>
                  </div>
                  <span className="badge badge-blue">{selectedPark.distanceKm ?? '-'} км</span>
                </div>
                <div className="muted">{selectedPark.address}</div>
                <div className="park-stats">
                  <div>
                    <div className="park-price">₮{selectedPark.hourlyRate.toLocaleString()}</div>
                    <div className="muted">/ цаг</div>
                  </div>
                  <div>
                    <div className="stat">{selectedPark.availableSlots}</div>
                    <div className="muted">сул / {selectedPark.totalSlots}</div>
                  </div>
                </div>
                <Link to={`/parks/${selectedPark.id}`} className="btn btn-primary btn-block" style={{ textAlign: 'center' }}>
                  Дэлгэрэнгүй харах
                </Link>
              </div>
            ) : (
              <div className="empty-state">
                <div className="spinner" />
                <div>
                  <div className="loading-label">Сонголт хүлээгдэж байна</div>
                  <div>Жагсаалтаас нэг зогсоол товшоод дэлгэрэнгүйг харна уу.</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="sidebar-stack">
          <div className="card stack">
            <div className="section-title wrap-mobile">
              <div className="page-heading">
                <h3>Шүүлтүүр</h3>
                <p>Өөрт тохирох зогсоолуудыг илүү нарийвчлан шүүнэ.</p>
              </div>
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

          <div className="card stack">
            <div className="section-title wrap-mobile">
              <div className="page-heading">
                <h3>Ойролцоох жагсаалт</h3>
                <p>{loading ? 'Шинэчлэгдэж байна...' : summary}</p>
              </div>
              <span className="badge badge-green">{parks.length}</span>
            </div>

            {loading ? (
              <div className="loading-grid">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="card skeleton skeleton-card stack" aria-hidden="true">
                    <div className="skeleton skeleton-line lg" style={{ width: '72%' }} />
                    <div className="skeleton skeleton-line" style={{ width: '88%' }} />
                    <div className="skeleton skeleton-line sm" />
                    <div className="row-between" style={{ marginTop: 8 }}>
                      <div className="skeleton skeleton-line lg" style={{ width: '34%' }} />
                      <div className="skeleton skeleton-line lg" style={{ width: '20%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : !hasParks ? (
              <div className="empty-state">
                <div className="spinner" />
                <div>
                  <div className="loading-label">Ойролцоо зогсоол олдсонгүй</div>
                  <div>Радиус эсвэл шүүлтүүрээ бага зэрэг сулруулж дахин оролдоорой.</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-3">
                {parks.map((park) => (
                  <button
                    type="button"
                    key={park.id}
                    className={`card park-card park-card-button ${selectedParkId === park.id ? 'park-card-selected' : ''}`}
                    onClick={() => setSelectedParkId(park.id)}
                  >
                    <div className="row-between wrap-mobile">
                      <div className="park-meta">
                        <h3 style={{ margin: 0 }}>{park.name}</h3>
                        <div className="muted">{park.address}</div>
                      </div>
                      <span className="badge badge-blue">{park.distanceKm} км</span>
                    </div>

                    <div className="park-stats">
                      <div>
                        <div className="park-price">₮{park.hourlyRate.toLocaleString()}</div>
                        <div className="muted">/ цаг</div>
                      </div>
                      <div>
                        <div className="stat">{park.availableSlots}</div>
                        <div className="muted">сул / {park.totalSlots}</div>
                      </div>
                    </div>

                    <div className="park-actions">
                      <span className="badge badge-green">Сонгох</span>
                      <span className="muted">Дэлгэрэнгүйг газрын зураг дээрээс шалгана уу.</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
