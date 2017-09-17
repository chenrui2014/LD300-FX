/**
 * Created by chen on 17-9-10.
 */
import { combineReducers } from 'redux';
import {REQUEST_CAMERA,SUCCESS_CAMERA,FAILURE_CAMERA} from '../action';

const cameras = (state = {isFetching:false,success:false,items:[]},action) =>{
    switch (action.type){
        case REQUEST_CAMERA:
            return {
                ...state,
                isFetching:true
            }
        case SUCCESS_CAMERA:
            return {
                ...state,
                isFetching:true,
                success:true,
                items:action.data
            }
        case FAILURE_CAMERA:
            return {
            ...state,
            isFetching:false,
            success:false
            }
        default:
            return state;
    }
}
const getCamera = (state={ }, action) =>{
    switch (action.type){
        case REQUEST_CAMERA:
        case SUCCESS_CAMERA:
        case FAILURE_CAMERA:
            return {
                ...state,
                cameras:cameras(state[cameras],action)
            }
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    getCamera
})

export default rootReducer