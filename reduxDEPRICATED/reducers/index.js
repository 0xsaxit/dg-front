import {combineReducers} from 'redux'
import blog from './blog';
import search from './search';

export const rootReducer = combineReducers({
    blog,
    search,
});
