import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { instanceAxios } from '../../axios.ts';
import {MAX_LIMIT, PRE_PAGE} from "../constants.ts";
import {IProduct} from "../types.ts";

interface GetFilterProps {
    value: string,
    optionValue: string
}

interface FetchDataProps {
    offset: number
}
export default function useData() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [products, setProducts] = useState<IProduct[]>([])
    //const [productsTest, setProductsTest] = useState<IProduct[]>([])
    const [countProducts, setCountProducts] = useState(0)
    const [filterProducts, setFilterProducts] = useState<IProduct[]>([])
    const [countFilterProducts, setCountFilterProducts] = useState(0)
    const pageCount =(count: number) =>  Math.ceil(count / PRE_PAGE)

    const removeDuplicateItems = (array: never[]): any[] => Object.values(array.reduce(
        (acc: { [x: string | number]:  string | number}, val: { id: string | number }) => {
            acc[val.id] = Object.assign(acc[val.id] ?? {}, val)
            return acc
        }, {}
    ))

    const getIds = useCallback(async ({offset = 0}) => {
        const {data} = await instanceAxios.post('', {
            "action": "get_ids",
            "params": {offset, limit: MAX_LIMIT}
        })
        return data?.result
    }, [])

    const getItems = useCallback(async (ids: { result: IProduct[] }) => {
        const {data} = await instanceAxios.post('', {
            "action": "get_items",
            "params": {ids}
        })
        return data?.result
    }, [])

    // const getFields = useCallback(async ({optionValue, offset, limit}) => {
    //     const {data}= await instanceAxios.post('', {
    //         "action": "get_fields",
    //         //"params":  {"field": null, offset, limit}
    //     })
    //
    //     return data?.result
    //
    // }, [])

    const getFilter = useCallback(async ({value, optionValue}: GetFilterProps) => {
        try {
            setError(false)
            setLoadingFilter(true)
            const {data} = await instanceAxios.post('', {
                "action": "filter",
                "params":  {[optionValue]: optionValue === 'price' ? +value : value}
            })

            const items = await getItems(data?.result)
            const uniqueItems= removeDuplicateItems(items)
            setCountFilterProducts( uniqueItems?.length || 0)
            setFilterProducts(uniqueItems  || [])
            setLoadingFilter(false)

        } catch (e) {
            if (e instanceof AxiosError) {
                setError(true)
                setLoadingFilter(false)
                console.log(e.message)
                toast(e.message, {type: 'error'})
            } else {
                setError(true)
                setLoadingFilter(false)
                console.log(e)
            }
        }

    }, [getItems])

    const fetchData = useCallback(async ({offset = 0}: FetchDataProps) => {
        try {

            setError(false)
            setLoading(true)
            const items = await getItems(
                await getIds({offset})
            )

            const uniqueItems = removeDuplicateItems(items)
            setCountProducts(prevState => prevState + uniqueItems?.length)
            setProducts(prevState => [...prevState, ...uniqueItems])
            setLoading(false)

            return uniqueItems

        } catch (e) {
            if (e instanceof AxiosError) {
                setError(true)
                setLoading(false)
                console.log(e.message)
                    toast(e.message, {type: 'error'})
            } else {
                setError(true)
                setLoading(false)
                console.log(e)
            }
        }
    }, [getIds, getItems])

    return {
        fetchData,
        loading,
        loadingFilter,
        products,
        pageCount,
        countProducts,
        getFilter,
        filterProducts,
        setFilterProducts,
        countFilterProducts,
        error
    }
}
