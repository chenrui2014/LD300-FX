/**
 * Created by chen on 17-9-10.
 */
import { combineReducers } from 'redux';

function entities(state = { hosts: [],cameras:[]}, action) {
    if (action.response && action.response.json) {
        return {...state,hosts:action.response.json.data}
    }

    return state
}

const rootReducer = combineReducers({
    entities
})

export default rootReducer