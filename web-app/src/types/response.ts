export interface BaseResponse {
    status: number,
    message: string
}
export interface ApiErrorResponse {
    message: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        nickname: string;
    };
}
