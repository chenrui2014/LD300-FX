/**
 * Created by chen on 17-9-10.
 */
const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

function createRequestTypes(base) {
    return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
        acc[type] = `${base}_${type}`
        return acc
    }, {})
}

export const HOST = createRequestTypes('HOST');

export const LOAD_HOST_PAGE = 'LOAD_HOST_PAGE'

function action(type, payload = {}) {
    return {type, ...payload}
}

export const host = {
    request: () => action(HOST[REQUEST], {}),
    success: (response) => action(HOST[SUCCESS], {response}),
    failure: ( error) => action(HOST[FAILURE], {error}),
}

export const loadHostPage = () => action(LOAD_HOST_PAGE)


