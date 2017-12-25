import React from 'react';
import Icon from 'material-ui/svg-icons/image/blur-linear';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const PerimeterPointIcon = Icon;

const PerimeterPointFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const PerimeterPointList = (props) =>(
    <List {...props} filters={<PerimeterPointFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="hostName" label="resources.hosts.fields.hostName"/>
            <TextField source="alias" label="resources.hosts.fields.alias"/>
            <TextField source="port" label="resources.hosts.fields.port"/>
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
        </Datagrid>
    </List>
);

const PerimeterPointCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const PerimeterPointCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<PerimeterPointCreateToolbar />} defaultValue={{ average_note: 0 }} validate={(values) => {
            const errors = {};
            ['port'].forEach((field) => {
                if (!values[field]) {
                    errors[field] = ['必填项'];
                }
            });

            return errors;
        }}
        >
            <TextInput source="hostName" style={{display:'inline-block'}}/>
            <TextInput source="alias" style={{display:'inline-block'}}/>
            <TextInput source="port" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const hostTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const PerimeterPointEdit = ({...props}) =>(
    <Edit title={<hostTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="hostName" style={{display:'inline-block'}}/>
            <TextInput source="alias" style={{display:'inline-block'}}/>
            <TextInput source="port" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const hostDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const PerimeterPointDelete = (props) => <Delete {...props} title={<hostDeleteTitle/>} />;