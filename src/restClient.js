import { simpleRestClient } from './lib';
import LD300Config from './LD300Config';

const restClient = simpleRestClient(LD300Config.apiServer + '/api');
export default (type, resource, params) => new Promise(resolve => setTimeout(() => resolve(restClient(type, resource, params)), 500));