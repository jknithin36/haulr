const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value: string) {
  return emailPattern.test(value.trim());
}

/** The message to show under an email field, or null when it's valid. */
export function emailError(value: string) {
  if (!value.trim()) return "Enter your email.";
  if (!isEmail(value)) return "Enter a valid email, like name@example.com.";
  return null;
}
