/**
 * Created by chen on 17-8-26.
 */
import React, { Component } from 'react';
import {Card, CardHeader,CardMedia} from 'material-ui/Card';
import { FileInput} from '../lib/mui/input'
import TextInput from "../lib/mui/input/TextInput";

export class LeftLayout extends Component{
    render() {
        return(
            <Card style={this.props.style}>
                <CardHeader style={{paddingTop:0,paddingBottom:0}}>
                    <FileInput input={<TextInput addField={true}/>}>
                        <TextInput addField={true}/>
                    </FileInput>
                </CardHeader>
                <CardMedia>
                    <canvas ref={this.props.canvasRef} id="canvas" width="500" height="290">

                    </canvas>

                </CardMedia>
            </Card>
        );
    }
}

// export default translate(({ style, translate }) => (
//     <Card style={style}>
//         <CardHeader>
//             <FileInput input={<TextInput addField={true}/>}>
//                 <TextInput addField={true}/>
//             </FileInput>
//         </CardHeader>
//         <CardMedia>
//             <canvas ref={props.canvasRef} id="canvas" width="500" height="500">
//
//             </canvas>
//
//         </CardMedia>
//     </Card>
// ));