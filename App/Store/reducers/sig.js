import { SET_SIG_DATA } from '../actions/actionTypes';

const initialState = {
  isApproved: false,
  referralCode: "",
  urtToShared: ""
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SIG_DATA:
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}

export default reducer;
