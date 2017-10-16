import { simpleRestClient } from './lib';

const restClient = simpleRestClient('http://127.0.0.1:9000/api');
export default (type, resource, params) => new Promise(resolve => setTimeout(() => resolve(restClient(type, resource, params)), 500));