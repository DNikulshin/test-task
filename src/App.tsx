import { useCallback, useEffect, useState } from 'react'
import Select from 'react-select'
import { ToastContainer } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import { Loader } from './components/Loader.tsx'
import { Products } from './components/Products.tsx';
import { ProductsHeader } from './components/ProductsHeader.tsx';
import { PRE_PAGE } from './constants.ts'
import useData from './hooks/useData.ts'
import 'react-toastify/dist/ReactToastify.css'

interface OptionType {
    value: string;
    label: string
    selected?: boolean
}

export interface handlePageClickMoreProps {
    offset: number
}


const options: OptionType[] = [
    {value: '', label: 'No filter', selected: false},
    {value: 'brand', label: 'brand', selected: true},
    {value: 'product', label: 'product', selected: true},
    {value: 'price', label: 'price', selected: true}
];

function App() {
    const [pageCount, setPageCount] = useState(0)
    const [selectedOption, setSelectedOption] = useState<OptionType>(options[0])
    const {
        fetchData,
        countProducts,
        products,
        loading,
        loadingFilter,
        filterProducts,
        countFilterProducts,
        setCountFilterProducts,
        getFilter,
        error,
        errorFilter,
        allCountIdsProducts,
        offset
    } = useData()

    const calculationPageCount = useCallback((count: number) => {
        setPageCount(Math.ceil(count / PRE_PAGE))
    }, [])
    const [inputValue, setInputValue] = useState('')
    const [debounceValue] = useDebounce(inputValue, 500)


    const filterData = useCallback(async () => {
        if (debounceValue) {
            await getFilter({value: debounceValue, optionValue: selectedOption.value})
            calculationPageCount(countFilterProducts)
        } else {
            setCountFilterProducts(0)
            calculationPageCount(countProducts)
        }

    }, [calculationPageCount, countFilterProducts, countProducts, debounceValue, getFilter, selectedOption, setCountFilterProducts])

    const handlePageClickMore = useCallback(async ({offset} : handlePageClickMoreProps) => {
            await fetchData({offset})

    }, [fetchData])

    useEffect(() => {
            filterData()
    }, [filterData])


    console.log('allCountIdsProducts: ', allCountIdsProducts, 'countProducts: ', countProducts)
    console.log('RENDER+++++++++++++++++++++++++')
    console.log(allCountIdsProducts, 'countAllProducts')
    console.log(error, 'error')
    console.log('==============start===============')
    console.log(offset, 'offset')
    console.log(countProducts, 'countProducts33333333333333333333333333')
    console.log(countFilterProducts, 'countFilterProducts')
    console.log(products, 'products')
    console.log(selectedOption.value, 'selectedOption value')
    console.log(filterProducts, 'filterProducts')
    console.log((loading), 'loading')
    console.log((error), 'loading')
    console.log((loading || error), 'loading || error')
    console.log(pageCount, 'pageCount')
    console.log('==============end===============')
    console.log(selectedOption?.selected, 'selectedOption?.selected')

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
                            <button
                                className="reset"
                                disabled={loading}
                                onClick={() =>
                                    window.location.reload()
                                }>
                                Reset
                            </button>
                        </div>

                        <div className="products-filter">
                            <Select
                                defaultValue={selectedOption}
                                onChange={((newValue) => setSelectedOption(newValue ?? options[0]))}
                                isMulti={false}
                                isSearchable={false}
                                options={options}
                                name="select"
                                placeholder="Выберите значение..."
                            />
                            {selectedOption.value &&
                                <input type="search"
                                       placeholder="Enter value..."
                                       className={!debounceValue ? ' outline-danger' : ''}
                                       onChange={(e) => {
                                           setInputValue(e.target.value)
                                       }
                                       }
                                />
                            }
                            {(!loading && countProducts > 0) &&
                                <strong>
                                    Count:{' '}
                                    <span className="products-count">
                                        {countProducts}
                                    </span>
                                </strong>
                            }
                            {error &&
                                <button className="error-request"
                                        onClick={() => handlePageClickMore({offset})}
                                >
                                    Error: Repeat request
                                </button>}
                            {loadingFilter ? <Loader containerSelector="container-loader-find" selector="loader-find"/>
                                : countFilterProducts > 0
                                && debounceValue
                                    ? <strong>
                                        Filtered:{' '}
                                        <span
                                        className="filtered-count">
                                        {countFilterProducts}
                                        </span>
                                    </strong>
                                    : !countFilterProducts && debounceValue &&
                                    <div className="danger">Not Found</div>
                            }
                            {errorFilter && <button className="error-request"
                                                    onClick={filterData}
                            >Error: Repeat request
                            </button>
                            }
                        </div>
                        <ProductsHeader/>
                    </div>
                    {!loading ? <>

                            <Products
                                products={products}
                                offset={offset}
                                countFilterProducts={countFilterProducts}
                                filterProducts={filterProducts}
                                pageCount={pageCount}
                                countProducts={countProducts}
                                loading={loading}
                                error={error}
                                selectedOption={selectedOption}
                                allCountIdsProducts={allCountIdsProducts}
                                handlePageClickMore={handlePageClickMore}
                            />
                        </>

                        : <Loader
                            containerSelector="container-loader"
                            selector="loader"
                            text="Loading..."
                        />
                    }

                </div>
            </div>
        </div>
    )
}

export default App
