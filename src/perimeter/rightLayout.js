import React from 'react';
import { Card, CardTitle, } from 'material-ui/Card';
import { translate } from '../lib';
import {blue500} from 'material-ui/styles/colors';
import { CameraList }from '../custom/ui/components';

const styles ={
    card:{display:'flex',alignItems:'stretch'},
    title:{display:'flex',alignItems:'center',backgroundColor:{blue500}}
}
export default translate((title,data=[{name:'test231',type:'0',status:'df'},{name:'test2',type:'1',status:'dfdd'}],translate) =>(
        <Card style={styles.card}>
            <CardTitle title="摄像头列表" style={styles.title}/>
            <CameraList data={data} />
        </Card>
    )
);