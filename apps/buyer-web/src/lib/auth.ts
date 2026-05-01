const TOKEN_COOKIE = 'ordino_buyer_token';
const USER_COOKIE = 'ordino_buyer_user';

export function setAuth(token: string, user: unknown) {
  document.cookie = `${TOKEN_COOKIE}=${token}; path=/; max-age=86400; SameSite=Strict`;
  document.cookie = `${USER_COOKIE}=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=86400; SameSite=Strict`;
}

export function clearAuth() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${USER_COOKIE}=; path=/; max-age=0`;
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? match[1] : null;
}

export function getUser(): { email: string; role: string; business?: { storeName: string } } | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${USER_COOKIE}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}
