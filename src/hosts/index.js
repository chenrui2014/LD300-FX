import React from 'react';
import Icon from 'material-ui/svg-icons/hardware/computer';
import { List,EditButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const HostIcon = Icon;

const HostFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const HostList = (props) =>(
    <List {...props} filters={<HostFilter/>} sort={{field:'hostName',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="id" />
            <TextField source="hostName" label="resources.hosts.fields.hostName"/>
            <TextField source="alias" label="resources.hosts.fields.alias"/>
            <TextField source="port" label="resources.hosts.fields.port"/>
            <EditButton />
        </Datagrid>
    </List>
);

const HostCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const HostCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<HostCreateToolbar />} defaultValue={{ average_note: 0 }} validate={(values) => {
            const errors = {};
            ['title', 'teaser'].forEach((field) => {
                if (!values[field]) {
                    errors[field] = ['Required field'];
                }
            });

            if (values.average_note < 0 || values.average_note > 5) {
                errors.average_note = ['Should be between 0 and 5'];
            }

            return errors;
        }}
        >
            <TextInput source="id" />
            <TextInput source="hostName"/>
            <TextInput source="alias"/>
            <TextInput source="port"/>
        </SimpleForm>
    </Create>
);

const hostTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const HostEdit = (props) =>(
    <Edit title={<hostTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="hostName" style={{display:'inline-block'}}/>
            <TextInput source="alias" style={{display:'inline-block'}}/>
            <TextInput source="port" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const hostDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const HostDelete = (props) => <Delete {...props} title={<hostDeleteTitle/>} />;