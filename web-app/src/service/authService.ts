import axios, { AxiosError } from 'axios';
import { info } from '../utils/logger'
import { ApiErrorResponse, AuthResponse } from '../types/response';
import { UserNamePass } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL

export const AuthService = {
  async login(user: UserNamePass): Promise<AuthResponse> {
    try {
        info("AuthService: ", user)
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, user);
        info(response)
        return response.data;
      } catch (error) {
        console.error(error)
        const axiosError = error as AxiosError<ApiErrorResponse>;
        throw new Error(axiosError.response?.data?.message || 'Login failed');
      }
  },

  async register(user: UserNamePass): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, user);
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