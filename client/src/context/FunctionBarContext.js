import { createContext, useState, useEffect } from "react";

const FunctionBarContext = createContext();
console.log('Creating function bar text!')

export function FunctionBarProvider({children}){
    
    //STATE VARIABLES WE WILL PROVIDE TO FUNCTION BAR, HOME SCREEN, PEOPLE SCREEN, USER SCREEN
    const [sort, setSort] = useState(null)
    const [search,setSearch] = useState('')
    const [isHome, setIsHome] = useState(true)
    const [isPeople, setIsPeople] = useState(false)
    const [isUser, setIsUser] = useState(false)

    useEffect(() => {
        console.log('[FUNCTION BAR CONTEXT] SEARCH IS: ', search)
    }, [search])

    useEffect(() => {
        console.log('[FUNCTION BAR CONTEXT] SORT IS: ', sort)
    }, [sort])

    return (
        <FunctionBarContext.Provider value = {{sort, setSort, search, setSearch, isHome, setIsHome, isPeople, setIsPeople, isUser, setIsUser}}>
            {children}
        </FunctionBarContext.Provider>
    )
}

export default FunctionBarContext