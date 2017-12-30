import React from 'react';
// import {SimpleForm,TextInput} from '../lib';
import Icon from 'material-ui/svg-icons/action/settings';
import { Card, CardText } from 'material-ui/Card';

import { EditButton,SaveButton,Create,Toolbar,List,Filter,Datagrid,TextField,TextInput,BooleanField,NullableBooleanInput,Edit,SimpleForm,Delete,DisabledInput,DeleteButton } from '../lib';
export const SettingsIcon = Icon;
// export const systemConfig = (props)=>(
//     <Card>
//         <CardText>
//             <SimpleForm>
//                 <TextInput label="resources.sys_config.sys_name" source="sys_name" style={{display:'inline-block'}}/>
//                 <TextInput label="resources.sys_config.support_phone" source="support_phone" style={{display:'inline-block'}}/>
//                 <TextInput label="resources.sys_config.support_phone" source="support_phone" style={{display:'inline-block'}}/>
//             </SimpleForm>
//         </CardText>
//     </Card>
// )

export const ConfigList = ({...props}) =>(
    <List {...props} sort={{field:'configDate',order:'DESC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="sysName" label="resources.config.fields.sysName"/>
            <TextField source="company" label="resources.config.fields.company"/>
            <TextField source="telephone" label="resources.config.fields.telephone"/>
            <TextField source="useUnit" label="resources.config.fields.useUnit"/>
            <EditButton translate={props.translate}/>
        </Datagrid>
    </List>
);

export const ConfigEdit = ({...props}) =>(
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="sysName" style={{display:'inline-block'}}/>
            <TextInput source="company" style={{display:'inline-block'}}/><br/>
            <TextInput source="telephone" style={{display:'inline-block'}}/>
            <TextInput source="useUnit" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);