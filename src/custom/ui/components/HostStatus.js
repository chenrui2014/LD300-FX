/**
 * Created by chen on 17-8-26.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import {green500} from 'material-ui/styles/colors';

const iconStyles = {
    marginRight: 24,

};
const styles={
    div:{paddingRight:30}
}

class HostStatus extends Component{

    constructor(props){
        super(props)

    }

    render() {
        const {hostName,hostStatus} = this.props;
        return(
            <div style={styles.div}>
                <FontIcon className="fa fa-circle material-icons" style={iconStyles} color={green500}>fd
                </FontIcon>
                <span>{hostName}</span>
            </div>


        )
    }
}

HostStatus.propTypes={
    hostStatus:PropTypes.number.isRequired,
    hostName:PropTypes.string.isRequired
}
HostStatus.defaultProp={
    hostStatus:0,
    hostName:' '
}

export default HostStatus;

