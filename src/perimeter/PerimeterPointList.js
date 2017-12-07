/**
 * Created by chen on 17-8-27.
 */
import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {List, ListItem} from 'material-ui/List';
import PerimeterPointItem from './CameraItem';

class PerimeterPointList extends Component{
    constructor(props){
        super(props)

    }
    handleSelect(val){

        this.props.handleCamera(val);
    }

    render(){
        const data = this.props;
        let ppData = [];
        const temp = data.data;
        if(temp){
            for(let i = 0; i < temp.length;i++){
                ppData[i] = temp[i];
            }
        }

        return(
            <List>
                {ppData.map((pp,i)=>{
                    return <ListItem  key={i}><PerimeterPointItem handleSelect={this.handleSelect.bind(this)} data={pp}/></ListItem>
                })}

            </List>
        )
    }
}

PerimeterPointList.propTypes={
    style:PropTypes.object,
    data:PropTypes.object.isRequired
}

export default PerimeterPointList;