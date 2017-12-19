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

const items = [
    { name: 'cameras', icon: <CameraIcon /> },
    { name: 'hosts', icon: <HostIcon /> },
    { name: 'monitoringArea', icon: <MonitorAreaIcon /> },
    { name: 'preset', icon: <PresetIcon /> },
    { name: 'perimeterPoint', icon: <PerimeterIcon /> },
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
        {items.map(item => (
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
