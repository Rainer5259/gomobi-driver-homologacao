const inititalState = {
  gpsStatus: null,
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case "GPS_STATUS_CHANGE":
      return {
        ...state,
        gpsStatus: action.payload,
      };
    default:
      return state;
  }
};
