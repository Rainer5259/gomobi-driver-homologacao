const initialState = {
    contNewMensag: 0
}


export default (state = initialState, action) => {
    switch (action.type) {
        case 'CONT_NEW_MENSAG':

            return {
                ...state,
                contNewMensag: action.payload
            }

        default:
            return state
    }
}