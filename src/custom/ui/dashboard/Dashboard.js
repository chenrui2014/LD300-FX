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

        this.state = {selected: [1],open:true,value:1,alarmHostId:[1,2],config:{},videoData:{path:'/live/1'},cameraList:{},hosts:{},perimeterPoint:{},key: 0};


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
            .then(hosts=> this.setState({
                hosts:hosts
            }));

        restClient(GET_LIST,'config_noPage',{sort: { field: 'configDate', order: 'DESC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(config=> this.setState({
                config:config
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

            let alarmHost = this.state.alarmHostId;
            alarmHost.push(1);
            for (let h in hostList) {
                if(h.status === 1){
                    alarmHost.push(h.id)
                }
            }

            _this.setState({
                open:true,
                alarmHostId:alarmHost
            });


        });


    }

    componentDidUpdate(){
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

        var cameraId = this.state.value;

        $.ajax({
            url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                if($("#" + cameraId).children("video").length > 0){
                    return;
                }
                play($('<video></video>').prop('class','v'+cameraId).appendTo('#'+cameraId)[0],data.path,data.port);
            }
        });
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
        //     $.ajax({
        //         url:'http://localhost:3000/ipc/' + this.state.alarmHostId + '/live'+'?t='+new Date().getTime(),
        //         dataType:'json',
        //         success:function (data) {
        //             play($('<video></video>').prop('class','v5').appendTo('#c')[0],data.path,data.port);
        //         }
        //     });

    }

    //手动解除报警
    handleAlarm = () => {
        this.setState({open: false});
    };

    handleStream =(camera)=>{
        this.setState({alarmHostId:camera.id,open:true});
    };

    handlePtz = (e,code) =>{
        var handle='';
        var stop='';
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/move?position='+code+'&stop='+stop+'&handle='+handle+'&t='+new Date().getTime(),
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
    handleHostSelect = (host)=>{

    }
    handleCameraSelect = (camera)=>{
        this.setState({value:camera[0],open:true});
    }

    isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
    };

    handleActive(tab) {

    }

    handleChange = (value) => {
        this.setState({
            value: value,
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

        // const {hosts,cameras} = this.props;
        const {hosts,cameraList,alarmHostId} = this.state;
        let temp = Array.isArray(hosts)?hosts:[];
        let temp2 = Array.isArray(cameraList)?cameraList:[];
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
                                        ['主机名称','主机端口','主机状态'].map((text,i) =>{
                                            return <TableHeaderColumn>{text}</TableHeaderColumn>
                                        })
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody displayRowCheckbox={false}>
                                {
                                    temp.map((item,i)=>{
                                        let fi = <FontIcon className="material-icons" color={green500}>lens</FontIcon>;
                                        switch(item.status){

                                            case 0:
                                                fi=<FontIcon className="material-icons" color={green500}>lens</FontIcon>;
                                                break;
                                            case 1:
                                                fi=<FontIcon className="material-icons" color={red500}>lens</FontIcon>;
                                                break;
                                            case 2:
                                                fi=<FontIcon className="material-icons" color={grey500}>lens</FontIcon>;
                                                break;
                                            case 3:
                                                fi=<FontIcon className="material-icons" color={black}>lens</FontIcon>;
                                                break;
                                            default: fi=<FontIcon className="material-icons" color={green500}>lens</FontIcon>;

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
                                            ['摄像头名称','IP','摄像头状态'].map((text,i) =>{
                                                return <TableHeaderColumn>{text}</TableHeaderColumn>
                                            })
                                        }
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false}>
                                    {
                                        temp2.map((item,i)=>{
                                            return <TableRow selected={this.isSelected(i)}>
                                                <TableRowColumn>{item.name}</TableRowColumn>
                                                <TableRowColumn style={{width:100}}>{item.ip}</TableRowColumn>
                                                <TableRowColumn>{item.status?"在线":"离线"}</TableRowColumn>
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
                ><Tabs value={this.state.value}
                            onChange={this.handleChange}>
                    {
                        alarmHostId.map(id=>{
                            return <Tab label={id} value={id} onActive={this.handleActive}><div style={styles.video} id={id} />

                                <div style={styles.option}>
                                    <IconButton tooltip="向左"><ArrowBackIcon onClick={this.handlePtz.bind(this,1)} /></IconButton>
                                    <IconButton tooltip="向下"><ArrowDownwardIcon onClick={this.handlePtz.bind(this,2)} /></IconButton>
                                    <IconButton tooltip="向上"><ArrowUpwardIcon onClick={this.handlePtz.bind(this,3)} /></IconButton>
                                    <IconButton tooltip="向右"><ArrowForwardIcon onClick={this.handlePtz.bind(this,4)} /></IconButton> |

                                    放大：<IconButton><Add onClick={this.handleOption.bind(this,'zoomAdd')}/> </IconButton><IconButton><Remove onClick={this.handleOption.bind(this,'zoomDes')}/></IconButton> |
                                    聚焦：<IconButton><Add onClick={this.handleOption.bind(this,'focusAdd')}/> </IconButton><IconButton><Remove onClick={this.handleOption.bind(this,'focusDec')}/></IconButton> |
                                    光圈：<IconButton><Add onClick={this.handleOption.bind(this,'apertureAdd')}/> </IconButton><IconButton><Remove onClick={this.handleOption.bind(this,'apertureDec')}/></IconButton>
                                                            | <IconButton tooltip="声音"><Sound /></IconButton><IconButton tooltip="麦克风"><Micro/></IconButton>
                                </div>
                            </Tab>
                        })
                    }
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