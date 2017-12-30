import React from 'react';
import Icon from 'material-ui/svg-icons/action/chrome-reader-mode';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';

import LinkToEventVideo from './LinkToEventVideo';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const EventIcon = Icon;

const EventFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const EventList = (props) =>(
    <List {...props} filters={<EventFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="happenTime" label="resources.event.fields.happenTime"/>
            <TextField source="position" label="resources.event.fields.position"/>
            <TextField source="eventType" label="resources.event.fields.eventType"/>
            <TextField source="eventHandler" label="resources.event.fields.eventHandler"/>
            <LinkToEventVideo />
        </Datagrid>
    </List>
);

const EventCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const EventCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<EventCreateToolbar />} defaultValue={{ average_note: 0 }}>
            <TextInput source="happenTime" style={{display:'inline-block'}}/>
            <TextInput source="position" style={{display:'inline-block'}}/>
            <TextInput source="eventType" style={{display:'inline-block'}}/>
            <TextInput source="eventHandler" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const eventTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const EventEdit = ({...props}) =>(
    <Edit title={<eventTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="happenTime" style={{display:'inline-block'}}/>
            <TextInput source="position" style={{display:'inline-block'}}/>
            <TextInput source="eventType" style={{display:'inline-block'}}/>
            <TextInput source="eventHandler" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const eventDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const EventDelete = (props) => <Delete {...props} title={<eventDeleteTitle/>} />;