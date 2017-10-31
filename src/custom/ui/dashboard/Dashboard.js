/**
 * Created by chen on 17-8-26.
 */
import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import {Main} from './main';
import LeftLayout from "../containers/leftLayout";
import {GET_LIST} from '../../../lib';
import restClient from '../../../restClient'

import Background from '../../../../static/img/background.bmp';

import io from 'socket.io-client';

const socket = io('http://127.0.0.1:3000');
const initialChannel = 'hostState';

const styles = {
    flex: { display: 'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'stretch' },
    leftCol: { marginBottom: '2em',flex:'3 1 auto' },
    rightCol:{
        flex:'1 0 auto',
        width:200
    }
}

class Dashboard extends Component {

    constructor(...args){
        super(...args);

        this.state = {cameraList:{},hostState:{},perimeterPoint:{},key: 0};

    }

    canvasElement = null;
    ctx = null;

    componentWillMount(){
        restClient(GET_LIST,'cameras_noPage',{sort: { field: 'name', order: 'DESC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(cameras=> this.setState({
                cameraList:cameras
            }));

        // restClient(GET_LIST,'perimeterPoint',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
        //     .then(response =>response.data)
        //     .then(perimeterPoint=> {
        //         this.setState({
        //             perimeterPoint: perimeterPoint
        //         })
        //     });

        socket.on('new bc message', msg =>{
            console.log(msg);
            this.setState({hostState:msg})
        });

    }

    componentDidMount() {

        this.ctx = this.canvasElement.getContext("2d");
        let canCtx = this.ctx,img = new Image();
        //将图片绘制到canvas
        img.src = Background;
        img.onload = function () {
            canCtx.drawImage(img, 0, 0);
        }
        this.ctx.scale(0.9, 0.9);
        restClient(GET_LIST,'perimeterPoint',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(perimeterPoint=> {
                if(perimeterPoint && perimeterPoint.length && perimeterPoint.length > 0){
                    this.ctx.beginPath();
                    this.ctx.moveTo(perimeterPoint[0].x, perimeterPoint[0].y);
                    for (let pp in perimeterPoint) {
                        if (pp !== 0) {
                            this.ctx.lineWidth = 1.0;
                            this.ctx.lineCap = "butt";
                            this.ctx.lineJoin = "miter";
                            this.ctx.lineTo(perimeterPoint[pp].x, perimeterPoint[pp].y);
                            this.ctx.strokeStyle = '#ff0000';
                            this.ctx.stroke();
                        }

                        if(perimeterPoint[pp].camera && perimeterPoint[pp].camera.status === 0){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#4caf50";
                            this.ctx.strokeStyle = "#4caf50";
                            this.ctx.fill();
                        } else if(perimeterPoint[pp].camera && perimeterPoint[pp].camera.status === 1){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#f44336";
                            this.ctx.strokeStyle = "#f44336";
                            this.ctx.fill();
                        }else if(perimeterPoint[pp].camera && perimeterPoint[pp].camera.status === 2){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#9e9e9e";
                            this.ctx.strokeStyle = "#9e9e9e";
                            this.ctx.fill();
                        }else if(perimeterPoint[pp].camera && perimeterPoint[pp].camera.status === 3){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#000000";
                            this.ctx.strokeStyle = "#000000";
                            this.ctx.fill();
                        }

                    }
                }
                this.setState({
                    perimeterPoint: perimeterPoint
                })
            });

    }
    render() {
        return(
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <Main canvasRef={e1 => this.canvasElement = e1}/>
                </div>
                <div style={styles.rightCol}>
                    <LeftLayout data={this.state.cameraList}/>
                </div>

            </div>
        )
    }
}

export default withWidth()(Dashboard)