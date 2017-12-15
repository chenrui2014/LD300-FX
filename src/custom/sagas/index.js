import {put,take,call,fork,select,takeEvery,takeLatest,all} from 'redux-saga/effects';
import * as actions from '../action';
import {getHost} from "../reducer/selectors";
import * as api from '../services';

const {host} = actions;

function* fetchEntity(entity, apiFn) {
    yield put( entity.request() )
    const {response, error} = yield call(apiFn)
    if(response)
        yield put( entity.success(response) )
    else
        yield put( entity.failure(error) )
}

export const fetchHost       = fetchEntity.bind(null, host, api.fetchHost);

function* loadHost() {
    const host = yield select(getHost)
    if (!host) {
        yield call(fetchHost)
    }
}

export function* getAllHost(){
    const hosts = yield call(api.fetchHost);
    if(hosts && hosts.data){
        yield put(actions.host.success);
    }else{
        yield put(actions.host.failure)
    }


}
function* watchGetAllHost() {
    yield takeEvery()
}

function* watchLoadHost() {
    yield takeLatest('HOST_REQUEST', loadHost);
    // while(true) {
    //     takLast()
    //     yield fork(loadHost);
    // }
}

export default [watchLoadHost];

// export default function* root() {
//     yield all([
//         fork(watchLoadHost)
//     ])
// }