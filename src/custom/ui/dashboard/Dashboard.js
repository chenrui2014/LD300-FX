/**
 * Created by chen on 17-8-26.
 */
import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import Main from './main';
import LeftLayout from "../containers/leftLayout";
//import restClient from '../../../restClient';
import {GET_LIST,simpleRestClient} from '../../../lib';

const styles = {
    flex: { display: 'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'stretch' },
    leftCol: { marginBottom: '2em',flex:'3 1 auto' },
    rightCol:{
        flex:'1 0 auto',
        width:200
    }
}

class Dashboard extends Component {
    state = {};

    componentDidMount() {
        simpleRestClient(GET_LIST,'cameras',{sort: { field: 'name', order: 'DESC' }})
            .then(response =>response.data)
            .then(cameras=> this.setState({
                cameraList:cameras
            }));
    }
    render() {
        const {cameraList} = this.state;
        return(
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <Main style={styles.main} />
                </div>
                <div style={styles.rightCol}>
                    <LeftLayout title="摄像头列表" data={[{name:'test1',type:'0',status:'df'},{name:'test2',type:'`',status:'dfdd'}]}/>
                </div>

            </div>
        )
    }
}

export default withWidth()(Dashboard)