export function validateEmailOrPhone(value) {
  if (!value) return false;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{8}$/;
  return emailPattern.test(value) || phonePattern.test(value);
}

export function validateStrongPassword(value) {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value);
}
