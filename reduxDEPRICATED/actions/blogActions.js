import {butter} from "../../store/api";
import {ACTION_PUT_BLOG} from "../actionTypes";

export function getBlog() {
  return async (dispatch) => {
    const { data } = await butter.post.list();
    dispatch({
      type: ACTION_PUT_BLOG,
      data,
    })
  }
}
