/**
 * Created by chen on 17-8-26.
 */
import React, {Component} from 'react';
import withWidth from 'material-ui/utils/withWidth';
import LeftLayout from "./leftLayout";
import RightLayout from './rightLayout';
import restClient from '../restClient';
import {GET_LIST} from '../lib';

import Background from '../../static/img/background.bmp';

import $ from 'jquery';
import PropTypes from 'prop-types';


const styles = {
    flex: {display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch'},
    leftCol: {marginBottom: '2em', flex: '10 1 auto'},
    rightCol: {
        flex: '1 0 auto',
        width: 200
    }
}

class Perimeter extends Component {
    state = {};

    componentWillMount() {

    }

    componentDidMount() {
        restClient(GET_LIST, 'cameras', {sort: {field: 'name', order: 'DESC'}})
            .then(response => response.data)
            .then(cameras => this.setState({
                cameraList: cameras
            }));

        //实际从服务器获得
        let perimeters=[];
        let newPerimeters=[];


        let canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), img = new Image();

        //获得canvas四个角的位置
        // let bounds = canvas.getBoundingClientRect();
        // function windowToCanvas(x,y){
        //     return { x: x - bounds.left * (canvas.width  / bounds.width),
        //         y: y - bounds.top  * (canvas.height / bounds.height) };
        // }
        //将图片绘制到canvas
        img.src = Background;
        img.onload = function () {
            ctx.drawImage(img, 0, 0);
        }
        ctx.scale(0.9, 0.9);

        function mousePos(e) {//获取鼠标所在位置的坐标，相对于整个页面
            var e = e || window.event;
            return {
                x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        }

        //先画已存在的周界点
        perimeters.map(item =>{

        })
        $('canvas').mousedown(function (e) {

            //x =  Math.floor(e.offsetX/Math.E);
            //y = Math.floor(e.offsetY/Math.E);
            //alert(x +";" +y)
            // let p = windowToCanvas(x,y);
            // alert(p.x+";"+p.y);
            var rect = canvas.getBoundingClientRect();

            let x = mousePos(e).x - rect.left;
            let y = mousePos(e).y - rect.top;
            x = Math.floor(x * (canvas.width / rect.width) / 0.9);
            y = Math.floor(y * (canvas.height / rect.height) / 0.9);
            if (confirm("是否添加周界点？")) {
                if (perimeters && perimeters.length > 0) {
                    let p = perimeters.pop();
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineWidth = 1.0;
                    ctx.lineCap = "butt";
                    ctx.lineJoin = "miter";
                    ctx.lineTo(x, y);
                    ctx.strokeStyle = '#ff0000';
                    ctx.stroke();
                    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
                    ctx.fillStyle = "#ff0000";
                    ctx.fill();
                    let newP = {x:x,y:y,realDis:0}
                    perimeters.push(newP);
                    //保存新的周界点到服务器
                    newPerimeters.push(newP);

                } else {
                    ctx.moveTo(x, y);
                    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
                    ctx.fillStyle = "#ff0000";
                    ctx.fill();
                }
            }

        }).mousemove(function (e) {
            // if(e.offsetX > bounds.left && e.offsetX < bounds.right && e.offsetY > bounds.top && e.offsetY < bounds.bottom){
            //     ctx.strokeStyle = "rgb(255,0,0)";
            //     ctx.lineTo(e.offsetX,e.offsetY);
            //     ctx.stroke();
            // }
        })
    }

    render() {
        const {cameraList} = this.state;
        return (
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <LeftLayout style={styles.main}/>
                </div>
                <div style={styles.rightCol}>
                    <RightLayout title="摄像头列表" data={[{name: 'test1', type: '0', status: 'df'}, {
                        name: 'test2',
                        type: '`',
                        status: 'dfdd'
                    }]}/>
                </div>

            </div>
        )
    }
}

Perimeter.propTypes = {
    perimeters: PropTypes.arrayOf(PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        realDis: PropTypes.number
    })).isRequired
}

Perimeter.defaultProps = {
    perimeters: [{x: 0, y: 0, realDis: 0}]
}

export default withWidth()(Perimeter)