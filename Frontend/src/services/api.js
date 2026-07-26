const API_BASE = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : "http://localhost:3000";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError(error?.message || "Unable to reach the server. Please check that the backend is running.", 0);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("foodiehub:unauthorized"));
    }
    throw new ApiError(data.message || "Request failed", response.status);
  }

  return data;
}

export const authApi = {
  register: (payload) => apiRequest("/api/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => apiRequest("/api/auth/login", { method: "POST", body: payload, auth: false }),
  google: (payload) => apiRequest("/api/auth/google", { method: "POST", body: payload, auth: false }),
};

export const foodApi = {
  list: () => apiRequest("/api/food", { auth: false }),
  get: (id) => apiRequest(`/api/food/${id}`, { auth: false }),
  add: (payload) => apiRequest("/api/food/add", { method: "POST", body: payload }),
  seed: () => apiRequest("/api/food/seed", { method: "POST" }),
  update: (id, payload) => apiRequest(`/api/food/${id}`, { method: "PUT", body: payload }),
  remove: (id) => apiRequest(`/api/food/${id}`, { method: "DELETE" }),
};

export const orderApi = {
  place: (payload) => apiRequest("/api/order/place", { method: "POST", body: payload }),
  mine: () => apiRequest("/api/order/my-orders"),
  all: () => apiRequest("/api/order/all-orders"),
  updateStatus: (id, status) =>
    apiRequest(`/api/order/status/${id}`, { method: "PUT", body: { status } }),
};
