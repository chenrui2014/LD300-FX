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
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowDownwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpwardIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove'
import Micro from 'material-ui/svg-icons/hardware/keyboard-voice';
import Sound from 'material-ui/svg-icons/av/volume-up';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Background from '../../../../static/img/background.bmp';

import $ from 'jquery';
import flvjs from 'flv.js';

import io from 'socket.io-client';

const socket=io('http://localhost:3001',{
    path:'/stateServer'
});

socket.on('connect',()=> {
    console.log("已连接服务器");
});

const styles = {
    flex: { display: 'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'stretch' },
    leftCol: { marginBottom: '2em',flex:'3 1 auto' },
    rightCol:{
        flex:'1 0 auto',
        width:200
    },
    button:{
        margin:12
    },
    video:{
        flexDirection:'column',
        flex:'2 0 auto',
        width: 600,
        height: 400
    },
    option:{flex:'1,1,auto'}
}

class Dashboard extends Component {

    constructor(...args){
        super(...args);

        this.state = {open:true,alarmHostId:5,videoData:{path:'/live/5'},cameraList:{},hosts:{},perimeterPoint:{},key: 0};


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

        socket.on('init',(evt)=> {
            console.log("init" + evt);
        });

        var _this = this;
        socket.on('update',(evt)=> {
            var hostList = this.state.hosts;
            for (let h in hostList) {
                for (let e in evt) {
                    if(h.id === e.hostId){
                        h.status = e.hostState;
                    }
                }
            }

            _this.setState({
                hosts:hostList
            });

            for (let h in hostList) {
                if(h.status === 1){
                    _this.setState({
                        open:true,
                        alarmHostId:5
                    });
                }
            }


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
        function play(v,path,port) {
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                enableWorker:true,
                enableStashBuffer: false,
                stashInitialSize: 128,
                autoCleanupSourceBuffer:true,
                url:'ws://localhost:'+port+path
            },{
                enableStashBuffer:false
            });
            flvPlayer.attachMediaElement(v);
            flvPlayer.load();
            flvPlayer.play();
        }

            $.ajax({
                url:'http://localhost:3000/ipc/' + this.state.alarmHostId + '/live'+'?t='+new Date().getTime(),
                dataType:'json',
                success:function (data) {
                    play($('<video></video>').prop('class','v5').appendTo('#c')[0],data.path,data.port);
                }
            });

    }

    handleAlarm = () => {
        this.setState({open: false});
    };

    handlePtz = (e,code) =>{
        var handle='';
        var stop='';
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.alarmHostId+'/ptz/move?position='+code+'&stop='+stop+'&handle='+handle+'&t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                handle=data.handle;
                console.log(JSON.stringify(data));
            }
        });
    };
    handleOption = (e,code) =>{
        var handle='';
        var stop='';
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.alarmHostId+'/ptz/'+code+'?handle='+handle+'&stop='+stop+'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                console.log(JSON.stringify(data));
            }
        });
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const actions = [
            <FlatButton
                label="关闭"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="手动解除"
                primary={true}
                onClick={this.handleAlarm}
            />,
        ];

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
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    <div style={styles.video} id="c" />

                    <div style={styles.option}>
                        <ArrowBackIcon onClick={this.handlePtz.bind(this,1)} />
                        <ArrowDownwardIcon onClick={this.handlePtz.bind(this,2)} />
                        <ArrowUpwardIcon onClick={this.handlePtz.bind(this,3)} />
                        <ArrowForwardIcon onClick={this.handlePtz.bind(this,4)} />
                        <br/>

                        放大：<Add onClick={this.handleOption.bind(this,'zoomAdd')}/> <Remove onClick={this.handleOption.bind(this,'zoomDes')}/><br/>
                        聚焦：<Add onClick={this.handleOption.bind(this,'focusAdd')}/> <Remove onClick={this.handleOption.bind(this,'focusDec')}/><br/>
                        光圈：<Add onClick={this.handleOption.bind(this,'apertureAdd')}/> <Remove onClick={this.handleOption.bind(this,'apertureDec')}/><br/>
                        <Sound /><Micro/><br/>
                        <RaisedButton label='手动解除' secondary={true} style={styles.button}/>
                    </div>
                </Dialog>
            </div>

        )
    }
}

export default withWidth()(Dashboard)