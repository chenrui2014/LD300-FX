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
import {systemConfig,SettingsIcon} from './config';
import {Perimeter} from './perimeter'

import restClient from './restClient';

class App extends Component {
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
                menu={Menu}
                locale="zh"
                messages={translations}
            >
                <Resource name="cameras" create={CameraCreate} list={CameraList} edit={CameraEdit} remove={CameraDelete} icon={CameraIcon} />
                <Resource name="hosts" list={HostList} create={HostCreate} edit={HostEdit} remove={HostDelete} icon={HostIcon} />
                <Resource name="sys_config" list={systemConfig} icon={SettingsIcon} />
                <Resource name="perimeterPoint" list={Perimeter}/>
            </Admin>
        );
    }
}

export default App;
