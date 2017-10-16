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
        const {data} = this.props;
        return(
            <List>
                {data.map((camera,i)=>{
                    return <ListItem  key={i}><CameraItem name={camera.name} type={camera.type} status={camera.state}/></ListItem>
                })}

            </List>
        )
    }
}

CameraList.propTypes={
    style:PropTypes.object,
    data:PropTypes.array.isRequired
}

export default CameraList;