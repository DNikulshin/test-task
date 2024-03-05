import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { Loader } from './components/Loader.tsx';
import { Product } from './components/Product.tsx';
import {MAX_LIMIT, PRE_PAGE} from './constants.ts'
import useData from './hooks/useData.ts'
import 'react-toastify/dist/ReactToastify.css';

const options = [
    {value: '', label: 'No filter'},
    {value: 'brand', label: 'brand'},
    {value: 'product', label: 'product'},
    {value: 'price', label: 'price'}
];

function App() {
    const [offset, setOffset] = useState(0)
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const {fetchData, pageCount, countProducts, products,loading, loadingFilter ,getFilter, filterProducts, countFilterProducts} = useData()
    const [offsetPaginate, setOffsetPaginate] = useState(0)
    const endOffsetPaginate = offsetPaginate + PRE_PAGE
    const [inputValue, setInputValue] = useState('')
    const [debounceValue] = useDebounce(inputValue, 500)

    const handlePageClick = useCallback((event: { selected: number }) => {
        const newOffset = (event.selected * PRE_PAGE) % countProducts
        setOffsetPaginate(newOffset)
    }, [countProducts])

    const handlePageClickMore = useCallback(async () => {
        setOffset(MAX_LIMIT)
        await fetchData({offset})

    }, [fetchData, offset])

    const filterData = useCallback( async () => {
        if(debounceValue) {
        await getFilter({value: debounceValue, optionValue: selectedOption.value})
        }

    }, [debounceValue, getFilter, selectedOption.value])

    useEffect(() => {
        fetchData({offset})
    }, [fetchData, offset])

    useEffect(() => {
        filterData()
    }, [filterData])

    // if(error) {
    //     return (
    //         <div>
    //             error
    //             <button
    //                 onClick={() => {
    //                     window.location.reload()
    //                 }}
    //             >Reload Page</button>
    //         </div>
    //     )
    // }

    if (loading) {
        return (
            <Loader/>
        )
    }

    // console.log('RENDER+++++++++++++++++++++++++')
    // console.log(error)
    // console.log('==============start===============')
    // console.log(offset, 'offset')
    // console.log(countProducts, 'countProducts')
    // console.log(products, 'products')
    // console.log(debounceValue, 'debounceValue')
    // console.log(selectedOption.value, 'selectedOption')
    // console.log(inputValue, 'inputValue')
    // console.log(filterProducts, 'filterProducts')
    // console.log('==============end===============')
    // console.log(filterProducts && products && debounceValue, 'WWWWWWW')
    return (
        <div className="app">
            <ToastContainer
                position="top-center"
            />
            <div className="container">

                <div className="products">
                    <div className="header">

                        <div className="title">

                            <h1>
                                Product list
                            </h1>
                            <button onClick={ () =>
                                window.location.reload()
                            }>
                                Initial state
                            </button>
                        </div>

                        <div className="products-filter">
                            <Select
                                defaultValue={selectedOption}
                                onChange={setSelectedOption}
                                isMulti={false}
                                isSearchable={false}
                                options={options}
                                name="select"
                                placeholder="Выберите значение..."
                            />
                            {selectedOption.value && <div>
                                    <input type="search"
                                           placeholder="Enter value..."
                                           onChange={ (e) => {
                                                   setInputValue(e.target.value)

                                           }
                                    }
                                    />

                            </div>
                            }
                            {loading ? <div>Loading...</div>
                                : countProducts > 0 &&
                                <strong>Count: <span className="products-count">{countProducts}</span></strong>}

                            {loadingFilter ? <div>LoadingFilter...</div>
                                : countFilterProducts > 0
                                && debounceValue
                                && <strong>Filter count: <span>{countFilterProducts}</span></strong>}
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
                    </div>

                    <div className="products-content">
                    {(products || !filterProducts ? products : filterProducts)
                            .map((item, idx) => <Product item={item} idx={idx} key={item.id}/>)
                            .slice(offsetPaginate, endOffsetPaginate)
                    }

                        {!countFilterProducts && <div className="not-found">Not Found</div>}
                </div>
                </div>


                {!selectedOption.value && <div className="product-more">

                    <button
                        onClick={handlePageClickMore}
                    >
                        Load more...
                    </button>
                </div>}

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
                    pageRangeDisplayed={2}
                    pageCount={pageCount(countProducts)}
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
