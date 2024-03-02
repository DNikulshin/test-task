import {useCallback, useState} from "react";
import {instanceAxios} from "../../axios.ts";

export default function useData() {
    const prePageItems = 50
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<any []>([])
    const [countProducts, setCountProducts] = useState([].length)
    const pageCount = Math.ceil(countProducts / prePageItems)

    const removeDuplicateItems = (array: any[]) => Object.values(array.reduce(
        (acc: { [x: string]: any }, val: { id: string | number }) => {
            acc[val.id] = Object.assign(acc[val.id] ?? {}, val)
            return acc
        }, {}
    ))

    const getItems = useCallback(async (ids: { result: any; }) => {
        const {data} = await instanceAxios.post('', {
            "action": "get_items",
            "params": {ids}
        })
        return data?.result
    }, [])

    const getIds = useCallback(async ({offset = 0, limit = 100}) => {
        const {data} = await instanceAxios.post('', {
            "action": "get_ids",
            "params": {offset, limit}
        })
        return data?.result
    }, [])


    const fetchData = useCallback(async ({offset = 0, limit = 100}) => {
        try {
            setLoading(true)
            const items = await getItems(await getIds({offset, limit}))

            const uniqueItems = removeDuplicateItems(items)
            // const uniqueItems = Array.from(new Set(items?.data?.result.map((obj: { id: any; }) => obj.id)))
            //     .map(id => {
            //         return items?.data?.result.find((obj: { id: unknown; }) => obj.id === id);
            //     })
            // console.log(items)


            setCountProducts(uniqueItems?.length || []?.length)
            setProducts(uniqueItems || [])
            setLoading(false)

        } catch (e) {
            setLoading(false)
            console.log(e)
        }
    }, [])

    const fetchDataFilter = useCallback(async (value: number) => {
        try {
            // setLoading(true)
            const {data} = await instanceAxios.post('', {
                "action": "filter",
                "params": {"price": value}
            })
            console.log(data)
            const items = await getItems(data.result)
           // const uniqueItems = removeDuplicateItems(items)
            setCountProducts(items?.length || []?.length)
            setProducts(items || [])
            //setLoading(false)

        } catch (e) {
            //setLoading(false)
            console.log(e)
        }
    }, [])

    return {
        fetchData,
        loading,
        products,
        pageCount,
        countProducts,
        prePageItems,
        fetchDataFilter
    }
}
