const API_BASE_URL =  'http://localhost:5000';

export interface LoginResponse {
  message: string;
  token:  string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Animal {
  _id: string;
  userId: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  weight: number;
  color: string;
  medicalHistory: string;
  vaccinations: string[];
  lastCheckup?:  string;
  createdAt: string;
  updatedAt: string;
}

export interface CareRecord {
  _id:  string;
  animalId:  string;
  userId: string;
  careType: 'feeding' | 'grooming' | 'exercise' | 'medication' | 'veterinary';
  date: string;
  notes: string;
  nextDue?:  string;
  completedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiService {
  private baseURL:  string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers:  any = {
      'Content-Type': 'application/json',
      ... options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`Request failed:  ${endpoint}`, error);
      throw error;
    }
  }

  // ========== AUTHENTICATION ==========

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async login(email: string, password:  string): Promise<LoginResponse> {
    const response = await this. request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage. setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getStoredUser() {
    const user = localStorage. getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ========== ANIMALS ==========

  async createAnimal(data:  Omit<Animal, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Animal> {
    return this.request('/api/animals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnimals(): Promise<Animal[]> {
    return this.request('/api/animals');
  }

  async getAnimal(id: string): Promise<Animal> {
    return this.request(`/api/animals/${id}`);
  }

  async updateAnimal(id: string, data: Partial<Animal>): Promise<Animal> {
    return this.request(`/api/animals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAnimal(id: string): Promise<{ message: string }> {
    return this.request(`/api/animals/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== CARE RECORDS ==========

  async createCareRecord(data:  Omit<CareRecord, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CareRecord> {
    return this.request('/api/care', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCareRecords(animalId?: string): Promise<CareRecord[]> {
    const query = animalId ?  `?animalId=${animalId}` : '';
    return this.request(`/api/care${query}`);
  }

  async getCareRecord(id:  string): Promise<CareRecord> {
    return this.request(`/api/care/${id}`);
  }

  async updateCareRecord(id: string, data: Partial<CareRecord>): Promise<CareRecord> {
    return this.request(`/api/care/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCareRecord(id: string): Promise<{ message: string }> {
    return this.request(`/api/care/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();