import {useCallback, useEffect, useState} from 'react'
import ReactPaginate from "react-paginate"
import useData from './hooks/useData.ts'
import {Product} from "./components/Product.tsx";
import {Loader} from "./components/Loader.tsx";
import {useDebounce} from "use-debounce";


function App() {
    const limit = 100
    const [offset, setOffset] = useState(0)
    const {fetchData, pageCount, countProducts, prePageItems, products, loading,fetchDataFilter} = useData()
    const [offsetPaginate, setOffsetPaginate] = useState(0)
    const endOffsetPaginate = offsetPaginate + prePageItems
    const [text, setText] = useState('')
    const [value] = useDebounce(text, 500)

    useEffect(() => {
        fetchData({offset, limit})
    }, [fetchData])
    // useEffect(() => {
    //     fetchDataFilter(+value)
    // }, [fetchDataFilter])

    const handlePageClick = useCallback((event: { selected: number }) => {
        const newOffset = (event.selected * prePageItems) % countProducts
        setOffsetPaginate(newOffset)
    }, [offsetPaginate, countProducts])

    const handlePageClickMore = useCallback(async () => {
        setOffset(prevState => prevState + limit)
        console.log(offset, 'handlePageClickMore newOffset')
        await fetchData({offset, limit: limit})

    }, [offset, products])





    if (loading) {
        return (
           <Loader/>
        )
    }
    console.log(countProducts, 'countProducts')
    console.log(products, 'products')
    console.log(+value)
    return (
        <div className="app">
            <div className="container">
                <h1>Список товаров</h1>

                <div className="products">
                    <div className="products-filter">
                      <label>
                          Filter:{' '}
                        <input type="text" placeholder="Введите значение..."
                               //defaultValue={text}
                               onChange={ (e) => {
                                   if(!e.target.value) return  fetchData({offset, limit})
                                 setText(e.target.value)
                                   fetchDataFilter(+value)
                               }}
                        />
                      </label>
                    </div>
                    <div className="products-header">
                        <span>
                            id
                        </span>
                        <span>
                            brand
                        </span>
                        <span>
                           product
                        </span>
                        <span>
                           price
                        </span>
                    </div>
                    {products && products.map((item, idx) => <Product item={item} idx={idx} key={item.id}/>).slice(offsetPaginate, endOffsetPaginate)}
                </div>



                <div className="product-more">
                    {/*<div>offset {offset && offset}</div>*/}
                    {/*<div>offsetPaginate {offsetPaginate && offsetPaginate}</div>*/}
                    <button
                        onClick={handlePageClickMore}
                    >
                        Показать больше товаров
                    </button>
                </div>

                <ReactPaginate
                    className="pagination"
                    breakLabel="..."
                    nextLabel={
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-arrow-right-circle" viewBox="0 0 16 16"

                        >
                            <path fillRule="evenodd"
                                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                        </svg>
                    }
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={15}
                    pageCount={pageCount}
                    previousLabel={
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
                        </svg>
                    }
                    renderOnZeroPageCount={null}
                    activeClassName="active-page"
                />

            </div>

        </div>
    )
}

export default App
