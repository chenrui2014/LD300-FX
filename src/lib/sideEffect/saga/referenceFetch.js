import { delay } from 'redux-saga';
import { call, cancel, fork, put, takeEvery } from 'redux-saga/effects';

const debouncedIds = {};
const addIds = (resource, ids) => {
    if (!debouncedIds[resource]) {
        debouncedIds[resource] = {};
    }
    ids.forEach((id) => {
        debouncedIds[resource][id] = true;
    });
};
const getIds = (resource) => {
    const ids = Object.keys(debouncedIds[resource]);
    delete debouncedIds[resource];
    return ids;
};

const tasks = {};


function* finalize(resource, actionCreator) {
    yield call(delay, 50);
    yield put(actionCreator(resource, getIds(resource)));
    delete tasks[resource];
}

function* accumulate({ payload, meta }) {
    const { ids, resource } = payload;
    if (tasks[resource]) {
        yield cancel(tasks[resource]);
    }
    addIds(resource, ids);
    tasks[resource] = yield fork(finalize, resource, meta.accumulate);
}

export default function* () {
    yield takeEvery(action => action.meta && action.meta.accumulate, accumulate);
}
