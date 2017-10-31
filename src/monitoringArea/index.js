import React from 'react';
import Icon from 'material-ui/svg-icons/action/visibility';
import { List,EditButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const MonitorAreaIcon = Icon;

const MonitorAreaFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const MonitorAreaList = (props) =>(
    <List {...props} filters={<MonitorAreaFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="id" />
            <TextField source="MonitorAreaName" label="resources.MonitorAreas.fields.MonitorAreaName"/>
            <TextField source="alias" label="resources.MonitorAreas.fields.alias"/>
            <TextField source="port" label="resources.MonitorAreas.fields.port"/>
            <EditButton />
        </Datagrid>
    </List>
);

const MonitorAreaCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const MonitorAreaCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<MonitorAreaCreateToolbar />} defaultValue={{ average_note: 0 }} validate={(values) => {
            const errors = {};
            ['MonitorAreaName', 'alias'].forEach((field) => {
                if (!values[field]) {
                    errors[field] = ['Required field'];
                }
            });

            if (values.port < 0 || values.port > 5) {
                errors.port = ['Should be between 0 and 5'];
            }

            return errors;
        }}
        >
            <TextInput source="MonitorAreaName"style={{display:'inline-block'}}/>
            <TextInput source="alias"style={{display:'inline-block'}}/>
            <TextInput source="port"style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const MonitorAreaTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const MonitorAreaEdit = (props) =>(
    <Edit title={<MonitorAreaTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="id" style={{display:'inline-block'}}/>
            <TextInput source="MonitorAreaName" style={{display:'inline-block'}}/>
            <TextInput source="alias" style={{display:'inline-block'}}/>
            <TextInput source="port" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const MonitorAreaDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const MonitorAreaDelete = (props) => <Delete {...props} title={<MonitorAreaDeleteTitle/>} />;