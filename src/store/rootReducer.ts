// store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import drawerReducer from './drawerSlice';
import balanceReducer from './balanceSlice'
import searchReducer from './searchSlice'
const rootReducer = combineReducers({
  drawer: drawerReducer,
  balance: balanceReducer,
  search: searchReducer,

});

export default rootReducer;
