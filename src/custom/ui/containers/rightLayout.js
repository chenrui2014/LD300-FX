import React,{Component} from 'react';
import PropTypes from 'prop-types';

import {Tab,Tabs} from 'material-ui/Tabs';
import {Table,TableBody,TableHeader,TableRow,TableRowColumn,TableHeaderColumn,TableFooter} from 'material-ui/Table';

export default class RightLayout extends Component{

    state = {
        hostSelected: [1],
        cameraSelected:[1]
    };

    constructor(...args){
        super(...args)
    }


    handleHostSelection = (selectedRows) => {
        this.setState({
            hostSelected: selectedRows,
        });

    };
    handleCameraSelection = (selectedRows) => {
        this.setState({
            cameraSelected: selectedRows,
        });
        this.props.handleStream(this.props.cameraData[selectedRows[0]])
    };

    render(){
        const {hostData,cameraData} = this.props;
        return(
            <Tabs>
                <Tab label="主机列表"><Table onRowSelection={this.handleHostSelection}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>主机名称</TableHeaderColumn>
                            <TableHeaderColumn>主机端口</TableHeaderColumn>
                            <TableHeaderColumn>主机状态</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            hostData.map((host,i)=>{
                                return <TableRow selected={this.isSelected(i)}>
                                    <TableRowColumn>host.hostName</TableRowColumn>
                                    <TableRowColumn>host.port</TableRowColumn>
                                    <TableRowColumn>host.status</TableRowColumn>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table></Tab>
                <Tab label="摄像头列表"><Table onRowSelection={this.handleCameraSelection}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>摄像头名称</TableHeaderColumn>
                            <TableHeaderColumn>摄像头ip</TableHeaderColumn>
                            <TableHeaderColumn>摄像头状态</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            cameraData.map((camera,i)=>{
                                return <TableRow selected={this.isSelected(i)}>
                                    <TableRowColumn>camera.name</TableRowColumn>
                                    <TableRowColumn>camera.ip</TableRowColumn>
                                    <TableRowColumn>camera.status</TableRowColumn>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table></Tab>
            </Tabs>
        );
    }
}

RightLayout.propTypes={
    hostData:PropTypes.array.isRequired,
    cameraData:PropTypes.array.isRequired,
    handleStream:PropTypes.func.isRequired
}