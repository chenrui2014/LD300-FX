import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import inflection from 'inflection';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import queryReducer, { SET_SORT, SET_PAGE, SET_FILTER, SORT_DESC } from '../lib/reducer/resource/list/queryReducer';
import Title from '../lib/mui/layout/Title';
import DefaultPagination from '../lib/mui/list/Pagination';
import { crudGetList as crudGetListAction } from '../lib/actions/dataActions';
import { changeListParams as changeListParamsAction } from '../lib/actions/listActions';
import { crudCreate as crudCreateAction,crudDelete as crudDeleteAction } from '../lib/actions/dataActions';
import translate from '../lib/i18n/translate';
import removeKey from '../lib/util/removeKey';
import defaultTheme from '../defaultTheme';

import {LeftLayout} from './leftLayout';
import Background from '../../static/img/background.bmp';
import {Table,TableBody,TableHeader,TableRow,TableRowColumn,TableHeaderColumn} from 'material-ui/Table';
import DeleteIcon from 'material-ui/svg-icons/action/highlight-off';

import restClient from '../restClient'
import {GET_LIST} from '../lib';
import {red500} from "material-ui/styles/colors";

const styles = {
    noResults: { padding: 20 },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    flex: {display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch'},
    leftCol: { flex: '10 1 auto'},
    rightCol: {
        flex: '0 0 auto',
        width: 360
    }
};

export class PerimeterList extends Component {
    constructor(props) {
        super(props);
        this.state = { key: 0,data:{},ppData:{name:"",pp:[]},ppList:[],cameraList:{},hostData:[],value:1,open:false,mapPosition:0,mapErrText:"",realPosition:0,realErrText:"",id:0,name:"",num:0,x:0,y:0};
    }

    canvasElement = null;
    ctx = null;
    maxNum = 0;
    maxDis = 0;
    name = '';
    perimeterPointData={}
    //prePoint = null

    componentWillMount(){

        restClient(GET_LIST,'cameras_noPage',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(cameras=> this.setState({
                cameraList:cameras
            }));

        restClient(GET_LIST,'hosts_noPage',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(hosts=> {
                let hostData = [];
                for(let hp in hosts){
                    hostData.push(hosts[hp]);
                }

                this.setState({
                    hostData:hostData
                })

            });

    }

    componentDidMount() {
        //this.updateData();
        if (Object.keys(this.props.query).length > 0) {
            this.props.changeListParams(this.props.resource, this.props.query);
        }

        //let canvas = document.getElementById("canvas"), ctx = canvas.getContext("2d"), img = new Image();
        this.ctx = this.canvasElement.getContext("2d");
        let canvas = this.canvasElement, canCtx = this.ctx,img = new Image();
        //将图片绘制到canvas
        img.src = Background;
        img.onload = function () {
            canCtx.drawImage(img, 0, 0);
        }
        this.ctx.scale(0.88, 0.66);

        restClient(GET_LIST,'pp_noPage',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 1000 }})
            .then(response =>response.data)
            .then(ppList=> {
                this.setState({ppList:ppList});
                this.perimeterPointData = ppList;
                for(let perimeter in ppList){
                    let perimeterPoints = ppList[perimeter].pp;
                    this.ctx.beginPath();
                    this.ctx.moveTo(perimeterPoints[0].x, perimeterPoints[0].y);
                    for(let ppt in perimeterPoints){
                        if(ppt !== "0"){
                            this.ctx.lineWidth = 1.0;
                            this.ctx.lineCap = "butt";
                            this.ctx.lineJoin = "miter";
                            this.ctx.lineTo(perimeterPoints[ppt].x, perimeterPoints[ppt].y);
                            this.ctx.strokeStyle = '#ff0000';
                            this.ctx.stroke();
                        }
                    }
                }
            });

        $(document).on('contextmenu',function(e){
            return false;
        });

        $('canvas').mousedown((e) =>{

            if(3 === e.which){
                //alert(e.which);
                // this.state.ppData.pp.pop();
                // if(this.state.imageHistory.length <=0){
                //     this.state.imageHistory.push(Background);
                // }
                var rect = canvas.getBoundingClientRect();
                this.ctx.clearRect(0, 0, rect.width, rect.height);
                //将图片绘制到canvas
                img.src = Background;
                let _this = this;
                img.onload = async function () {
                    await canCtx.drawImage(img, 0, 0);

                    for(let perimeter in _this.perimeterPointData){
                        let perimeterPoints = _this.perimeterPointData[perimeter].pp;
                        _this.ctx.beginPath();
                        _this.ctx.moveTo(perimeterPoints[0].x, perimeterPoints[0].y);
                        for(let ppot in perimeterPoints){
                            if(ppot !== "0"){
                                _this.ctx.lineWidth = 1.0;
                                _this.ctx.lineCap = "butt";
                                _this.ctx.lineJoin = "miter";
                                _this.ctx.lineTo(perimeterPoints[ppot].x, perimeterPoints[ppot].y);
                                _this.ctx.strokeStyle = '#ff0000';
                                _this.ctx.stroke();
                            }
                        }
                    }

                    let ppData = _this.state.ppData;
                    if(ppData.pp.length > 0){
                        ppData.pp.pop();

                    }
                    if(ppData.pp.length > 1){
                        let len = ppData.pp.length;
                        _this.maxDis = ppData.pp[len-1].realPosition;
                        //     for(let p in ppData.pp){
                        //         this.setState({x:ppData.pp[p].x,y:ppData.pp[p].y});
                        //     }
                        // }
                        _this.ctx.beginPath();
                        _this.ctx.moveTo(ppData.pp[0].x, ppData.pp[0].y);
                        for(let p in ppData.pp){
                            this.maxNum = ppData.pp[p].No;
                            if(p !== "0"){
                                _this.ctx.lineWidth = 1.0;
                                _this.ctx.lineCap = "butt";
                                _this.ctx.lineJoin = "miter";
                                _this.ctx.lineTo(ppData.pp[p].x, ppData.pp[p].y);
                                _this.ctx.strokeStyle = '#ff0000';
                                _this.ctx.stroke();

                                // var rect= this.canvasElement.getBoundingClientRect();
                                // this.state.imageHistory.push(this.ctx.getImageData(0,0,rect.width,rect.height));
                            }

                        }
                        _this.state.num = _this.maxNum;
                    }else{
                        if(ppData.pp.length > 0){
                            ppData.pp.pop();

                        }
                        _this.maxDis = 0;
                        _this.setState({ppData:{pp:[]}});
                    }
                }
                //this.ctx.scale(0.88, 0.66);
                //

                //this.ctx.putImageData(this.state.imageHistory.pop(),0,0,0,0,rect.width,rect.height);

            }else{
                var rect = canvas.getBoundingClientRect();

                let x = e.clientX - rect.left;
                let y = e.clientY - rect.top;
                x = Math.floor(x * (canvas.width / rect.width) / 0.88);
                y = Math.floor(y * (canvas.height / rect.height) / 0.66);

                this.setState({open: true,x:x,y:y});
            }

        });

        // $('canvas').hover((e) =>{
        //     var rect = canvas.getBoundingClientRect();
        //
        //     let x = e.clientX - rect.left;
        //     let y = e.clientY - rect.top;
        //     x = Math.floor(x * (canvas.width / rect.width) / 0.88);
        //     y = Math.floor(y * (canvas.height / rect.height) / 0.66);
        //
        //
        // });

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resource !== this.props.resource
         || nextProps.query.sort !== this.props.query.sort
         || nextProps.query.order !== this.props.query.order
         || nextProps.query.page !== this.props.query.page
         || nextProps.query.filter !== this.props.query.filter) {
            this.updateData(Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params);
        }
        // if (nextProps.data !== this.props.data) {
        //     this.setState({ key: this.state.key + 1,data:nextProps.data });
        //     let perimeterPoints = nextProps.data;
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(perimeterPoints[1].x, perimeterPoints[1].y);
        //     for(let pp in perimeterPoints){
        //         this.maxNum = perimeterPoints[pp].No;
        //         if(pp !== 1){
        //             this.ctx.lineWidth = 1.0;
        //             this.ctx.lineCap = "butt";
        //             this.ctx.lineJoin = "miter";
        //             this.ctx.lineTo(perimeterPoints[pp].x, perimeterPoints[pp].y);
        //             this.ctx.strokeStyle = '#ff0000';
        //             this.ctx.stroke();
        //         }
        //
        //     }
        //
        //     this.state.num = this.maxNum;
        // }
    }

    componentWillUpdate(){
        let ppData = this.state.ppData;
        if(ppData.pp.length > 0){
            this.ctx.beginPath();
            this.ctx.moveTo(ppData.pp[0].x, ppData.pp[0].y);
            for(let p in ppData.pp){
                this.maxNum = ppData.pp[p].No;
                if(p !== "0"){
                    this.ctx.lineWidth = 1.0;
                    this.ctx.lineCap = "butt";
                    this.ctx.lineJoin = "miter";
                    this.ctx.lineTo(ppData.pp[p].x, ppData.pp[p].y);
                    this.ctx.strokeStyle = '#ff0000';
                    this.ctx.stroke();

                    // var rect= this.canvasElement.getBoundingClientRect();
                    // this.state.imageHistory.push(this.ctx.getImageData(0,0,rect.width,rect.height));
                }

            }
            this.state.num = this.maxNum;
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isLoading === this.props.isLoading
         && nextProps.width === this.props.width
         && nextState === this.state) {
            return false;
        }
        return true;
    }

    getBasePath() {
        return this.props.location.pathname;
    }

    refresh = (event) => {
        event.stopPropagation();
        this.fullRefresh = true;
        this.updateData();
    }

    getQuery() {
        const query = Object.keys(this.props.query).length > 0 ? this.props.query : { ...this.props.params };
        if (!query.sort) {
            query.sort = this.props.sort.field;
            query.order = this.props.sort.order;
        }
        if (!query.perPage) {
            query.perPage = this.props.perPage;
        }
        return query;
    }

    updateData(query) {
        const params = query || this.getQuery();
        const { sort, order, page, perPage, filter } = params;
        const pagination = { page: parseInt(page, 10), perPage: parseInt(perPage, 10) };
        const permanentFilter = this.props.filter;
        this.props.crudGetList(this.props.resource, pagination, { field: sort, order }, { ...filter, ...permanentFilter });
    }

    setSort = sort => this.changeParams({ type: SET_SORT, payload: sort });

    setPage = page => this.changeParams({ type: SET_PAGE, payload: page });

    setFilters = filters => this.changeParams({ type: SET_FILTER, payload: filters });

    showFilter = (filterName, defaultValue) => {
        this.setState({ [filterName]: true });
        if (typeof defaultValue !== 'undefined') {
            this.setFilters({ ...this.props.filterValues, [filterName]: defaultValue });
        }
    }

    hideFilter = (filterName) => {
        this.setState({ [filterName]: false });
        const newFilters = removeKey(this.props.filterValues, filterName);
        this.setFilters(newFilters);
    }

    handleClose = () => {
        this.setState({open: false,id:0,name:"",num:this.maxNum,mapPosition:0,realPosition:0,x:0,y:0});
    };
    //保存周界点
    save = ()=>{
        let maxDisInt = Number.parseInt(this.maxDis);
        let realP = Number.parseInt(this.state.realPosition);
        if( maxDisInt > realP){
            this.setState({
                realErrText: "输入的实际距离必须大于上一个点[" + maxDisInt + "]",
            });
            return;
        }
        let record = {mapPosition:0,realPosition:0};
        record.mapPosition = 0;
        record.realPosition = this.state.realPosition;
        //record.name = this.state.name;
        let No = this.maxNum + 1;
        record.No = No;

        record.x = this.state.x;
        record.y = this.state.y;
        let pp = this.state.ppData.pp;
        pp.push(record);
        this.maxDis = this.state.realPosition;
        this.setState({ppData:{name:this.name,pp:pp}})
        //record.hostId = this.state.value;//主机ID
        this.handleClose()
    };
    complete = ()=>{
        //先保存当前周界点
        let maxDisInt = Number.parseInt(this.maxDis);
        let realP = Number.parseInt(this.state.realPosition);
        if( maxDisInt > realP){
            this.setState({
                realErrText: "输入的实际距离必须大于上一个点[" + maxDisInt + "]",
            });
            return;
        }
        let record = {mapPosition:0,realPosition:0};
        record.mapPosition = 0;
        record.realPosition = this.state.realPosition;
        //record.name = this.state.name;
        let No = this.maxNum + 1;
        record.No = No;

        record.x = this.state.x;
        record.y = this.state.y;
        let pp = this.state.ppData.pp;
        pp.push(record);
        this.maxDis = this.state.realPosition;
        this.setState({ppData:{name:this.name,pp:pp}});

        //向后台发送请求完成周界创建
        this.props.crudCreate(this.props.resource, this.state.ppData, this.getBasePath(),'list');
        //更新右侧周界列表
        let list = this.state.ppList;
        list.push(this.state.ppData);
        this.setState({ppList:list});
        //清空保存的周界点数据
        this.setState({ppData:{name:"",pp:[]}});
        this.handleClose()
    };
    handleChange2 = (event) => {
        const regex = /^[1-9]\d*$/;
        if(!regex.test(event.target.value)){
            this.setState({
                realErrText: "请输入数字",
            });
        }else{
            this.setState({
                realErrText: "",
            });
        }
        this.setState({
            realPosition: event.target.value,
        });
    };
    handleChange4 = (event) => {
        this.name = event.target.value;
        this.setState({
            name: event.target.value,
        });
    };

    handleClick = (i,e) => {

        let record = this.state.ppList;

        this.props.crudDelete('perimeter', record[i].id, this.getBasePath());
        record.splice(i,1);
        this.setState({ppList:record});

        let canvas = this.canvasElement, canCtx = this.ctx,img = new Image();

        var rect = canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        //将图片绘制到canvas
        img.src = Background;
        let _this = this;
        img.onload = async function () {
            await canCtx.drawImage(img, 0, 0);

            for (let perimeter in record) {
                let perimeterPoints = record[perimeter].pp;
                _this.ctx.beginPath();
                _this.ctx.moveTo(perimeterPoints[0].x, perimeterPoints[0].y);
                for (let ppot in perimeterPoints) {
                    if (ppot !== "0") {
                        _this.ctx.lineWidth = 1.0;
                        _this.ctx.lineCap = "butt";
                        _this.ctx.lineJoin = "miter";
                        _this.ctx.lineTo(perimeterPoints[ppot].x, perimeterPoints[ppot].y);
                        _this.ctx.strokeStyle = '#ff0000';
                        _this.ctx.stroke();
                    }
                }
            }
        }

    };

    //主机下拉列表选择事件
    //handleChange = (event, index, value) => this.setState({value:value});

    changeParams(action) {
        const newParams = queryReducer(this.getQuery(), action);
        this.props.push({ ...this.props.location, search: `?${stringify({ ...newParams, filter: JSON.stringify(newParams.filter) })}` });
        this.props.changeListParams(this.props.resource, newParams);
    }

    render() {
        const { filters, pagination = <DefaultPagination />,resource, title, data, ids, total, children, isLoading, translate, theme } = this.props;
        const { key,hostData,ppData,ppList } = this.state;

        // for(let i = 0; i < hostList.length;i++){
        //     hostData[i] = hostList.data[i];
        // }

        const hasCreate = true;
        const query = this.getQuery();
        const filterValues = query.filter;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 2,
            _: inflection.humanize(inflection.pluralize(resource)),
        });
        const defaultTitle = translate('aor.page.list', { name: `${resourceName}` });
        const titleElement = <Title title={title} defaultTitle={defaultTitle} />;
        const muiTheme = getMuiTheme(theme);
        const prefix = autoprefixer(muiTheme);

        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label="确定"
                primary={true}
                keyboardFocused={true}
                onClick={this.save}
            />,
            <FlatButton
                label="完成周界绘制"
                primary={true}
                keyboardFocused={true}
                onClick={this.complete}
            />,
        ];

        return (
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <LeftLayout canvasRef={e1 => this.canvasElement = e1} style={styles.main}/>
                </div>
                <Paper style={styles.rightCol}>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {
                                    ['周界名称','操作'].map((text,i) =>{
                                        return <TableHeaderColumn style={{textAlign: 'center'}}>{text}</TableHeaderColumn>
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                ppList.map((item,i)=>{
                                    return <TableRow>
                                        <TableRowColumn style={{textAlign: 'center'}}>{item.name}</TableRowColumn>
                                        <TableRowColumn style={{textAlign: 'center'}}><FlatButton icon={<DeleteIcon color={red500} />} onClick={this.handleClick.bind(this, i)} /></TableRowColumn>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </Paper>
                <Dialog
                    title="设置周界点"
                    actions={actions}
                    modal={true}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >{
                    ppData.pp.length === 0? <TextField
                    hintText="名称"
                    value={this.state.name}
                    onChange={this.handleChange4}
                    />:<br/>
                }
                    <TextField
                        hintText="输入实际距离"
                        value={this.state.realPosition}
                        errorText={this.state.realErrText}
                        onChange={this.handleChange2}
                    /><br />

                </Dialog>

            </div>
        );
    }
}

PerimeterList.propTypes = {
    title: PropTypes.any,
    filter: PropTypes.object,
    filters: PropTypes.element,
    pagination: PropTypes.element,
    actions: PropTypes.element,
    perPage: PropTypes.number.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.string,
    }),
    changeListParams: PropTypes.func.isRequired,
    crudGetList: PropTypes.func.isRequired,
    crudCreate: PropTypes.func.isRequired,
    data: PropTypes.object,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool.isRequired,
    ids: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    translate: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
};

PerimeterList.defaultProps = {
    filter: {},
    filterValues: {},
    perPage: 10,
    sort: {
        field: 'id',
        order: SORT_DESC,
    },
    theme: defaultTheme,
};

const getLocationSearch = props => props.location.search;
const getQuery = createSelector(
    getLocationSearch,
    (locationSearch) => {
        const query = parse(locationSearch);
        if (query.filter && typeof query.filter === 'string') {
            query.filter = JSON.parse(query.filter);
        }
        return query;
    },
);

function mapStateToProps(state, props) {
    const resourceState = state.admin[props.resource];
    return {
        query: getQuery(props),
        params: resourceState.list.params,
        ids: resourceState.list.ids,
        total: resourceState.list.total,
        data: resourceState.data,
        isLoading: state.admin.loading > 0,
        filterValues: resourceState.list.params.filter,
    };
}

const enhance = compose(
    connect(
        mapStateToProps,
        {
            crudGetList: crudGetListAction,
            changeListParams: changeListParamsAction,
            push: pushAction,
            crudCreate: crudCreateAction,
            crudDelete:crudDeleteAction
        },
    ),
    translate,
);

export default enhance(PerimeterList);
