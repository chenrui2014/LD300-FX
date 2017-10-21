/**
 * Created by chen on 17-8-27.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import CameraItem from './CameraItem';

class CameraList extends Component{
    constructor(props){
        super(props)

    }

    render(){
        const data = this.props;
        let cameraData = [];
        const temp = data.data;
        for(let i = 0; i < temp.data.length;i++){
            cameraData[i] = temp.data[i];
        }
        return(
            <List>
                {cameraData.map((camera,i)=>{
                    return <ListItem  key={i}><CameraItem name={camera.name} type={camera.type} status={camera.state}/></ListItem>
                })}

            </List>
        )
    }
}

CameraList.propTypes={
    style:PropTypes.object,
    data:PropTypes.object.isRequired
}

export default CameraList;