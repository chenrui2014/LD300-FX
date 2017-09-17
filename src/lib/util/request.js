/**
 * Created by chen on 17-9-8.
 */

import 'babel-polyfill'
import HttpError from './HttpError';
import req from 'request-promise';


export const
    fetchJson = (url, options = {}) => {

    var config = {
        uri:url,
        method:options.method,
        resolveWithFullResponse: true
    };
    if(options.body){
        config.body = options.body;
    }

        return req(config)
            .then(response => ({
                status: response.statusCode,
                statusText: response.statusCode,
                headers: response.headers,
                body: response.body,
            }))
            .then(({ status, statusText, headers, body }) => {
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
            });
    };

export const queryParameters = data => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
