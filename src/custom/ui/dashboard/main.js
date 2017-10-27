/**
 * Created by chen on 17-8-26.
 */
import React, {Component}from 'react';
import {Card, CardHeader,CardMedia,CardText} from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import {red500, green500, grey500,black} from 'material-ui/styles/colors';
import Background from '../../../../static/img/background.bmp';
import moment from 'moment';

const iconStyles = {
    marginRight: 24,
    marginTop:5

};
const styles={
    span:{marginRight:30,paddingTop:0},
    footer:{display:'flex', flexDirection:'row',justifyContent:'space-between'}
}

export class Main extends Component{
    constructor(...args) {
        super(...args);
        this.state = {current:moment().format('YYYY年MM月DD日 HH:mm:ss')};
        var _this=this;
        setInterval(function(){
            //_this.currentDate.innerHTML=moment().format('YYYY年MM月DD日 HH:mm:ss');
            _this.tick();
        },1000);
    }

    tick(){
        this.setState({
            current:moment().format('YYYY年MM月DD日 HH:mm:ss')
        });
    }

    render() {
        return(
            <Card>
                <CardHeader>
                    <FontIcon className="material-icons" style={iconStyles} color={green500}>lens <span>监控中</span></FontIcon>
                    <FontIcon className="material-icons" style={iconStyles} color={red500}>lens <span>主机预警</span></FontIcon>
                    <FontIcon className="material-icons" style={iconStyles} color={grey500}>lens <span>未启用</span></FontIcon>
                    <FontIcon className="material-icons" style={iconStyles} color={black}>lens <span>主机故障</span></FontIcon>
                </CardHeader>
                <CardMedia>
                    <canvas ref={this.props.canvasRef} id="canvas" width="500" height="500">

                    </canvas>
                </CardMedia>
                <CardText style={styles.footer}>
                    <span>{this.state.current}</span> <span>北京安盾兰达科技有限公司 LD300型监控系统 技术支持电话：010-22856945</span>
                </CardText>
            </Card>
        );
    }
}