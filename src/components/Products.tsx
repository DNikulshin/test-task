import { useCallback, useState } from 'react'
import { FetchDataProps } from '../hooks/useData.ts'
import { PRE_PAGE } from '../constants.ts'
import { IProduct } from '../types.ts';
import { Pagination } from './Pagination.tsx'
import { MemoizedProduct } from './Product.tsx'



interface ProductsProps{
    filterProducts: IProduct[]
    products: IProduct[]
    offset: number
    countFilterProducts: number
    pageCount: number
    countProducts: number
    loading: boolean
    error: boolean
    selectedOption: {
        value: string
        selected?: boolean
    },
    allCountIdsProducts: number
    handlePageClickMore: ({offset}: FetchDataProps) => Promise<void>
}

export const Products = ({
    filterProducts,
    products,
    offset,
    countFilterProducts,
    pageCount,
    countProducts,
    loading,
    error,
    selectedOption,
    allCountIdsProducts,
    handlePageClickMore
}: ProductsProps) => {

    const [offsetPaginate, setOffsetPaginate] = useState(0)
    const endOffsetPaginate = offsetPaginate + PRE_PAGE
    const handlePaginate = useCallback((event: { selected: number }) => {
        const newOffset = (event.selected * PRE_PAGE) % countProducts
        setOffsetPaginate(newOffset)
    }, [countProducts, setOffsetPaginate])

    console.log(allCountIdsProducts <= countProducts , 'allCountIdsProducts < countProducts==========================================')
    return (
        <main className="products-content">
            <>
                {filterProducts && countFilterProducts
                    ? filterProducts
                        .map((item, idx) =>
                            <MemoizedProduct item={item} idx={idx} key={item.id}/>)
                        .slice(offsetPaginate, endOffsetPaginate)
                    : products && products
                    .map((item, idx) =>
                        <MemoizedProduct item={item} idx={idx} key={item.id}/>)
                    .slice(offsetPaginate, endOffsetPaginate)
                }
            </>

            {!selectedOption?.selected && !(allCountIdsProducts < countProducts) &&

                    <div className="product-more">
                        <button
                            disabled={loading || error}
                            onClick={() => handlePageClickMore({offset})}
                        >
                            Load more...
                        </button>
                    </div>
            }

            {error &&
                <button
                    disabled={loading || !error}
                    className="error-request error-data"
                    onClick={() => handlePageClickMore({offset})}
            >
                Error: Repeat request
            </button>
            }
            <Pagination
                pageCount={pageCount}
                handlePaginate={handlePaginate}
            />
        </main>
    )
}
