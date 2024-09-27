

/**
 * Reducer function to control the states with Redux
 * 
 * EX of Action: Recommended to use payload to store any more information related to the action.
 *          action = {
 *                  type: "TYPE_NAME",
 *                  payload: { value: "VALUE" },
 *          }
 */
export function reducer(state = [], action) {
    switch (action.type) {
        case "ServiceUserBoardScreen":
            return state;
        default:
            return state;
    }
}