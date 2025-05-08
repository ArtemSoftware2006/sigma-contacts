import axios, { AxiosError } from "axios";
import { BaseInfoResponse } from "../types/analytics";
import { info } from "../utils/logger";
import { ApiErrorResponse } from "../types/response";
import { AuthService } from "./authService";

const API_URL = process.env.REACT_APP_API_URL

export class AnalyticsService {

    static async GetBaseInfo(): Promise<BaseInfoResponse> {
        try {
            const authHeaders = AuthService.getAuthHeader();

            const headers = {
                'Content-Type': 'application/json',
                ...authHeaders
            };

            const response = await axios.get<BaseInfoResponse>(`${API_URL}/analytics/baseInfo`, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;
            throw new Error(axiosError.response?.data?.message || 'Get baseInfo failed');
        }
    }
}