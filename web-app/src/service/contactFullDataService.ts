import axios, { AxiosError } from "axios";
import { GraphData,  } from "../types/graph";
import { Edge } from '../types/edge'
import { Node } from '../types/node'
import { AddContactFullDataRequest, AddContactNodeResponse, ChangeContactFullDataRequest, ChangeContactFullDataResponse, DeleteContactFullDataRequest, DeleteContactFullDataResponse } from "../types/contactFullData";
import { info } from "../utils/logger";

const API_URL = process.env.REACT_APP_API_URL

interface GraphResponse {
    Status: string,
    Message: string,
    ID: string,
    UserID: string,
    Name: string,
    CreatedAt: string,
    Nodes: Node[],
    Edges: Edge[]
}

interface ApiError {
    message: string;
    // Дополнительные поля ошибки, если они есть в вашем API
}

interface AuthHeaders {
    Authorization: string
}

export class ContactFullDataService {

    static setAuthHeaders(): any {
        const token = localStorage.getItem('token');
        info("token ", token)

        const headers = { Authorization: `Bearer ${token}` };

        return headers

    }

    static async AddContact(addContact: AddContactFullDataRequest): Promise<AddContactNodeResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.post<AddContactNodeResponse>(`${API_URL}contact/`, addContact, { headers });

            info("Add Contact\n", response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Post contact failed');
        }
    }

    static async ChangeContact(changeContact: ChangeContactFullDataRequest): Promise<ChangeContactFullDataResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.put<ChangeContactFullDataResponse>(`${API_URL}contact/`, changeContact, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Put contact failed');
        }
    }

    static async DeleteContact(deleteContact: DeleteContactFullDataRequest): Promise<DeleteContactFullDataResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.delete<DeleteContactFullDataResponse>(`${API_URL}contact/`, { 
                headers: headers,
                data: deleteContact
             });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Delete contact failed');
        }
    }
}