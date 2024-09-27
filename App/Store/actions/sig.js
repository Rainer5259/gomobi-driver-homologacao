import { SET_SIG_DATA } from './actionTypes';

export const setSigData = data => {
  return dispatch => {
    dispatch({
      type: SET_SIG_DATA,
      payload: data
    })
  }
}



