import axios, { AxiosError } from "axios";
import { BaseInfoResponse } from "../types/analytics";
import { info } from "../utils/logger";
import { ApiErrorResponse } from "../types/response";
import { AuthService } from "./authService";
import { UserAdminInfo } from "../types/user";

const API_URL = process.env.REACT_APP_API_URL

export class AdminService {

    static async GetAllUsers(): Promise<UserAdminInfo[]> {
        try {
            const authHeaders = AuthService.getAuthHeader();

            const headers = {
                'Content-Type': 'application/json',
                ...authHeaders
            };

            const response = await axios.get<UserAdminInfo[]>(`${API_URL}/admin/users`, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;
            throw new Error(axiosError.response?.data?.message || 'ADMIN /// Get baseInfo of all users failed');
        }
    }
}