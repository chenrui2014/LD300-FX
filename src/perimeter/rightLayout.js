import React from 'react';
import { Card, CardTitle, } from 'material-ui/Card';
import { translate } from '../lib';
import {blue500} from 'material-ui/styles/colors';
import { CameraList }from '../custom/ui/components';

const styles ={
    card:{display:'flex',alignItems:'stretch'},
    title:{display:'flex',alignItems:'center',backgroundColor:{blue500}}
}
export default (data) =>(
        <Card style={styles.card}>
            <CardTitle title="周界点列表" style={styles.title}/>
            <CameraList data={data} />
        </Card>
);