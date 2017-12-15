import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {loadHostPage}from '../../action';

import {Tab} from 'material-ui/Tabs';
import {Table,TableBody,TableHeader,TableRow,TableRowColumn,TableHeaderColumn,TableFooter} from 'material-ui/Table';

export default class ListTab extends Component{
    state = {
        selected: [1],
    };
    constructor(...args){
        super(...args);
    }

    componentWillMount() {
    }

    isSelected = (index) => {
        return this.state.selected.indexOf(index) !== -1;
    };

    handleHostSelection = (selectedRows)=>{
        this.setState({
            selected: selectedRows,
        });
        let hosts = this.props.data;
        this.props.itemSelect(hosts[selectedRows]);
    }

    render(){
        const {title,header,data} = this.props;
        let temp = Array.isArray(data)?data:[];
        return(
            <Tab label={title}><Table onRowSelection={this.handleHostSelection}>
                <TableHeader>
                    <TableRow>
                        {
                            header.map((text,i) =>{
                                return <TableHeaderColumn>{text}</TableHeaderColumn>
                            })
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        temp.map((item,i)=>{
                            return <TableRow selected={this.isSelected(i)}>
                                    {
                                        Object.keys(item).map((k,j)=>{
                                            if(k === "hostName" || k === "port" || k === "status" || k === "name" || k === "ip"){
                                                return <TableRowColumn>{item[k]}</TableRowColumn>
                                            }

                                        })
                                    }
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table></Tab>
        );
    }
}

ListTab.propTypes={
    title:PropTypes.string.isRequired,
    header:PropTypes.array.isRequired,
    data:PropTypes.object.isRequired,
    itemSelect:PropTypes.func.isRequired
}

// function mapStateToProps(state) {
//     const hosts = state.customReducers.entities.hosts;
//
//     return {
//         hosts: hosts
//     }
// }
//
// export default connect(mapStateToProps, {
//     loadHostPage
// })(ListTab)