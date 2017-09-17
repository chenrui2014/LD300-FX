import { FETCH_END } from '../../actions/fetchActions';
import {
    GET_LIST,
    GET_ONE,
    GET_MANY,
    GET_MANY_REFERENCE,
    CREATE,
    UPDATE,
} from '../../rest/types';

const cacheDuration = 10 * 60 * 1000;

const addRecords = (newRecords = [], oldRecords) => {
    const newRecordsById = newRecords.reduce((prev, record) => {
        prev[record.id] = record; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    const now = new Date();
    const newRecordsFetchedAt = newRecords.reduce((prev, record) => {
        prev[record.id] = now; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    // remove outdated old records
    const latestValidDate = new Date();
    latestValidDate.setTime(latestValidDate.getTime() - cacheDuration);
    const oldValidRecordIds = oldRecords.fetchedAt
        ? Object.keys(oldRecords.fetchedAt)
            .filter(id => oldRecords.fetchedAt[id] > latestValidDate)
        : [];
    const oldValidRecords = oldValidRecordIds.reduce((prev, id) => {
        prev[id] = oldRecords[id]; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    const oldValidRecordsFetchedAt = oldValidRecordIds.reduce((prev, id) => {
        prev[id] = oldRecords.fetchedAt[id]; // eslint-disable-line no-param-reassign
        return prev;
    }, {});
    // combine old records and new records
    const records = {
        ...oldValidRecords,
        ...newRecordsById,
    };
    Object.defineProperty(records, 'fetchedAt', { value: {
        ...oldValidRecordsFetchedAt,
        ...newRecordsFetchedAt,
    } }); // non enumerable by default
    return records;
};

const initialState = {};
Object.defineProperty(initialState, 'fetchedAt', { value: {} });

export default resource => (previousState = initialState, { payload, meta }) => {
    if (!meta || meta.resource !== resource) {
        return previousState;
    }
    if (!meta.fetchResponse || meta.fetchStatus !== FETCH_END) {
        return previousState;
    }
    switch (meta.fetchResponse) {
    case GET_LIST:
    case GET_MANY:
    case GET_MANY_REFERENCE:
        return addRecords(payload.data, previousState);
    case GET_ONE:
    case UPDATE:
    case CREATE:
        return addRecords([payload.data], previousState);
    default:
        return previousState;
    }
};

export const getRecord = (state, id) => state[id];
