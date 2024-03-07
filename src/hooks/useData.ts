import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { instanceAxios } from '../../axios.ts';
import { MAX_LIMIT } from '../constants.ts';
import { IProduct } from '../types.ts';
import { removeDuplicateItems } from '../utils/removeDuplicateItems.tsx';
// import {dataStore} from '../store/dataStore.tsx'

interface GetFilterProps {
    value: string,
    optionValue: string
}

export interface FetchDataProps {
    offset: number
}

export default function useData() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorFilter, setErrorFilter] = useState(false)
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [allCountIdsProducts, setAllCountIdProducts] = useState(0)
    const [products, setProducts] = useState<IProduct[]>([])
    const [countProducts, setCountProducts] = useState(0)
    const [filterProducts, setFilterProducts] = useState<IProduct[]>([])
    const [countFilterProducts, setCountFilterProducts] = useState(0)
    const [offset, setOffset] = useState(0)

    const getAllIdsProducts = useCallback(async () => {
        const {data} = await instanceAxios.post('', {
            'action': 'get_ids'
        })
        setAllCountIdProducts([...new Set(data?.result)].length || 0)
    }, [])

    const getIds = useCallback(async ({offset = 0}) => {
        const {data} = await instanceAxios.post('', {
            'action': 'get_ids',
            'params': {offset, limit: MAX_LIMIT}
        })
        return [...new Set(data?.result)] as IProduct[]
    }, [])

    const getItems = useCallback(async (ids: IProduct[]) => {
        const {data} = await instanceAxios.post('', {
            'action': 'get_items',
            'params': {ids}
        })
        return data?.result
    }, [])

    const getFilter = useCallback(async ({value, optionValue}: GetFilterProps) => {
        try {
            setErrorFilter(false)
            setLoadingFilter(true)
            const {data} = await instanceAxios.post('', {
                'action': 'filter',
                'params': {[optionValue]: optionValue === 'price' ? +value : value}
            })
            const items = await getItems(data?.result)
            const uniqueItems = removeDuplicateItems(items)
            setCountFilterProducts(countProducts || 0)
            setFilterProducts(products || [])
            setCountFilterProducts(uniqueItems?.length || 0)
            setFilterProducts(uniqueItems as IProduct[] || [])
            setLoadingFilter(false)

        } catch (e) {
            if (e instanceof AxiosError) {
                setErrorFilter(true)
                setLoadingFilter(false)
                console.log(e.message)
                toast(e.message, {type: 'error'})
            } else {
                setErrorFilter(true)
                setLoadingFilter(false)
                console.log(e)
            }
        }

    }, [countProducts, errorFilter, getItems, products])


    const fetchData = useCallback(async ({offset = 0}: FetchDataProps) => {
        try {
            if(allCountIdsProducts < countProducts) return
            setError(false)
            setLoading(true)
            const ids = await getIds({offset})
            const items = await getItems(ids)
            const uniqueItems = removeDuplicateItems(items)
            setCountProducts(prevState => prevState + uniqueItems?.length)
            setProducts(prevState => [...prevState, ...uniqueItems as IProduct[]])
            setOffset((prevState: number) => prevState + MAX_LIMIT)
            setLoading(false)

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
    }, [allCountIdsProducts, countProducts, getIds, getItems])

    useEffect(() => {
        fetchData({offset})
    }, [])

    useEffect(() => {
        getAllIdsProducts()
    }, [])

    return {
        fetchData,
        loading,
        loadingFilter,
        products,
        countProducts,
        getFilter,
        filterProducts,
        setFilterProducts,
        countFilterProducts,
        error,
        errorFilter,
        setCountFilterProducts,
        getAllIdsProducts,
        allCountIdsProducts,
        offset
    }
}
