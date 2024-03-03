import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { instanceAxios } from '../../axios.ts';


export default function useData() {
    const prePageItems = 50
    const [loading, setLoading] = useState(false)
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [products, setProducts] = useState<any []>([])
    const [countProducts, setCountProducts] = useState([].length)
    const [filterProducts, setFilterProducts] = useState<any []>([])
    const [countFilterProducts, setCountFilterProducts] = useState([].length)

    const pageCount =(count: number) =>  Math.ceil(count / prePageItems)

    const removeDuplicateItems = (array: any[]) => Object.values(array.reduce(
        (acc: { [x: string]: any }, val: { id: string | number }) => {
            acc[val.id] = Object.assign(acc[val.id] ?? {}, val)
            return acc
        }, {}
    ))

    const getIds = useCallback(async ({offset = 0, limit = 100}) => {
        const {data} = await instanceAxios.post('', {
            "action": "get_ids",
            "params": {offset, limit}
        })
        return data?.result
    }, [])

    const getItems = useCallback(async (ids: { result: any; }) => {
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

    const getFilter = useCallback(async ({value, optionValue}) => {
        try {
            setLoadingFilter(true)
            const {data} = await instanceAxios.post('', {
                "action": "filter",
                "params":  {[optionValue]: optionValue === 'price' ? +value : value}
            })
            const items = await getItems(
                data?.result
            )
            const uniqueItems = removeDuplicateItems(items)
            setCountFilterProducts(uniqueItems?.length || [].length)
            setFilterProducts(uniqueItems || [])
            setLoadingFilter(false)

        } catch (e) {
            setLoadingFilter(false)
            if (e instanceof AxiosError) {
                console.log(e.message)
                toast(e.message, {type: 'error'})
            } else {
                setLoadingFilter(false)
                console.log(e)
            }
        }

    }, [getItems])

    const fetchData = useCallback(async ({offset = 0, limit = 100}) => {
        try {
            setLoading(true)
            const items = await getItems(
                await getIds({offset, limit})
            )

            const uniqueItems = removeDuplicateItems(items)
            setCountProducts(uniqueItems?.length || []?.length)
            setProducts(uniqueItems || [])
            setLoading(false)

            return uniqueItems

        } catch (e) {
            setLoading(false)
            if (e instanceof AxiosError) {
                console.log(e.message)
                    toast(e.message, {type: 'error'})
            } else {
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
        prePageItems,
        getFilter,
        filterProducts,
        setFilterProducts,
        countFilterProducts
    }
}
