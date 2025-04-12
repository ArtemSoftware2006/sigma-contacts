import axios, { AxiosError } from 'axios';
import { info } from '../utils/logger'

const API_URL = process.env.REACT_APP_API_URL

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
  }
  

export const AuthService = {
  async login(user: User): Promise<AuthResponse> {
    try {
        info("AuthService: ", user)
        const response = await axios.post<AuthResponse>(`${API_URL}auth/login`, user);
        info(response)
        return response.data;
      } catch (error) {
        console.error(error)
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(axiosError.response?.data?.message || 'Login failed');
      }
  },

  async register(user: User): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}auth/register`, user);
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