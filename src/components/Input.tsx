// import { memo, useCallback, useEffect, useRef, useState } from 'react';
// import { useDebounce } from 'use-debounce';
// import useData from '../hooks/useData.ts';
//
// export const Input = ({debounceValue}) => {
//     const [inputValue, setInputValue] = useState('')
//     const inputRef = useRef<HTMLInputElement>(null)
//     useEffect(() => {
//         inputRef.current?.focus()
//     }, [])
//     return (
//         <input type="search"
//                ref={inputRef}
//                placeholder="Enter value..."
//                className={!debounceValue ? ' outline-danger' : ''}
//                onChange={(e) => {
//                    setInputValue(e.target.value)
//                }
//                }
//         />
//
//     )
// }
// export const MemoizedInput = memo(Input)