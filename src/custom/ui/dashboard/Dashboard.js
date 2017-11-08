/**
 * Created by chen on 17-8-26.
 */
import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import {Main} from './main';
import LeftLayout from "../containers/leftLayout";
import {GET_LIST} from '../../../lib';
import restClient from '../../../restClient'
import Dialog from 'material-ui/Dialog';
import Reflv from 'reflv';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowDownwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpwardIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove'
import Micro from 'material-ui/svg-icons/hardware/keyboard-voice';
import Sound from 'material-ui/svg-icons/av/volume-up';
import RaisedButton from 'material-ui/RaisedButton';

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
    },
    button:{
        margin:12
    }
}

class Dashboard extends Component {

    constructor(...args){
        super(...args);

        this.state = {open:false,cameraList:{},hostState:{},perimeterPoint:{},key: 0};

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

                        if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 0){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#4caf50";
                            this.ctx.strokeStyle = "#4caf50";
                            this.ctx.fill();
                        } else if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 1){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#f44336";
                            this.ctx.strokeStyle = "#f44336";
                            this.ctx.fill();
                        }else if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 2){
                            this.ctx.beginPath();
                            this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
                            this.ctx.fillStyle = "#9e9e9e";
                            this.ctx.strokeStyle = "#9e9e9e";
                            this.ctx.fill();
                        }else if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 3){
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

                <Dialog
                    title="触警处理窗口"
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >

                    <Reflv
                        url={`http://localhost:7001/live/test.flv`}
                        type="flv"
                        isLive
                        cors
                    />
                    <div>
                        <ArrowBackIcon />
                        <ArrowDownwardIcon />
                        <ArrowUpwardIcon />
                        <ArrowForwardIcon />

                        放大：<Add /> <Remove /><br/>
                        聚焦：<Add /> <Remove /><br/>
                        光圈：<Add /> <Remove /><br/>
                        <Sound /><Micro/><br/>
                        <RaisedButton label='手动解除' secondary={true} style={styles.button}/>
                    </div>
                </Dialog>
            </div>

        )
    }
}

export default withWidth()(Dashboard)