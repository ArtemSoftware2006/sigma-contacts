import axios, { AxiosError } from "axios";
import { GraphData,  } from "../types/graph";
import { Edge } from '../types/edge'
import { Node } from '../types/node'
import { AddContactRequest, AddContactNodeResponse, ChangeContactRequest, ChangeContactResponse, DeleteContactRequest, DeleteContactResponse } from "../types/contact";
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

export class ContactService {

    static setAuthHeaders(): any {
        const token = localStorage.getItem('token');
        info("token ", token)

        const headers = { Authorization: `Bearer ${token}` };

        return headers

    }

    static async AddContact(addContact: AddContactRequest): Promise<AddContactNodeResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.post<AddContactNodeResponse>(`${API_URL}contact/`, addContact, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Post contact failed');
        }
    }

    static async ChangeContact(changeContact: ChangeContactRequest): Promise<ChangeContactResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.put<ChangeContactResponse>(`${API_URL}contact/`, changeContact, { headers });

            info(response)

            return response.data
        } catch (error) {
            console.error(error)
            const axiosError = error as AxiosError<ApiError>;
            throw new Error(axiosError.response?.data?.message || 'Put contact failed');
        }
    }

    static async DeleteContact(deleteContact: DeleteContactRequest): Promise<DeleteContactResponse | Error> {
        try {
            const authHeaders = this.setAuthHeaders();

            const headers = {
                'Content-Type': 'application/json',  // Явно указываем тип контента
                ...authHeaders
            };

            const response = await axios.delete<DeleteContactResponse>(`${API_URL}contact/`, { 
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