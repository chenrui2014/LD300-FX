/**
 * Created by chen on 17-8-26.
 */
import React from 'react';
import {Card, CardHeader,CardMedia} from 'material-ui/Card';
import { translate } from '../lib';
import Background from '../../static/img/background.bmp';
import { FileInput} from '../lib/mui/input'
import TextInput from "../lib/mui/input/TextInput";

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
            <FileInput input={<TextInput addField={true}/>}>
                <TextInput addField={true}/>
            </FileInput>
        </CardHeader>
        <CardMedia>
            <canvas id="canvas" width="500" height="500">

            </canvas>

        </CardMedia>
    </Card>
));