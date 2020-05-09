import {ACTION_PUT_BLOG} from "../actionTypes";


const initState = Object.freeze({
  categories: ["All", "Announcements", "Tutorials", "Technology"],
  pages: {
    data: [],
    meta: {}
  }
});

export default function blogReducer(state = initState, action) {
  switch (action.type) {

    case ACTION_PUT_BLOG:
      return {
        ...state,
        pages: action.data,
      }
    default:
      return state;
  }
}
