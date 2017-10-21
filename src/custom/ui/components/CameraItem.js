/**
 * Created by chen on 17-8-27.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';

class CameraItem extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {name,type,status} = this.props;
        return(
            <div>
                {name}&nbsp;&nbsp;|&nbsp;&nbsp; {type}  &nbsp;&nbsp;|&nbsp;&nbsp;  {status?"离线":"在线"}
            </div>
        )
    }
}

CameraItem.propTypes = {
    name:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    status:PropTypes.number.isRequired
}

CameraItem.defaultProps={
    name:'摄像头',
    type:'枪机',
    status:0
}

export default CameraItem;