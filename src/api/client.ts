const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(message: string, code?: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; meta?: unknown }> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    const text = await response.text();
    return { data: text as unknown as T };
  }

  let json: any;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, undefined, response.status);
    }
    return { data: undefined as unknown as T };
  }

  if (!response.ok || json?.success === false) {
    const error = json?.error;
    throw new ApiError(
      error?.message || `Request failed with status ${response.status}`,
      error?.code,
      response.status,
      error?.details
    );
  }

  return { data: json.data, meta: json.meta };
}

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<{ data: T; meta?: any }> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.append(k, String(v));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return request<T>(url, { method: 'GET' });
  },

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const isFormData = body instanceof FormData;
    const res = await request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
    return res.data;
  },

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const res = await request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
    return res.data;
  },

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    const res = await request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
    return res.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const res = await request<T>(endpoint, { method: 'DELETE' });
    return res.data;
  }
};
