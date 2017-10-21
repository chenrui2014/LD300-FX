/**
 * Created by chen on 17-8-27.
 */
import React from 'react';
import { Card, CardTitle, } from 'material-ui/Card';
import {blue500} from 'material-ui/styles/colors';
import { CameraList }from '../components';

const styles ={
    card:{display:'flex',alignItems:'stretch'},
    title:{display:'flex',alignItems:'center',backgroundColor:{blue500}}
}
export default (data) =>(
    <Card style={styles.card}>
        <CardTitle title="摄像头列表" style={styles.title}/>
        <CameraList data={data}/>
    </Card>
);
