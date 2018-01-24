/**
 * Created by chen on 17-8-26.
 */
import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import {Main} from './main';
import {GET_LIST} from '../../../lib';
import restClient from '../../../restClient'
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowDownwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpwardIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove'
import Micro from 'material-ui/svg-icons/hardware/keyboard-voice';
import Sound from 'material-ui/svg-icons/av/volume-up';
import FlatButton from 'material-ui/FlatButton';
import Background from '../../../../static/img/background.bmp';
import {Tab,Tabs} from 'material-ui/Tabs';
import {Table,TableBody,TableHeader,TableRow,TableRowColumn,TableHeaderColumn,TableFooter} from 'material-ui/Table';

import {red500, green500, grey500,black} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import ArrowBottomLeft from 'mdi-material-ui/ArrowBottomLeft';
import ArrowBottomRight from 'mdi-material-ui/ArrowBottomRight';
import ArrowTopLeft from 'mdi-material-ui/ArrowTopLeft';
import ArrowTopRight from 'mdi-material-ui/ArrowTopRight';

import $ from 'jquery';
import flvjs from 'flv.js';
import _ from 'lodash';

import io from 'socket.io-client';

const styles = {
    flex: { display: 'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'stretch' },
    leftCol: { flex:'3 1 auto' },
    rightCol:{
        flex:'0 0 auto',
        width:360,
        background:'#ffffff'
    },
    button:{
        margin:12
    },
    video:{
        width: 600,
        height: 400,
        flex:'2 1 auto'
    },
    option:{
        flex:'1 1 auto',
        marginTop:20
    }
}

class Dashboard extends Component {

    constructor(...args){
        super(...args);

        this.state = {selected: [0],open:true,camOpen:false,hid:'',value:1,camValue:1,alarmCamera:[1,2],camHandlers:[{id:1,handler:''},{id:2,handler:''}],
            config:[],cameraTypeList:[],cameraList:[],hosts:[],ppList:[],perimeterPoint:{},key: 0};


    }

    canvasElement = null;
    ctx = null;

    componentWillMount(){
        // this.props.loadHost();
        restClient(GET_LIST,'cameras_noPage',{sort: { field: 'name', order: 'DESC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(cameras=> this.setState({
                cameraList:cameras
            }));
        restClient(GET_LIST,'hosts_noPage',{sort: { field: 'port', order: 'DESC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(hosts=> {

                this.setState({

                    hosts:hosts
                });
                const socket=io('http://localhost:3001',{
                    path:'/stateServer'
                });

                socket.on('connect',()=> {
                    console.log("已连接服务器");
                });
                var _this = this;

                socket.on('init',(evt)=> {

                    //初始化主机状态
                    //var hostList = this.state.hosts;
                    for (let h of hosts) {
                        for (let eid in evt) {
                            if(h.id === evt[eid].hid){
                                //h.status = evt[hostid].stateNew;
                                if(evt[eid].stateNew === 'normal'){
                                    h.status = 0;
                                }
                                if(evt[eid].stateNew === 'alarm'){
                                    h.status = 1;
                                }
                                if(evt[eid].stateNew === 'unknown'){
                                    h.status = 2;
                                }
                                if(evt[eid].stateNew === 'error'){
                                    h.status = 3;
                                }

                                _this.setState({
                                    hosts:hosts
                                });
                            }
                        }
                    }

                    //_this.setState({
                    //    hosts:hostList
                    //});

                    console.log("init" + evt);
                });

                socket.on('update',(evt)=> {//更新主机状态
                    //var hostList = this.state.hosts;
                    for (let h of hosts) {
                        for(let eid in evt){
                            if(h.id === evt[eid].hid){
                                //h.status = evt[hostid].stateNew;
                                if(evt[eid].stateNew === 'normal'){
                                    h.status = 0;
                                }
                                if(evt[eid].stateNew === 'alarm'){
                                    h.status = 1;
                                }
                                if(evt[eid].stateNew === 'unknown'){
                                    h.status = 2;
                                }
                                if(evt[eid].stateNew === 'error'){
                                    h.status = 3;
                                }
                                _this.setState({
                                    hid:evt[eid].hid,
                                    hosts:hosts
                                });

                                let alarmCameras = this.state.alarmCamera;
                                let extCamera = evt[eid].monintors;//触警区域关联摄像头
                                if(extCamera && extCamera.length > 0){
                                    for (let h of extCamera) {
                                        if(evt[eid].stateNew ==='alarm'){
                                            alarmCameras.push(h.id);
                                        }else{
                                            _.remove(alarmCameras,function(n){
                                                return n===h.id;
                                            })
                                        }
                                    }
                                }

                                let temp = Array.from(new Set(alarmCameras));//去重


                                _this.setState({
                                    open:true,
                                    isAlarm:true,
                                    alarmCamera:temp
                                });
                            }
                        }

                    }

                    // _this.setState({
                    //     hid:hoid,
                    //     hosts:hostList
                    // });
                    //
                    // let alarmCameras = this.state.alarmCamera;
                    // let extCamera = event.monintors;//触警区域关联摄像头
                    // if(extCamera && extCamera.length > 0){
                    //     for (let h of extCamera) {
                    //         if(evt.stateNew ==='alarm'){
                    //             alarmCameras.push(h.id);
                    //         }else{
                    //             _.remove(alarmCameras,function(n){
                    //                 return n===h.id;
                    //             })
                    //         }
                    //     }
                    // }
                    //
                    // let temp = Array.from(new Set(alarmCameras));//去重
                    //
                    //
                    // _this.setState({
                    //     open:true,
                    //     isAlarm:true,
                    //     alarmCamera:temp
                    // });


                });
            });

        restClient(GET_LIST,'config_noPage',{sort: { field: 'configDate', order: 'DESC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(config=> this.setState({
                config:config
            }));

        restClient(GET_LIST,'cameraType_noPage',{sort: { field: 'typeCode', order: 'ASC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(cameraType=> this.setState({
                cameraTypeList:cameraType
            }));
        // restClient(GET_LIST,'perimeterPoint',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
        //     .then(response =>response.data)
        //     .then(perimeterPoint=> {
        //         this.setState({
        //             perimeterPoint: perimeterPoint
        //         })
        //     });

    }

    componentDidMount() {

        this.ctx = this.canvasElement.getContext("2d");
        let canCtx = this.ctx,img = new Image();
        //将图片绘制到canvas
        img.src = Background;
        img.onload = function () {
            // let w = img.width,h = img.height;
            // this.canvasElement.width = w;
            // this.canvasElement.height = h;
            canCtx.drawImage(img, 0, 0);
            // context.clearRect(0, 0, 400, 300);
            // var ptrn = canCtx.createPattern(img,"repeat");
            // context.fillStyle = ptrn;
            // context.fillRect(0, 0, 400, 300);
        }
        this.ctx.scale(0.88, 0.66);
        restClient(GET_LIST,'pp_noPage',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(ppList=> {
                this.setState({ppList:ppList});
                this.perimeterPointData = ppList;
                for(let perimeter in ppList){
                    let perimeterPoints = ppList[perimeter].pp;
                    this.ctx.beginPath();
                    this.ctx.moveTo(perimeterPoints[0].x, perimeterPoints[0].y);
                    for(let ppt in perimeterPoints){
                        if(ppt !== "0"){
                            this.ctx.lineWidth = 1.0;
                            this.ctx.lineCap = "butt";
                            this.ctx.lineJoin = "miter";
                            this.ctx.lineTo(perimeterPoints[ppt].x, perimeterPoints[ppt].y);
                            this.ctx.strokeStyle = '#ff0000';
                            this.ctx.stroke();
                        }
                    }
                }
            });
        // restClient(GET_LIST,'perimeterPoint',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
        //     .then(response =>response.data)
        //     .then(perimeterPoint=> {
        //         if(perimeterPoint && perimeterPoint.length && perimeterPoint.length > 0){
        //             this.ctx.beginPath();
        //             this.ctx.moveTo(perimeterPoint[0].x, perimeterPoint[0].y);
        //             for (let pp in perimeterPoint) {
        //                 if (pp !== 0) {
        //                     this.ctx.lineWidth = 1.0;
        //                     this.ctx.lineCap = "butt";
        //                     this.ctx.lineJoin = "miter";
        //                     this.ctx.lineTo(perimeterPoint[pp].x, perimeterPoint[pp].y);
        //                     this.ctx.strokeStyle = '#ff0000';
        //                     this.ctx.stroke();
        //                 }
        //
        //                 if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 0){
        //                     this.ctx.beginPath();
        //                     this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
        //                     this.ctx.fillStyle = "#4caf50";
        //                     this.ctx.strokeStyle = "#4caf50";
        //                     this.ctx.fill();
        //                 } else if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 1){
        //                     this.ctx.beginPath();
        //                     this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
        //                     this.ctx.fillStyle = "#f44336";
        //                     this.ctx.strokeStyle = "#f44336";
        //                     this.ctx.fill();
        //                 }else if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 2){
        //                     this.ctx.beginPath();
        //                     this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
        //                     this.ctx.fillStyle = "#9e9e9e";
        //                     this.ctx.strokeStyle = "#9e9e9e";
        //                     this.ctx.fill();
        //                 }else if(perimeterPoint[pp].host && perimeterPoint[pp].host.status === 3){
        //                     this.ctx.beginPath();
        //                     this.ctx.arc(perimeterPoint[pp].x, perimeterPoint[pp].y, 5,0, Math.PI*2, true);
        //                     this.ctx.fillStyle = "#000000";
        //                     this.ctx.strokeStyle = "#000000";
        //                     this.ctx.fill();
        //                 }
        //
        //             }
        //         }
        //         this.setState({
        //             perimeterPoint: perimeterPoint
        //         })
        //     });

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
        var alarmCamId= this.state.value;

        $.ajax({
            url:'http://localhost:3000/ipc/' + alarmCamId + '/live'+'?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                if($("#" + alarmCamId).children("video").length > 0){
                    return;
                }
                play($('<video></video>').prop('class','v'+alarmCamId).appendTo('#'+alarmCamId)[0],data.path,data.port);
            }
        });
        // function play(v,path,port) {
        //     var flvPlayer = flvjs.createPlayer({
        //         type: 'flv',
        //         isLive: true,
        //         enableWorker:true,
        //         enableStashBuffer: false,
        //         stashInitialSize: 128,
        //         autoCleanupSourceBuffer:true,
        //         url:'ws://localhost:'+port+path
        //     },{
        //         enableStashBuffer:false
        //     });
        //     flvPlayer.attachMediaElement(v);
        //     flvPlayer.load();
        //     flvPlayer.play();
        // }
        //
        // for(let cameraId of this.state.alarmCamera){
        //     $.ajax({
        //         url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
        //         dataType:'json',
        //         success:function (data) {
        //             play($('<video></video>').prop('class','v' + cameraId).appendTo('#' + cameraId)[0],data.path,data.port);
        //         }
        //     });
        //
        // }

    }

    //手动解除报警
    handleAlarm = () => {
        socket.emit('clear',{hid:this.state.hid});
        this.setState({open: false});
    };

    handlePtz = (code,e) =>{
        let handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        let _this = this;

        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/move?position='+code+'&stop=1'+'&handle='+handle+'&t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });

    };

    handleMouseDown = (code,e) =>{
        let handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        let _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/move?position='+code+'&stop=0'+'&handle='+handle+'&t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
    };
    handleMouseUp = (code,e) =>{

        let handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        let _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/ptzStop?stop=0'+'&handle='+handle+'&t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
    };
    handleOption = (code,e) =>{
        var handle='';
        //var stop=1;

        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        var _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/'+code+'?handle='+handle+'&stop=1'+'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
    };

    handleOptionMouseDown = (code,e) =>{
        let handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        let _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/'+code+'?handle='+handle+'&stop=0'+'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
    };
    handleOptionMouseUp = (code,e) =>{

        let handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        let _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/ptzStop?stop=0'+'&handle='+handle+'&t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
    };

    handleClose = () => {
        var handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        var _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/freeptz?handle='+ handle +'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
        this.setState({open: false});
    };

    handleClose1 = () => {
        var handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        var _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/freeptz?handle='+ handle +'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });
        this.setState({camOpen: false});
    };
    handleHostSelect = (host)=>{

    }
    handleCameraSelect = (camera)=>{
        let camList = this.state.cameraList;
        this.setState({selected:camera,camValue:camList[camera[0]].id,camOpen:true});
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

        var cameraId = camList[camera[0]].id;

        $.ajax({
            url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                if($("#c" + cameraId).children("video").length > 0){
                    return;
                }
                play($('<video></video>').prop('class','v' + cameraId).appendTo('#c' + cameraId)[0],data.path,data.port);
            }
        });
    }

    isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
    };

    handleActive(id,tab) {
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

        var cameraId = id;

        $.ajax({
            url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                if($("#" + cameraId).children("video").length > 0){
                    return;
                }
                play($('<video></video>').prop('class','v' + cameraId).appendTo('#' + cameraId)[0],data.path,data.port);
            }
        });

    }
    handleActive1 = (id,tab)=>{
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

        var cameraId = id;

        $.ajax({
            url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                if($("#c" + cameraId).children("video").length > 0){
                    return;
                }
                play($('<video></video>').prop('class','v' + cameraId).appendTo('#c' + cameraId)[0],data.path,data.port);
            }
        });
    };

    handleChange = (value) => {
        var handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        var _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/freeptz?handle='+ handle +'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });

        this.setState({
            value: value,
        });
    };

    handleChange1 = (value) => {
        var handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.camValue){
                handle=camHandler.handler;
            }
        }
        var _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/freeptz?handle='+ handle +'&t='+new Date().getTime(),
            dataType:'json',
            success:function(data) {
                for(let camHandler of _this.state.camHandlers){
                    if(camHandler.id === _this.state.value){
                        camHandler.handler = data.handle;
                    }
                }
                console.log(JSON.stringify(data));
            }
        });

        this.setState({
            camValue: value,
        });
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
        const camActions = [
            <FlatButton
                label="关闭"
                primary={true}
                onClick={this.handleClose1}
            />
        ];

        // const {hosts,cameras} = this.props;
        const {hosts,cameraList,cameraTypeList,alarmCamera,camValue,value,selected} = this.state;
        let temp = Array.isArray(hosts)?hosts:[];
        let temp2 = Array.isArray(cameraList)?cameraList:[];

        let isDemo = false;
        let currentCam = {};
        if(cameraList && cameraList.length > 0){
            for(let cam of cameraList){
                if(cam.id === value){
                    currentCam = cam;
                    if(cameraTypeList && cameraTypeList.length > 0){
                        for(let ct of cameraTypeList){
                            if( cam.type === ct.id && ct.typeCode === '002'){
                                isDemo = true;
                                break;
                            }
                        }
                    }
                    break;

                }
            }
        }

        let isCamDemo = false;
        if(cameraList && cameraList.length > 0){
            for(let cam of cameraList){
                if(cam.id === cameraList[selected[0]].id){
                    if(cameraTypeList && cameraTypeList.length > 0){
                        for(let ct of cameraTypeList){
                            if( cam.type === ct.id && ct.typeCode === '002'){
                                isCamDemo = true;
                                break;
                            }
                        }
                    }
                    break;

                }
            }
        }

        return(
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <Main canvasRef={e1 => this.canvasElement = e1} config={this.state.config}/>
                </div>
                <Paper style={styles.rightCol}>
                    <Tabs>
                        <Tab label="主机列表"><Table onRowSelection={this.handleHostSelect}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    {
                                        ['主机名称', '主机端口', '主机状态'].map((text, i) => {
                                            return <TableHeaderColumn>{text}</TableHeaderColumn>
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    temp.map((item, i) => {
                                        let fi = <FontIcon className="material-icons" color={green500}>lens</FontIcon>;
                                        switch (item.status) {

                                            case 0:
                                                fi = <FontIcon className="material-icons"
                                                               color={green500}>lens</FontIcon>;
                                                break;
                                            case 1:
                                                fi =
                                                    <FontIcon className="material-icons" color={red500}>lens</FontIcon>;
                                                break;
                                            case 2:
                                                fi = <FontIcon className="material-icons"
                                                               color={grey500}>lens</FontIcon>;
                                                break;
                                            case 3:
                                                fi = <FontIcon className="material-icons" color={black}>lens</FontIcon>;
                                                break;
                                            default:
                                                fi = <FontIcon className="material-icons"
                                                               color={green500}>lens</FontIcon>;

                                        }
                                        return <TableRow selected={this.isSelected(i)}>
                                            <TableRowColumn>{item.hostName}</TableRowColumn>
                                            <TableRowColumn>{item.port}</TableRowColumn>
                                            <TableRowColumn>{fi}</TableRowColumn>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table></Tab>
                        <Tab label="摄像头列表"><Table onRowSelection={this.handleCameraSelect}>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    {
                                        ['摄像头名称', 'IP'].map((text, i) => {
                                            return <TableHeaderColumn>{text}</TableHeaderColumn>
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    temp2.map((item, i) => {
                                        return <TableRow selected={this.isSelected(i)}>
                                            <TableRowColumn>{item.name}</TableRowColumn>
                                            <TableRowColumn style={{width: 100}}>{item.ip}</TableRowColumn>
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table></Tab>
                    </Tabs>
                </Paper>

                <Dialog
                    title="触警处理窗口"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                ><Tabs value={value}
                            onChange={this.handleChange}>
                    {
                        alarmCamera.map(id=>{
                            return <Tab label={id} value={id} onActive={this.handleActive.bind(this,id)}>
                                <div style={styles.video} id={id} >
                                </div>

                                {isDemo ? <div style={styles.option}>
                                    <IconButton tooltip="向左"><ArrowBackIcon
                                        onClick={this.handlePtz.bind(this, 4)} onMouseDown={this.handleMouseDown.bind(this, 4)} onMouseUp={this.handleMouseUp.bind(this, 4)}/></IconButton>
                                    <IconButton tooltip="向左下"><ArrowBottomLeft
                                        onClick={this.handlePtz.bind(this, 6)} onMouseDown={this.handleMouseDown.bind(this, 6)} onMouseUp={this.handleMouseUp.bind(this, 6)}/></IconButton>
                                    <IconButton tooltip="向下"><ArrowDownwardIcon onClick={this.handlePtz.bind(this, 2)} onMouseDown={this.handleMouseDown.bind(this, 2)} onMouseUp={this.handleMouseUp.bind(this, 2)}/></IconButton>

                                    <IconButton tooltip="向左上"><ArrowTopLeft onClick={this.handlePtz.bind(this, 5)} onMouseDown={this.handleMouseDown.bind(this, 5)} onMouseUp={this.handleMouseUp.bind(this, 5)}/></IconButton>
                                    <IconButton tooltip="向上"><ArrowUpwardIcon
                                        onClick={this.handlePtz.bind(this, 1)} onMouseDown={this.handleMouseDown.bind(this, 1)} onMouseUp={this.handleMouseUp.bind(this, 1)}/></IconButton>
                                    <IconButton tooltip="向右下"><ArrowBottomRight onClick={this.handlePtz.bind(this, 10)} onMouseDown={this.handleMouseDown.bind(this, 10)} onMouseUp={this.handleMouseUp.bind(this, 10)}/></IconButton>
                                    <IconButton tooltip="向右"><ArrowForwardIcon onClick={this.handlePtz.bind(this, 8)} onMouseDown={this.handleMouseDown.bind(this, 8)} onMouseUp={this.handleMouseUp.bind(this, 8)}/></IconButton>
                                    <IconButton tooltip="向右上"><ArrowTopRight onClick={this.handlePtz.bind(this, 9)} onMouseDown={this.handleMouseDown.bind(this, 9)} onMouseUp={this.handleMouseUp.bind(this, 9)}/></IconButton>|

                                    放大：<IconButton><Add onClick={this.handleOption.bind(this, 'zoomAdd')} onMouseDown={this.handleOptionMouseDown.bind(this, 'zoomAdd')} onMouseUp={this.handleOptionMouseUp.bind(this, 'zoomAdd')}/>
                                </IconButton><IconButton><Remove
                                    onClick={this.handleOption.bind(this, 'zoomDes')} onMouseDown={this.handleOptionMouseDown.bind(this, 'zoomDes')} onMouseUp={this.handleOptionMouseUp.bind(this, 'zoomDes')}/></IconButton> |
                                    聚焦：<IconButton><Add onClick={this.handleOption.bind(this, 'focusAdd')} onMouseDown={this.handleOptionMouseDown.bind(this, 'focusAdd')} onMouseUp={this.handleOptionMouseUp.bind(this, 'focusAdd')}/>
                                </IconButton><IconButton><Remove
                                    onClick={this.handleOption.bind(this, 'focusDec')} onMouseDown={this.handleOptionMouseDown.bind(this, 'focusDec')} onMouseUp={this.handleOptionMouseUp.bind(this, 'focusDec')}/></IconButton> |
                                    光圈：<IconButton><Add onClick={this.handleOption.bind(this, 'apertureAdd')} onMouseDown={this.handleOptionMouseDown.bind(this, 'apertureAdd')} onMouseUp={this.handleOptionMouseUp.bind(this, 'apertureAdd')}/>
                                </IconButton><IconButton><Remove onClick={this.handleOption.bind(this, 'apertureDec')} onMouseDown={this.handleOptionMouseDown.bind(this, 'apertureDec')} onMouseUp={this.handleOptionMouseUp.bind(this, 'apertureDec')}/></IconButton>
                                    | <IconButton tooltip="声音"><Sound/></IconButton><IconButton
                                    tooltip="麦克风"><Micro/></IconButton>
                                </div> : <div> </div>
                                }
                            </Tab>
                        })
                    }
                </Tabs>
                </Dialog>
                <Dialog
                    title={ cameraList[selected[0]] && cameraList[selected[0]].ip?cameraList[selected[0]].ip + "摄像头视频":"摄像头视频"}
                    actions={camActions}
                    modal={true}
                    open={this.state.camOpen}
                    onRequestClose={this.handleClose1}
                ><Tabs value={this.state.camValue}
                       onChange={this.handleChange1}>
                    <Tab label={camValue} value={camValue} onActive={this.handleActive1.bind(this,camValue)}>
                        <div style={styles.video} id={'c'+camValue} >
                        </div>

                        {isCamDemo ? <div style={styles.option}>
                            <IconButton iconClassName='mdi-arrow-bottom-left'/>
                            <IconButton tooltip="向左"><ArrowBackIcon
                                onClick={this.handlePtz.bind(this, 1)} onMouseDown={this.handleMouseDown.bind(this, 1)} onMouseUp={this.handleMouseUp.bind(this, 1)}/></IconButton>
                            <IconButton tooltip="向下"><ArrowDownwardIcon
                                onClick={this.handlePtz.bind(this, 2)} onMouseDown={this.handleMouseDown.bind(this, 2)} onMouseUp={this.handleMouseUp.bind(this, 2)}/></IconButton>
                            <IconButton tooltip="向上"><ArrowUpwardIcon
                                onClick={this.handlePtz.bind(this, 3)} onMouseDown={this.handleMouseDown.bind(this, 3)} onMouseUp={this.handleMouseUp.bind(this, 3)}/></IconButton>
                            <IconButton tooltip="向右"><ArrowForwardIcon
                                onClick={this.handlePtz.bind(this, 4)} onMouseDown={this.handleMouseDown.bind(this, 4)} onMouseUp={this.handleMouseUp.bind(this, 4)}/></IconButton> |

                            放大：<IconButton><Add onClick={this.handleOption.bind(this, 'zoomAdd')} onMouseDown={this.handleOptionMouseDown.bind(this, 'zoomAdd')} onMouseUp={this.handleOptionMouseUp.bind(this, 'zoomAdd')}/>
                        </IconButton><IconButton><Remove
                            onClick={this.handleOption.bind(this, 'zoomDec')} onMouseDown={this.handleOptionMouseDown.bind(this, 'zoomDec')} onMouseUp={this.handleOptionMouseUp.bind(this, 'zoomDec')}/></IconButton> |
                            聚焦：<IconButton><Add onClick={this.handleOption.bind(this, 'focusAdd')} onMouseDown={this.handleOptionMouseDown.bind(this, 'focusAdd')} onMouseUp={this.handleOptionMouseUp.bind(this, 'focusAdd')}/>
                        </IconButton><IconButton><Remove
                            onClick={this.handleOption.bind(this, 'focusDec')} onMouseDown={this.handleOptionMouseDown.bind(this, 'focusDec')} onMouseUp={this.handleOptionMouseUp.bind(this, 'focusDec')}/></IconButton> |
                            光圈：<IconButton><Add onClick={this.handleOption.bind(this, 'apertureAdd')} onMouseDown={this.handleOptionMouseDown.bind(this, 'apertureAdd')} onMouseUp={this.handleOptionMouseUp.bind(this, 'apertureAdd')}/>
                        </IconButton><IconButton><Remove
                            onClick={this.handleOption.bind(this, 'apertureDec')} onMouseDown={this.handleOptionMouseDown.bind(this, 'apertureDec')} onMouseUp={this.handleOptionMouseUp.bind(this, 'apertureDec')}/></IconButton>
                            | <IconButton tooltip="声音"><Sound/></IconButton><IconButton
                            tooltip="麦克风"><Micro/></IconButton>
                        </div> : <div> </div>
                        }
                    </Tab>
                </Tabs>
                </Dialog>
            </div>

        )
    }
}


// function mapStateToProps(state) {
//     const {hosts,cameras} = state.customReducers.entities;
//
//     return {
//         hosts: hosts,
//         cameras:cameras
//     }
// }
//
// const enhance = compose(
//     connect(mapStateToProps, {
//         loadHost: host.request,
//     }),
//     withWidth()
// );
//
// export default enhance(Dashboard);

export default withWidth()(Dashboard)