import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import MenuItem from 'material-ui/MenuItem';
import { translate, DashboardMenuItem } from './lib';

import { CameraIcon } from './cameras';
import { HostIcon } from './hosts';
import { SettingsIcon } from './config';
import { PerimeterIcon } from './perimeter';
import { MonitorAreaIcon } from './monitoringArea';
import { PresetIcon } from './preset';
import {PerimetersIcon} from './perimeters';
import {CameraTypeIcon} from './cameraType';
import {VendorIcon} from './vendor';
import {EventIcon} from './event';
import {UserIcon} from './users';

const items = [
    { name: 'pp', icon: <PerimeterIcon /> },
    { name: 'hosts', icon: <HostIcon /> },
    { name: 'cameras', icon: <CameraIcon /> },
    { name: 'preset', icon: <PresetIcon /> },
    { name: 'monitoringArea', icon: <MonitorAreaIcon /> },
    { name: 'event', icon: <EventIcon /> },
    { name: 'user', icon: <UserIcon /> },
    { name: 'config', icon: <SettingsIcon /> },
];

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
    },
};

const Menu = ({ onMenuTap, translate, logout }) => (
    <div style={styles.main}>
        <DashboardMenuItem onTouchTap={onMenuTap} />
        {localStorage.getItem("role") === "superAdmin"?items.map(item => (
            <MenuItem
                key={item.name}
                containerElement={<Link to={`/${item.name}`} />}
                primaryText={translate(`resources.${item.name}.name`, { smart_count: 2 })}
                leftIcon={item.icon}
                onTouchTap={onMenuTap}
            />
        )):localStorage.getItem("role") === "admin"?items.filter((v,i,a) => {
            return v.name !=='user';
        }).map(item => (
            <MenuItem
                key={item.name}
                containerElement={<Link to={`/${item.name}`} />}
                primaryText={translate(`resources.${item.name}.name`, { smart_count: 2 })}
                leftIcon={item.icon}
                onTouchTap={onMenuTap}
            />
        )):items.filter((v,i,a) => {
            return v.name ==='event';
        }).map(item => (
            <MenuItem
                key={item.name}
                containerElement={<Link to={`/${item.name}`} />}
                primaryText={translate(`resources.${item.name}.name`, { smart_count: 2 })}
                leftIcon={item.icon}
                onTouchTap={onMenuTap}
            />
        ))}
    </div>
);

const enhance = compose(
    connect(state => ({
        theme: state.theme,
        locale: state.locale,
    })),
    translate,
);

export default enhance(Menu);
