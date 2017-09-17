/**
 * Created by chen on 17-9-10.
 */
import HttpError from '../../lib/util/HttpError'
require('es6-promise').polyfill();
require('isomorphic-fetch');

export const REQUEST_CAMERA = 'REQUEST_CAMERA';
export const SUCCESS_CAMERA  = 'SUCCESS_CAMERA';
export const FAILURE_CAMERA = 'FAILURE_CAMERA';

export const requestCamera = () =>({
    type:REQUEST_CAMERA
})

export const successCamera = (camera) =>({
    type:SUCCESS_CAMERA,
    data:camera
})

export const failureCamera = () =>({
    type:FAILURE_CAMERA
})

export const fetchCamera = ()=>dispatch =>{
    dispatch(requestCamera());
    return fetch('http://0.0.0.0:9000/api/cameras').then(response => response.text().then(text => ({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        body: text,
    }))).then(({ status, statusText, headers, body }) => {
        let json;
        try {
            json = JSON.parse(body);
        } catch (e) {
            // not json, no big deal
        }
        if (status < 200 || status >= 300) {
            return Promise.reject(new HttpError((json && json.message) || statusText, status));
        }
        return { status, headers, body, json };
    })
}


