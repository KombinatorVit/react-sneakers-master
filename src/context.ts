import  {createContext} from 'react';
import {IContextValue} from "./App";




// @ts-ignore
const AppContext = createContext<IContextValue>({})

export default AppContext;
