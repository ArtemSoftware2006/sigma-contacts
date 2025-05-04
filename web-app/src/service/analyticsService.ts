import axios, { AxiosError } from "axios";
import { BaseInfoResponse } from "../types/analytics";
import { info } from "../utils/logger";

const API_URL = process.env.REACT_APP_API_URL

interface ApiError {
    message: string;
    // Дополнительные поля ошибки, если они есть в вашем API
}

interface AuthHeaders {
    Authorization: string
}

export class AnalyticsService {

    static setAuthHeaders(): any {
        const token = localStorage.getItem('token');
        info("token ", token)

        const headers = { Authorization: `Bearer ${token}` };

        return headers

    }

    static async GetBaseInfo(): Promise<BaseInfoResponse> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',
                ...authHeaders
            };

            const response = await axios.get<BaseInfoResponse>(`${API_URL}analytics/baseInfo`, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Get baseInfo failed');
        }
    }
}