import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push as pushAction } from 'react-router-redux';
import { Card, CardText } from 'material-ui/Card';
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
import { crudGetList as crudGetListAction } from '../lib/actions/dataActions';
import { changeListParams as changeListParamsAction } from '../lib/actions/listActions';
import translate from '../lib/i18n/translate';
import removeKey from '../lib/util/removeKey';
import defaultTheme from '../defaultTheme';

import {LeftLayout} from './leftLayout';
import RightLayout from './rightLayout';
import Background from '../../static/img/background.bmp';

const styles = {
    noResults: { padding: 20 },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    flex: {display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch'},
    leftCol: {marginBottom: '2em', flex: '10 1 auto'},
    rightCol: {
        flex: '1 0 auto',
        width: 200
    }
};

export class PerimeterList extends Component {
    constructor(props) {
        super(props);
        this.state = { key: 0 };
    }

    canvasElement = null;
    ctx = null;
    prePoint = null
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
        this.ctx.scale(0.9, 0.9);

        function mousePos(e) {//获取鼠标所在位置的坐标，相对于整个页面
            var e = e || window.event;
            return {
                x: e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: e.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        }
        $('canvas').mousedown((e) =>{
            if(e.which == 3){
                console.log('right');
            }
            var rect = canvas.getBoundingClientRect();

            let x = mousePos(e).x - rect.left;
            let y = mousePos(e).y - rect.top;
            x = Math.floor(x * (canvas.width / rect.width) / 0.9);
            y = Math.floor(y * (canvas.height / rect.height) / 0.9);

            if(this.prePoint == null){
                this.prePoint = {x:x,y:y};
            }else{
                canCtx.beginPath();
                canCtx.moveTo(this.prePoint.x, this.prePoint.y);
                canCtx.lineWidth = 1.0;
                canCtx.lineCap = "butt";
                canCtx.lineJoin = "miter";
                canCtx.lineTo(x, y);
                canCtx.strokeStyle = '#ff0000';
                canCtx.stroke();
                // canCtx.arc(x, y, 5, 0, Math.PI * 2, true);
                // canCtx.fillStyle = "#ff0000";
                // canCtx.fill();
                this.prePoint = {x:x,y:y}
            }
        });
        // $('canvas').mousedown(function(e){
        //     var rect = canvas.getBoundingClientRect();
        //
        //     let x = mousePos(e).x - rect.left;
        //     let y = mousePos(e).y - rect.top;
        //     x = Math.floor(x * (canvas.width / rect.width) / 0.9);
        //     y = Math.floor(y * (canvas.height / rect.height) / 0.9);
        //
        //     if(this.prePoint == null){
        //         this.prePoint.x = x;
        //         this.prePoint.y = y;
        //     }else{
        //         canCtx.beginPath();
        //         canCtx.moveTo(this.prePoint.x, this.prePoint.y);
        //         canCtx.lineWidth = 1.0;
        //         canCtx.lineCap = "butt";
        //         canCtx.lineJoin = "miter";
        //         canCtx.lineTo(x, y);
        //         canCtx.strokeStyle = '#ff0000';
        //         canCtx.stroke();
        //         canCtx.arc(x, y, 5, 0, Math.PI * 2, true);
        //         canCtx.fillStyle = "#ff0000";
        //         canCtx.fill();
        //     }
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
        if (nextProps.data !== this.props.data) {
            this.setState({ key: this.state.key + 1 });
            let perimeterPoints = nextProps.data;

            for(let pp in perimeterPoints){
                this.ctx.moveTo(perimeterPoints[pp].x, perimeterPoints[pp].y);
                this.ctx.arc(perimeterPoints[pp].x, perimeterPoints[pp].y, 5, 0, Math.PI * 2, true);
                this.ctx.fillStyle = "#ff0000";
                this.ctx.fill();
            }
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

    render() {
        const { filters, pagination = <DefaultPagination />, actions = <DefaultActions />, resource, hasCreate, title, data, ids, total, children, isLoading, translate, theme } = this.props;
        const { key } = this.state;
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
                    <LeftLayout canvasRef={e1 => this.canvasElement = e1} style={styles.main}/>
                </div>
                <div style={styles.rightCol}>
                    <RightLayout title="摄像头列表" data={[{name: 'test1', type: '0', status: 'df'}, {
                        name: 'test2',
                        type: '`',
                        status: 'dfdd'
                    }]}/>
                </div>

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
        },
    ),
    translate,
);

export default enhance(PerimeterList);
