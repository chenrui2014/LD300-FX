import 'isomorphic-fetch'

const API_ROOT = 'http://127.0.0.1:9000/api/';
function callApi(endpoint) {
    const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint

    return fetch(fullUrl)
        .then(response =>
            response.json().then(json => ({ json, response }))
        ).then(({ json, response }) => {
            if (!response.ok) {
                return Promise.reject(json)
            }

            return json
        })
        .then(
            response => ({response}),
            error => ({error: error.message || 'Something bad happened'})
        )

}

export const fetchHost = () => callApi('hosts_noPage');