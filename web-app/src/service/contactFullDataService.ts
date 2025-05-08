import axios, { AxiosError } from "axios";
import { AddContactFullDataRequest, AddContactNodeResponse, ChangeContactFullDataRequest, ChangeContactFullDataResponse, DeleteContactFullDataRequest, DeleteContactFullDataResponse } from "../types/contactFullData";
import { info } from "../utils/logger";
import { ApiErrorResponse } from "../types/response";
import { AuthService } from "./authService";

const API_URL = process.env.REACT_APP_API_URL

export class ContactFullDataService {

    static async AddContact(addContact: AddContactFullDataRequest): Promise<AddContactNodeResponse | Error> {
        try {
            const authHeaders = AuthService.getAuthHeader();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.post<AddContactNodeResponse>(`${API_URL}/contact/`, addContact, { headers });

            info("Add Contact\n", response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;
            throw new Error(axiosError.response?.data?.message || 'Post contact failed');
        }
    }

    static async ChangeContact(changeContact: ChangeContactFullDataRequest): Promise<ChangeContactFullDataResponse | Error> {
        try {
            const authHeaders = AuthService.getAuthHeader();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.put<ChangeContactFullDataResponse>(`${API_URL}/contact/`, changeContact, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;
            throw new Error(axiosError.response?.data?.message || 'Put contact failed');
        }
    }

    static async DeleteContact(deleteContact: DeleteContactFullDataRequest): Promise<DeleteContactFullDataResponse | Error> {
        try {
            const authHeaders = AuthService.getAuthHeader();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.delete<DeleteContactFullDataResponse>(`${API_URL}/contact/`, { 
                headers: headers,
                data: deleteContact
             });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiErrorResponse>;
            throw new Error(axiosError.response?.data?.message || 'Delete contact failed');
        }
    }
}