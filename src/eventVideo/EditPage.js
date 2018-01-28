import React from 'react'
import {render} from 'react-dom';
import Reflv from 'reflv';
const staticServer = "http://localhost:8088";
export default EditPage = (data)=>(<Reflv url={staticServer+data.path} type='flv'> </Reflv>);