/**
 * Created by chen on 17-8-27.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';

class CameraItem extends Component{
    constructor(props){
        super(props);
    }

    handleClick(camera,e){

        //console.log(camera.id)
        this.setState({
            open:true,
            alarmHostId:camera.id
        });


    }

    render(){
        const {camera} = this.props;
        return(
            <div onClick={this.handleClick.bind(this,camera)}>
                {camera.name}&nbsp;&nbsp;|&nbsp;&nbsp;{camera.ip} &nbsp;&nbsp;|&nbsp;&nbsp; {camera.type}  &nbsp;&nbsp;|&nbsp;&nbsp;  {camera.status?"离线":"在线"}
            </div>
        )
    }
}

CameraItem.propTypes = {

    camera:PropTypes.object.isRequired
}

CameraItem.defaultProps={
    name:'摄像头',
    type:'枪机',
    ip:'0.0.0.0',
    status:0
}

export default CameraItem;