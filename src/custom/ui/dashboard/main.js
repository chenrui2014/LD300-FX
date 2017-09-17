/**
 * Created by chen on 17-8-26.
 */
import React from 'react';
import {Card, CardHeader,CardMedia,CardText} from 'material-ui/Card';
import { translate } from '../../../lib';
import FontIcon from 'material-ui/FontIcon';
import {red500, green500, grey500,black} from 'material-ui/styles/colors';
import Background from '../../../../static/img/background.bmp';

const iconStyles = {
    marginRight: 24,
    marginTop:5

};
const styles={
    img:{backgroundSize:'contain'},
    span:{marginRight:30,paddingTop:0},
    footer:{display:'flex', flexDirection:'row',justifyContent:'space-between'}
}

export default translate(({ style, translate }) => (
    <Card style={style}>
        <CardHeader>
            <FontIcon className="material-icons" style={iconStyles} color={green500}>lens</FontIcon>
            <FontIcon className="material-icons" style={iconStyles} color={red500}>lens</FontIcon>
            <FontIcon className="material-icons" style={iconStyles} color={grey500}>lens</FontIcon>
            <FontIcon className="material-icons" style={iconStyles} color={black}>lens</FontIcon>
        </CardHeader>
        <CardMedia>
            <img src={Background} alt="" style={styles.img}/>
        </CardMedia>
        <CardText style={styles.footer}>
            <span>当前时间：{Date.now()}</span> <span>北京安盾兰达科技有限公司 LD300型监控系统 技术支持电话：010-22856945</span>
        </CardText>
    </Card>
));