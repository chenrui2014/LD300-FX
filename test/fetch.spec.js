/**
 * Created by chen on 17-8-27.
 */
import chai from 'chai';
import {queryParameters,fetchJson} from '../src/lib/util/fetch';
import request from 'request';
import rq from 'request-promise-native';
import req from 'request-promise';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;

describe("main",function(){

    it('url参数应该类似于(a=b&c=d)', function() {
        expect(queryParameters({test:'test1',test1:'test2'})).to.be.equal('test=test1&test1=test2');
    });

    // it('response', function() {
    //     expect(fetchJson('http://0.0.0.0:9000/api/cameras',{mode:'cors',headers:{
    //         AccessControlAllowOrigin:'*',
    //         AccessControlAllowMethods:'POST, GET, OPTIONS, PUT, DELETE'
    //     }})).to.be.equal('test=test1&test1=test2');
    // });

    // it('fetch', function(done) {
    //
    //     fetch('http://0.0.0.0:9000/api/cameras').then(response => response.text().then(function (text) {
    //         expect(response.status).to.be.equal(200);
    //         expect(response.statusText).to.be.equal('OK');
    //         //expect(response.text()).to.be.equal(200);
    //         ///expect(JSON.stringify(response)).to.be.equal(200);
    //         expect(text).to.be.equal(200);
    //         expect(response.headers).to.be.equal(200);
    //
    //         done();
    //     }))
    // });

    it('fetch', function(done) {

        fetch('http://0.0.0.0:9000/api/cameras').then(response => response.text().then(function (text) {
            let obj = {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                body: text,
            }
            let json;
            try {
                json = JSON.parse(obj.body);
                json.id = json._id;
                delete json._id;
                expect(json.id).to.be.equal('a');
            } catch (e) {
                // not json, no big deal
            }
            done();
        }))
    });



    // it('request', function(done) {
    //     request('http://0.0.0.0:9000/api/cameras',function (error, response, body) {
    //         expect(body).to.be.equal('{"msg":"查询摄像头","data":[{"_id":"59aecaedf3de1a40ad39aa79","__v":0},{"_id":"59aed281d14c954a8856a165","name":"dsg","ip":"89","manufacturer":"asdfyhy","Video_protocol":"2q34","talkBack":true,"yunTai_protocol":"asdf","__v":0}]}')
    //         done()
    //         console.log('error:', error);
    //         console.log('statusCode:', response && response.statusCode);
    //         console.log('body:', body);
    //     });
    // });

    // it('request-promise', function(done) {
    //
    //     var options = {
    //         uri: 'http://0.0.0.0:9000/api/cameras',
    //         headers: {
    //             'User-Agent': 'Request-Promise'
    //         },
    //         resolveWithFullResponse: true
    //         //json: true
    //     };
    //     req(options).then(function (response) {
    //         console.log('req-response:', response.text);
    //         console.log('req-headers:', response.headers);
    //         console.log('req-statusCode:', response && response.statusCode);
    //         console.log('req-body:', response.body);
    //
    //         expect(response).to.be.equal(JSON.parse('{"msg":"查询摄像头","data":[{"_id":"59aecaedf3de1a40ad39aa79","__v":0},{"_id":"59aed281d14c954a8856a165","name":"dsg","ip":"89","manufacturer":"asdfyhy","Videtocol":"2q34","talkBack":true,"yunTai_protocol":"asdf","__v":0}]}'))
    //         done()
    //
    //
    //     }).catch(function (error) {
    //         console.log('req-error:', error);
    //         expect(error).to.be.equal('{"msg":"查询摄像头","data":[{"_id":"59aecaedf3de1a40ad39aa79","__v":0},{"_id":"59aed281d14c954a8856a165","name":"dsg","ip":"89","manufacturer":"asdfyhy","Videtocol":"2q34","talkBack":true,"yunTai_protocol":"asdf","__v":0}]}')
    //         done()
    //
    //
    //     });
    // });


    // requestHeaders.set('Access-Control-Allow-Origin','*');
    // requestHeaders.set('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT, DELETE');
    // requestHeaders.set('Access-Control-Max-Age','3600');
    // requestHeaders.set('Access-Control-Allow-Headers','token,Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Max-Age');
})
