import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiAppBar from 'material-ui/AppBar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import compose from 'recompose/compose';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/MenuItem';
import { toggleSidebar as toggleSidebarAction } from '../../actions';

import { userLogout as userLogoutAction } from '../../actions/authActions';

const Logged = (props) => (
    <IconMenu
        {...props}
        iconButtonElement={
            <IconButton><MoreVertIcon /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
        <MenuItem primaryText="事件" onClick={props.logout} />
        <MenuItem primaryText="帮助" onClick={props.logout} />
        <MenuItem primaryText="退出"  onClick={props.logout} />
    </IconMenu>
);

Logged.muiName = 'IconMenu';

const AppBar = ({ title, toggleSidebar,userLogout }) => (
    <MuiAppBar
        title={title}
        onLeftIconButtonTouchTap={toggleSidebar}
        iconElementRight={<Logged logout={userLogout}/>}
    />
);

AppBar.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    muiThemeable(),
    connect(null, {
        toggleSidebar: toggleSidebarAction,
        userLogout: userLogoutAction
    }),
);

export default enhance(AppBar);
