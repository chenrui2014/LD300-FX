/**
 * Created by chen on 17-8-26.
 */
import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import {Main} from './main';
import LeftLayout from "../containers/leftLayout";
//import restClient from '../../../restClient';
import {GET_LIST} from '../../../lib';
import restClient from '../../../restClient'
import moment from 'moment';

const styles = {
    flex: { display: 'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'stretch' },
    leftCol: { marginBottom: '2em',flex:'3 1 auto' },
    rightCol:{
        flex:'1 0 auto',
        width:200
    }
}

class Dashboard extends Component {
    //state = {cameraList:{},current:moment().format('YYYY年MM月DD日 HH:mm:ss')};

    constructor(...args){
        super(...args);

        this.state = {cameraList:{}};

    }

    componentWillMount(){
        restClient(GET_LIST,'cameras_noPage',{sort: { field: 'name', order: 'DESC' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(cameras=> this.setState({
                cameraList:cameras
            }));

    }

    componentDidMount() {

    }
    render() {
        return(
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <Main />
                </div>
                <div style={styles.rightCol}>
                    <LeftLayout data={this.state.cameraList}/>
                </div>

            </div>
        )
    }
}

export default withWidth()(Dashboard)