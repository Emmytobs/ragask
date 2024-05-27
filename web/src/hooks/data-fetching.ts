import useSWR from 'swr'
import useAxios from './useAxios'



function useDataFetch(url: string) {
    const { axios } = useAxios()

    const fetcher = (url: string) => axios?.get(url).then(res => res.data)

    const { data, error, isLoading } = useSWR(url, fetcher)

    return { data, error, isLoading }
}

export { useDataFetch }