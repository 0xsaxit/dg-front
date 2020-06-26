import {ACTION_PUT_BLOG, ACTION_SET_KEYWORD, ACTION_SET_LOADING, ACTION_SET_RESULT} from "../actionTypes";


const initState = Object.freeze({
  keyword: null,
  result: [],
  isLoading: false,
});

export default function blogReducer(state = initState, action) {
  switch (action.type) {

    case ACTION_SET_KEYWORD:
      return {
        ...state,
        keyword: action.keyword,
      };

    case ACTION_SET_RESULT:
      return {
        ...state,
        result: action.result,
      };

    case ACTION_SET_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}
