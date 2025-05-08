import { useState } from "react";
import { UserGetRepsonse } from "../types/user";
import { info } from "../utils/logger";

//TODO: Видимо, надо выпилить. Инфу по пользователю решил хранить в localStore
export const useUserStore = () => {
    const [user, setUser] = useState<UserGetRepsonse | null>(null);

    const getUser = () => {
        info("GET_USER_HOOK ", user)
        return user
    }

    return {
        getUser,
        setUser
    }
}