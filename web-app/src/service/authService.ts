import axios, { AxiosError } from 'axios';

//TODO: Use ENV variables
const API_URL = 'http://localhost:8080/api/auth';

interface User {
  nickname: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

interface ApiError {
    message: string;
    // Дополнительные поля ошибки, если они есть в вашем API
  }
  

export const AuthService = {
  async login(user: User): Promise<AuthResponse> {
    try {
        console.log("AuthService: ", user)
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, user);
        console.log(response)
        return response.data;
      } catch (error) {
        console.error(error)
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(axiosError.response?.data?.message || 'Login failed');
      }
  },

  async register(user: User): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, user);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/logout`, null, {
      headers: this.getAuthHeader()
    });
  },

  getAuthHeader(): { Authorization: string } {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }
};