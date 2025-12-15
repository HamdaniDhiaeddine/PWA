const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed:  ${endpoint}`, error);
      throw error;
    }
  }

  // ========== ANIMALS ==========

  async createAnimal(data: any) {
    return this.request('/api/animals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnimals() {
    return this.request('/api/animals');
  }

  async getAnimal(id: string) {
    return this.request(`/api/animals/${id}`);
  }

  async updateAnimal(id: string, data: any) {
    return this.request(`/api/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnimal(id: string) {
    return this.request(`/api/animals/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== CARE RECORDS ==========

  async createCareRecord(data:  any) {
    return this.request('/api/care', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCareRecords(animalId?: string) {
    const query = animalId ? `?animalId=${animalId}` : '';
    return this.request(`/api/care${query}`);
  }

  async getCareRecord(id: string) {
    return this.request(`/api/care/${id}`);
  }

  async updateCareRecord(id: string, data: any) {
    return this.request(`/api/care/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareRecord(id: string) {
    return this.request(`/api/care/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== AUTHENTICATION ==========

  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON. stringify({ email, password, name }),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();