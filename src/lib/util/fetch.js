import 'babel-polyfill'
import HttpError from './HttpError';

export const
    fetchJson = (url, options = {}) => {
    const requestHeaders = options.headers || new Headers({
        Accept: 'application/json',
    });
    if (!(options && options.body && options.body instanceof FormData)) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    if (options.user && options.user.authenticated && options.user.token) {
        requestHeaders.set('Authorization', options.user.token);
    }
    // requestHeaders.set('Origin', 'http://localhost:8080');
    //     requestHeaders.set('Access-Control-Request-Method','GET,PUT, DELETE, POST')
    //     requestHeaders.set('Access-Control-Request-Headers','Origin,Content-Type,Authorization')
    //     requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    return fetch(url, { ...options,  mode:'cors',cache: 'default',headers: requestHeaders })
        .then(response => response.text().then(text => ({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: text,
        })))
        .then(({ status, statusText, headers, body }) => {
            let json;
            try {
                json = JSON.parse(body);
            } catch (e) {
                // not json, no big deal
            }
            if (status < 200 || status >= 300) {
                return Promise.reject(new HttpError((json && json.msg) || statusText, status));
            }
            return { status, headers, body, json };
        });
};

export const queryParameters = data => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
