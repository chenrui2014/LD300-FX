/**
 * Created by chen on 17-8-27.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';

class PerimeterPointItem extends Component{
    constructor(props){
        super(props);
    }

    handleClick(camera,e){
        this.props.handleSelect(camera);
    }

    render(){
        const {data} = this.props;
        return(
            <div onClick={this.handleClick.bind(this,data)}>
                {data.name}&nbsp;&nbsp;|&nbsp;&nbsp;{data.No} &nbsp;&nbsp;|&nbsp;&nbsp; {data.realPosition}  &nbsp;&nbsp;|&nbsp;&nbsp;  {data.hostId}
            </div>
        )
    }
}

PerimeterPointItem.propTypes = {

    camera:PropTypes.object.isRequired
}

PerimeterPointItem.defaultProps={
    name:'摄像头',
    type:'枪机',
    ip:'0.0.0.0',
    status:0
}

export default PerimeterPointItem;