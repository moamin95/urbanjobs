const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiClient = {
  get: async (endpoint: string, params?: Record<string, any>) => {
    const url = new URL(endpoint, API_URL);
    if (params) {
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );
    }
    const response = await fetch(url.toString());
    return response.json();
  }
};