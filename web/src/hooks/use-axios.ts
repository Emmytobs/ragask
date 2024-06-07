import axiosDefault from "axios";
import { useSession } from "next-auth/react";

const useAxios = () => {
    const { data: session } = useSession() ;
    if (session) {
        const host = process.env.NEXT_PUBLIC_BASE_URL;

        const axios = axiosDefault.create({
            baseURL: `${host}/api/v1`,
            timeout: 20000,
            headers: {
                'Authorization': `Bearer ${session?.jwt}`
            }
        });

        return { axios };
    }
    return { axios: null }
}

export default useAxios 