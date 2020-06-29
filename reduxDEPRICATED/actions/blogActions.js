// import {butter} from "../../store/api";
import { ACTION_PUT_BLOG } from '../actionTypes';
import Global from '../../components/Constants';

export function getBlog() {
  return async (dispatch) => {
    const { data } = await GlobalBUTTER.post.list();
    dispatch({
      type: ACTION_PUT_BLOG,
      data,
    });
  };
}
