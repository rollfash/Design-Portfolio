export function getAdminToken(): string | null {
  return sessionStorage.getItem("_admin_token");
}

export function adminHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: Record<string, string> = {};
  if (token) headers["x-admin-token"] = token;
  return headers;
}
