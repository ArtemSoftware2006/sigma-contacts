import axios, { AxiosError } from 'axios';
import { info } from '../utils/logger'
import { ApiErrorResponse, BaseResponse } from '../types/response';
import { AuthService } from './authService';
import { UserGetRepsonse, UserUpdate } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL

export const UserService = {
  async update(user: UserUpdate): Promise<BaseResponse> {
    try {
      const headers = AuthService.getAuthHeader();

      const response = await axios.put<BaseResponse>(`${API_URL}/users/`, user, { headers });
      info(response)
      return response.data;
    } catch (error) {
      console.error(error)
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Update user is failed');
    }
  },

  async getMe(): Promise<UserUpdate> {
    try {
      const headers = AuthService.getAuthHeader();

      const response = await axios.get<UserGetRepsonse>(`${API_URL}/users/me`, { headers });
      info(response)
      return response.data;
    } catch (error) {
      console.error(error)
      const axiosError = error as AxiosError<ApiErrorResponse>;
      throw new Error(axiosError.response?.data?.message || 'Update user is failed');
    }
  },
};