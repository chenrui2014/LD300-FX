import 'babel-polyfill';
import React, { Component } from 'react';
import { Admin, Delete, Resource } from './lib';

import './App.css';

import authClient from './authClient';
import Menu from './Menu';
import { Dashboard } from './custom/ui/dashboard';
import translations from './i18n';
import Login from './Login';

import {CameraList,CameraCreate,CameraEdit,CameraDelete,CameraIcon} from './cameras';
import {HostList,HostCreate,HostEdit,HostDelete,HostIcon} from './hosts';
import {MonitorAreaList,MonitorAreaCreate,MonitorAreaEdit,MonitorAreaDelete,MonitorAreaIcon} from './monitoringArea';
import {PresetList,PresetCreate,PresetEdit,PresetDelete,PresetIcon} from './preset';
import {ConfigEdit,ConfigList,SettingsIcon} from './config';
import {PerimeterPointList} from './perimeter';


import restClient from './restClient';
import customSagas from './custom/sagas';
import customReducers from './custom/reducer';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {hostState:{}}
    }
    componentWillMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Admin
                title="LD300监控系统"
                restClient={restClient}
                authClient={authClient}
                dashboard={Dashboard}
                loginPage={Login}
                customSagas={customSagas}
                customReducers={{customReducers:customReducers}}
                menu={Menu}
                locale="zh"
                messages={translations}
            >
                <Resource name="cameras" create={CameraCreate} list={CameraList} edit={CameraEdit} remove={CameraDelete} icon={CameraIcon} />
                <Resource name="hosts" list={HostList} create={HostCreate} edit={HostEdit} remove={HostDelete} icon={HostIcon} />
                <Resource name="monitoringArea" list={MonitorAreaList} create={MonitorAreaCreate} edit={MonitorAreaEdit} remove={MonitorAreaDelete} icon={MonitorAreaIcon} />
                <Resource name="preset" list={PresetList} create={PresetCreate} edit={PresetEdit} remove={PresetDelete} icon={PresetIcon} />
                <Resource name="config" list={ConfigList} edit={ConfigEdit} icon={SettingsIcon} />
                <Resource name="perimeterPoint" list={PerimeterPointList}/>
            </Admin>
        );
    }
}

export default App;
