// import {butter} from "../../store/api";
import {
  ACTION_PUT_BLOG,
  ACTION_SET_KEYWORD,
  ACTION_SET_LOADING,
  ACTION_SET_RESULT,
} from '../actionTypes';
import _ from 'lodash';
import Global from '../../components/Constants';

export function setKeyword(keyword) {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_KEYWORD,
      keyword,
    });
  };
}

export function setLoading(isLoading) {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_LOADING,
      isLoading,
    });
  };
}

export function setResult(result) {
  return (dispatch) => {
    dispatch({
      type: ACTION_SET_RESULT,
      result,
    });
  };
}

export function handleSearch(keyword) {
  return (dispatch, getState) => {
    if (!keyword) {
      return;
    }
    if (keyword.length < 1) {
      dispatch(setLoading(false));
      dispatch(setResult([]));
      dispatch(setKeyword(''));
    }

    const blogs = getState().blog.pages.data.map((item) => {
      return {
        title: item.title,
        image: item.featured_image,
        slug: item.slug,
      };
    });

    const re = new RegExp(_.escapeRegExp(keyword), 'i');
    const isMatch = (result) => re.test(result.title);

    console.log('blogs', blogs, re, _.filter(blogs, isMatch));
    dispatch(setLoading(false));
    dispatch(setResult(_.filter(blogs, isMatch)));
  };
}
