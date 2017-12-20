import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
import { crudCreate as crudCreateAction } from '../lib/actions/dataActions';
import translate from '../lib/i18n/translate';
import removeKey from '../lib/util/removeKey';
import defaultTheme from '../defaultTheme';

import {LeftLayout} from './leftLayout';
import RightLayout from './rightLayout';
import Background from '../../static/img/background.bmp';

import restClient from '../restClient'
import {GET_LIST} from '../lib';

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
        this.state = { key: 0,data:{},ppData:{name:"",pp:[]},cameraList:{},hostData:[],value:1,open:false,mapPosition:0,mapErrText:"",realPosition:0,realErrText:"",id:0,name:"",num:0,x:0,y:0};
    }

    canvasElement = null;
    ctx = null;
    maxNum = 0;
    name = '';
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
        this.updateData();
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

        // function mousePos(e) {//获取鼠标所在位置的坐标，相对于整个页面
        //     var e = e || window.event;
        //     return {
        //         x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
        //         y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
        //     };
        // }
        $('canvas').mousedown((e) =>{

            var rect = canvas.getBoundingClientRect();

            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            x = Math.floor(x * (canvas.width / rect.width) / 0.88);
            y = Math.floor(y * (canvas.height / rect.height) / 0.66);

            // if(this.prePoint == null){
            //     this.prePoint = {x:x,y:y};
            // }else{
            //     canCtx.beginPath();
            //     canCtx.moveTo(this.prePoint.x, this.prePoint.y);
            //     canCtx.lineWidth = 1.0;
            //     canCtx.lineCap = "butt";
            //     canCtx.lineJoin = "miter";
            //     canCtx.lineTo(x, y);
            //     canCtx.strokeStyle = '#ff0000';
            //     canCtx.stroke();
            //     // canCtx.arc(x, y, 5, 0, Math.PI * 2, true);
            //     // canCtx.fillStyle = "#ff0000";
            //     // canCtx.fill();
            //     this.prePoint = {x:x,y:y}
            // }

            this.setState({open: true,x:x,y:y});
        });

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
                if(p !== 1){
                    this.ctx.lineWidth = 1.0;
                    this.ctx.lineCap = "butt";
                    this.ctx.lineJoin = "miter";
                    this.ctx.lineTo(ppData.pp[p].x, ppData.pp[p].y);
                    this.ctx.strokeStyle = '#ff0000';
                    this.ctx.stroke();
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
        this.setState({ppData:{name:this.name,pp:pp}})
        //record.hostId = this.state.value;//主机ID
        this.handleClose()
    };
    complete = ()=>{
        this.props.crudCreate(this.props.resource, this.state.ppData, this.getBasePath(),'list');
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

    //主机下拉列表选择事件
    //handleChange = (event, index, value) => this.setState({value:value});

    changeParams(action) {
        const newParams = queryReducer(this.getQuery(), action);
        this.props.push({ ...this.props.location, search: `?${stringify({ ...newParams, filter: JSON.stringify(newParams.filter) })}` });
        this.props.changeListParams(this.props.resource, newParams);
    }

    render() {
        const { filters, pagination = <DefaultPagination />,resource, title, data, ids, total, children, isLoading, translate, theme } = this.props;
        const { key,hostData,ppData } = this.state;

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
                    <RightLayout data={data}/>
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
            crudCreate: crudCreateAction
        },
    ),
    translate,
);

export default enhance(PerimeterList);
