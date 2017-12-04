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
    handleSelect(val){

        this.props.handleCamera(val);
    }

    render(){
        const data = this.props;
        let cameraData = [];
        const temp = data.data;
        if(temp){
            for(let i = 0; i < temp.length;i++){
                cameraData[i] = temp[i];
            }
        }

        return(
            <List>
                {cameraData.map((camera,i)=>{
                    return <ListItem  key={i}><CameraItem handleSelect={this.handleSelect.bind(this)} camera={camera}/></ListItem>
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