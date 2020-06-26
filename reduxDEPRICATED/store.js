import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from "./reducers";

export let store;

let middleWare = applyMiddleware(thunkMiddleware);
if (process.env.NODE_ENV === 'production') {
  middleWare = applyMiddleware(thunkMiddleware);
} else {
  middleWare = composeWithDevTools(applyMiddleware(thunkMiddleware));
}

let reduxStore = {};

export const initStore = () => {
  let store = createStore(rootReducer, middleWare);
  reduxStore = store;
  return store;
}

export {reduxStore};
