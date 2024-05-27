
import { ExtendedSession } from "@/session";
import axiosDefault from "axios";
import { useSession } from "next-auth/react";


const useAxios = () => {
    const {data: session} = useSession() as {data: ExtendedSession}
    const host = process.env.NEXT_PUBLIC_BASE_URL

    const axios = axiosDefault.create({
        baseURL: `${host}/api/v1`,
        timeout: 5000,
        headers: {
            'Authorization': `Bearer ${session?.jwt}`
        }
    });;
    return { axios }
}

export default useAxios;
