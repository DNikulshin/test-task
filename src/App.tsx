import { useCallback, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import Select from 'react-select';
import { ToastContainer } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { Loader } from './components/Loader.tsx';
import { Product } from './components/Product.tsx';
import { MAX_LIMIT } from './constants.ts'
import useData from './hooks/useData.ts'
import 'react-toastify/dist/ReactToastify.css';

const options = [
    {value: '', label: 'No filter'},
    {value: 'brand', label: 'brand'},
    {value: 'product', label: 'product'},
    {value: 'price', label: 'price'}
];

function App() {

    const [limit, setLimit] = useState(100)
    const [offset, setOffset] = useState(0)
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const {fetchData, pageCount, countProducts, prePageItems, products,loading, loadingFilter ,getFilter, setFilterProducts, filterProducts, countFilterProducts} = useData()
    const [offsetPaginate, setOffsetPaginate] = useState(0)
    const endOffsetPaginate = offsetPaginate + prePageItems
    const [inputValue, setInputValue] = useState('')
    const [debounceValue] = useDebounce(inputValue, 500)



    const handlePageClick = useCallback((event: { selected: number }) => {
        const newOffset = (event.selected * prePageItems) % countProducts
        setOffsetPaginate(newOffset)
    }, [prePageItems, countProducts])

    const handlePageClickMore = useCallback(async () => {
        setLimit(prevState => prevState + MAX_LIMIT)
        setOffset(prevState => prevState + MAX_LIMIT)
        await fetchData({offset, limit})

    }, [fetchData, limit, offset])

    const filterData = useCallback( async () => {
        if(debounceValue) {
         await getFilter({value: debounceValue, optionValue: selectedOption.value})
        } else {
            setFilterProducts(products)
        }


    }, [debounceValue, getFilter, products, selectedOption.value, setFilterProducts])


    useEffect(() => {
        fetchData({offset, limit})
        // getFilter({value: '', optionValue: '', offset, limit}).then((data) => {
        //      console.log(data, 'getFilter')
        //  })
        //  getFields({optionValue: selectedOption.value, offset, limit}).then((data) => {
        //      console.log(data, 'getFields')
        //  })
    }, [fetchData, limit, offset])

    useEffect(() => {
        filterData()
    }, [filterData])

    if (loading) {
        return (
            <Loader/>
        )
    }

    // console.log('==============start===============')
    // console.log(countProducts, 'countProducts')
    // console.log(products, 'products')
    // console.log(debounceValue, 'debounceValue')
    // console.log(selectedOption.value, 'selectedOption')
    // console.log(inputValue, 'inputValue')
    // console.log(filterProducts, 'filterProducts')
    // console.log('==============end===============')
    //console.log(filterData(), 'filterData')
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
                                fetchData({offset, limit})
                            }>
                                Update
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
                    {filterProducts && filterProducts
                            .map((item, idx) => <Product item={item} idx={idx} key={item.id}/>)
                            .slice(offsetPaginate, endOffsetPaginate)}

                        {!filterProducts.length && <div className="not-found">Not Found</div>}
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
