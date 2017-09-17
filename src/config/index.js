import React from 'react';
import {SimpleForm,TextInput} from '../lib';
import Icon from 'material-ui/svg-icons/action/settings';
import { Card, CardText } from 'material-ui/Card';

export const SettingsIcon = Icon;
export const systemConfig = (props)=>(
    <Card>
        <CardText>
          <SimpleForm>
            <TextInput label="resources.sys_config.sys_name" source="sys_name" style={{display:'inline-block'}}/>
            <TextInput label="resources.sys_config.support_phone" source="support_phone" style={{display:'inline-block'}}/>
          </SimpleForm>
        </CardText>
    </Card>
)