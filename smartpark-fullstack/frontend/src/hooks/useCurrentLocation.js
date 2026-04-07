import { useEffect, useState } from 'react';

const fallback = {
  lat: Number(import.meta.env.VITE_DEFAULT_LAT || 47.918873),
  lng: Number(import.meta.env.VITE_DEFAULT_LNG || 106.917583),
};

export function useCurrentLocation() {
  const [location, setLocation] = useState(fallback);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation дэмжигдэхгүй байна. Анхны байршлыг ашиглалаа.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLocating(false);
      },
      () => {
        setLocationError('Таны байршлыг авч чадсангүй. Анхны байршлыг ашиглалаа.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  return { location, locationError, isLocating };
}
