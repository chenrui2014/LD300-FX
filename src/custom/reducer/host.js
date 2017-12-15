import { combineReducers } from 'redux';
import * as ActionTypes from '../action';

function getAllHost(state={isFetching:false,items:[]},action){
    switch (action.type){
        case ActionTypes.HOST[REQUEST]:
            return {...state,isFetching:true}
        case ActionTypes.HOST[SUCCESS]:
            return {...state,isFetching:false,items:action.request}
        case ActionTypes.HOST[FAILURE]:
            return {...state,isFetching:false}
        default:
            return state;
    }
}