import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import { Card, CardHeader,CardMedia,CardTitle,CardText,CardActions } from 'material-ui/Card';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import inflection from 'inflection';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import queryReducer, { SET_SORT, SET_PAGE, SET_FILTER, SORT_DESC } from '../lib/reducer/resource/list/queryReducer';
import ViewTitle from '../lib/mui/layout/ViewTitle';
import Title from '../lib/mui/layout/Title';
import DefaultPagination from '../lib/mui/list/Pagination';
import DefaultActions from '../lib/mui/list/Actions';
import {crudGetList as crudGetListAction, crudUpdate as crudUpdateAction} from '../lib/actions/dataActions';
import { changeListParams as changeListParamsAction } from '../lib/actions/listActions';
import translate from '../lib/i18n/translate';
import removeKey from '../lib/util/removeKey';
import defaultTheme from '../defaultTheme';
import Paper from 'material-ui/Paper';
import {Table,TableBody,TableHeader,TableRow,TableRowColumn,TableHeaderColumn} from 'material-ui/Table';
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem"
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowDownwardIcon from 'material-ui/svg-icons/navigation/arrow-downward';
import ArrowUpwardIcon from 'material-ui/svg-icons/navigation/arrow-upward';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {GET_LIST} from "../lib";
import restClient from "../restClient";
import $ from 'jquery';
import flvjs from 'flv.js';

const styles = {
    noResults: { padding: 20 },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    button:{
        margin: 12,
    },
    flex: {display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch'},
    leftCol: { flex: '10 1 auto'},
    rightCol: {
        flex: '0 0 auto',
        width: 360
    },
    video:{
        width: 600,
        height: 400,
        flex:'2 1 auto'
    },
    option:{
        flex:'1 1 auto',
        marginTop:10
    }
};

export class PresetList extends Component {
    constructor(props) {
        super(props);
        this.state = { key: 0,value:1,currentCam:{},camHandlers:[{id:0,handler:''}],presets:[],cameraList:[],x:0,y:0,z:0,realErrText:''} ;
    }

    presetName = '';
    distance = 0;

    componentWillMount(){
        restClient(GET_LIST,'cameras_noPage',{sort: { field: 'id', order: 'asc' },pagination: { page: 1, perPage: 10000 }})
            .then(response =>response.data)
            .then(cameras=> {
                let demoCam = [];
                if(cameras.length > 0){
                    for(let cam of cameras){
                        if(cam.isDemo){
                            demoCam.push(cam);
                        }
                    }
                }
                this.setState({currentCam:demoCam[0],presets:demoCam[0].preset,cameraList:demoCam})
            });
    }

    componentDidMount() {

        if(this.state.currentCam){

            function play(v,path,port) {
                var flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    isLive: true,
                    enableWorker:true,
                    enableStashBuffer: false,
                    stashInitialSize: 128,
                    autoCleanupSourceBuffer:true,
                    url:'ws://localhost:'+port+path
                },{
                    enableStashBuffer:false
                });
                flvPlayer.attachMediaElement(v);
                flvPlayer.load();
                flvPlayer.play();
            }

            var cameraId = this.state.currentCam;

            $.ajax({
                url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
                dataType:'json',
                success:function (data) {
                    if($("#" + cameraId).children("video").length > 0){
                        return;
                    }
                    play($('<video></video>').prop('class','v'+cameraId).appendTo('#'+cameraId)[0],data.path,data.port);
                }
            });
        }
    }

    // componentDidUpdate(){
    //     function play(v,path,port) {
    //         var flvPlayer = flvjs.createPlayer({
    //             type: 'flv',
    //             isLive: true,
    //             enableWorker:true,
    //             enableStashBuffer: false,
    //             stashInitialSize: 128,
    //             autoCleanupSourceBuffer:true,
    //             url:'ws://localhost:'+port+path
    //         },{
    //             enableStashBuffer:false
    //         });
    //         flvPlayer.attachMediaElement(v);
    //         flvPlayer.load();
    //         flvPlayer.play();
    //     }
    //
    //     var cameraId = this.state.value;
    //
    //     $.ajax({
    //         url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
    //         dataType:'json',
    //         success:function (data) {
    //             if($("#" + cameraId).children("video").length > 0){
    //                 return;
    //             }
    //             play($('<video></video>').prop('class','v'+cameraId).appendTo('#'+cameraId)[0],data.path,data.port);
    //         }
    //     });
    // }

    componentWillReceiveProps(nextProps) {
        if (nextProps.resource !== this.props.resource
            || nextProps.query.sort !== this.props.query.sort
            || nextProps.query.order !== this.props.query.order
            || nextProps.query.page !== this.props.query.page
            || nextProps.query.filter !== this.props.query.filter) {
            this.updateData(Object.keys(nextProps.query).length > 0 ? nextProps.query : nextProps.params);
        }
        if (nextProps.data !== this.props.data && this.fullRefresh) {
            this.fullRefresh = false;
            this.setState({ key: this.state.key + 1 });
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

    changeParams(action) {
        const newParams = queryReducer(this.getQuery(), action);
        this.props.push({ ...this.props.location, search: `?${stringify({ ...newParams, filter: JSON.stringify(newParams.filter) })}` });
        this.props.changeListParams(this.props.resource, newParams);
    }

    handleChange = (event, index, value) => {

        this.setState({value:value,currentCam:this.state.cameraList[index],presets:this.state.cameraList[index].preset});

        function play(v,path,port) {
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
                enableWorker:true,
                enableStashBuffer: false,
                stashInitialSize: 128,
                autoCleanupSourceBuffer:true,
                url:'ws://localhost:'+port+path
            },{
                enableStashBuffer:false
            });
            flvPlayer.attachMediaElement(v);
            flvPlayer.load();
            flvPlayer.play();
        }

        var cameraId = value;

        $.ajax({
            url:'http://localhost:3000/ipc/' + cameraId + '/live'+'?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                $("#" + cameraId).empty();
                play($('<video></video>').prop('class','v'+cameraId).appendTo('#'+cameraId)[0],data.path,data.port);
            }
        });
    }

    flag = true;
    currentCode = 0;
    handlePtz = (code,e) =>{
        var handle='';
        for(let camHandler of this.state.camHandlers){
            if(camHandler.id === this.state.value){
                handle=camHandler.handler;
            }
        }
        let _this = this;
        //var stop='';
        if(code === this.currentCode && !this.flag){
            $.ajax({
                url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/ptzStop?stop=1'+'&handle='+handle+'&t='+new Date().getTime(),
                dataType:'json',
                success:function (data) {
                    for(let camHandler of _this.state.camHandlers){
                        if(camHandler.id === _this.state.value){
                            camHandler.handler = data.handle;
                        }
                    }
                    console.log(JSON.stringify(data));
                }
            });
            this.flag=true;
        }else{
            this.currentCode = code;
            $.ajax({
                url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/move?position='+code+'&stop=1'+'&handle='+handle+'&t='+new Date().getTime(),
                dataType:'json',
                success:function (data) {
                    for(let camHandler of _this.state.camHandlers){
                        if(camHandler.id === _this.state.value){
                            camHandler.handler = data.handle;
                        }
                    }
                    console.log(JSON.stringify(data));
                }
            });
            this.flag=false;
        }
    };

    getPoint = (e)=>{
        let _this = this;
        $.ajax({
            url:'http://localhost:3000/ipc/'+this.state.value+'/ptz/getPoint?t='+new Date().getTime(),
            dataType:'json',
            success:function (data) {
                _this.setState({x:data.x?data.x:0,y:data.y?data.y:0,z:data.z?data.z:0});
                console.log(JSON.stringify(data));
            }
        });
    };
    save=()=>{
        let record = this.state.currentCam;
        let presets = record.preset;
        let preset = {};
        preset.x = this.state.x;
        preset.y = this.state.y;
        preset.z = this.state.z;
        preset.preset = this.presetName;
        preset.distance = this.distance;
        presets.push(preset);
        record.preset = presets;
        this.props.crudUpdate('cameras', record.id, record, record, this.getBasePath(), 'list');
    }
    handleChange4 = (event) => {
        this.presetName =  event.target.value;
    };
    handleChange5 = (event) => {
        const regex = /^[0-9]\d*$/;
        if(!regex.test(event.target.value)){
            this.setState({
                realErrText: "请输入数字",
            });
            return;
        }else{
            this.setState({
                realErrText: "",
            });
        }
        this.distance =  event.target.value;
    };

    render() {
        const { filters, pagination = <DefaultPagination />, actions = <DefaultActions />, resource, hasCreate, title, data, ids, total, children, isLoading, translate, theme } = this.props;
        const { key,value,cameraList,presets } = this.state;
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

        return (
            <div style={styles.flex}>
                <div style={styles.leftCol}>
                    <Card>
                        <CardHeader>
                            <SelectField floatingLabelText="摄像头"
                                         value={this.state.value}
                                         onChange={this.handleChange}>
                                {
                                    cameraList.map((camera,i) =>{
                                        return <MenuItem key={i} value={camera.id} primaryText={camera.ip} />
                                    })
                                }

                            </SelectField>
                        </CardHeader>
                        <CardMedia>
                            <div style={styles.video} id={value} >
                            </div>
                        </CardMedia>
                        <CardTitle title="摄像头操作"/>
                        <CardText>

                        </CardText>
                        <CardActions>
                            <div style={styles.option}>
                                <IconButton tooltip="向左"><ArrowBackIcon onClick={this.handlePtz.bind(this,1)} /></IconButton>
                                <IconButton tooltip="向下"><ArrowDownwardIcon onClick={this.handlePtz.bind(this,2)} /></IconButton>
                                <IconButton tooltip="向上"><ArrowUpwardIcon onClick={this.handlePtz.bind(this,3)} /></IconButton>
                                <IconButton tooltip="向右"><ArrowForwardIcon onClick={this.handlePtz.bind(this,4)} /></IconButton>
                            </div>
                            <div>
                                <TextField hintText="x" value={this.state.x} disabled={true}/>
                                <TextField hintText="y" value={this.state.y} disabled={true}/>
                                <TextField hintText="z" value={this.state.z} disabled={true}/>
                                <RaisedButton label="获得ptz坐标" style={styles.button} onClick={this.getPoint.bind(this)} />
                                <TextField
                                    hintText="预置点名称" onChange={this.handleChange4}
                                />
                                <TextField
                                    hintText="距离" errorText={this.state.realErrText} onChange={this.handleChange5}
                                />
                                <RaisedButton label="设置预置点" style={styles.button} onClick={this.save.bind(this)}/>
                            </div>
                        </CardActions>
                    </Card>
                </div>
                <Paper style={styles.rightCol}>
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {
                                    ['预置点名称','x','y','z','距离'].map((text,i) =>{
                                        return <TableHeaderColumn key={i}>{text}</TableHeaderColumn>
                                    })
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                presets.length > 0?presets.map((item,i)=>{
                                    return <TableRow key={i}>
                                        <TableRowColumn>{item.name}</TableRowColumn>
                                        <TableRowColumn>{item.x}</TableRowColumn>
                                        <TableRowColumn>{item.y}</TableRowColumn>
                                        <TableRowColumn>{item.z}</TableRowColumn>
                                        <TableRowColumn>{item.distance}</TableRowColumn>
                                    </TableRow>
                                }):<div>该摄像头还没有设置预置点</div>
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

PresetList.propTypes = {
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

PresetList.defaultProps = {
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
            crudUpdate: crudUpdateAction,
            push: pushAction,
        },
    ),
    translate,
);

export default enhance(PresetList);
