export interface UserNamePass {
    nickname: string;
    password: string;
}

export interface UserUpdate {
    name: string,
    surname: string
}

export interface UserGetRepsonse {
    name: string,
    surname: string
}

export interface UserAdminInfo {
    name: string;
    surname: string;
    role: string;
    nickname: string;
    isBlocked?: boolean; // предполагаем поле для блокировки
}


export const isUserAdmin = (): boolean => {
    try {
        const userData = localStorage.getItem('user');
        if (!userData) return false;

        const parsed = JSON.parse(userData);
        return parsed.role === 'admin';
    } catch (error) {
        console.error("Ошибка при чтении роли пользователя из localStorage", error);
        return false;
    }
};
