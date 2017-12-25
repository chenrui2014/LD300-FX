import React from 'react';
import Icon from 'material-ui/svg-icons/av/video-call';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const CameraTypeIcon = Icon;

const CameraTypeFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const CameraTypeList = (props) =>(
    <List {...props} filters={<CameraTypeFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="typeName" label="resources.cameraType.fields.typeName"/>
            <TextField source="typeCode" label="resources.cameraType.fields.typeCode"/>
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
        </Datagrid>
    </List>
);

const CameraTypeCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const CameraTypeCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<CameraTypeCreateToolbar />} defaultValue={{ average_note: 0 }}>
            <TextInput source="typeName" style={{display:'inline-block'}}/>
            <TextInput source="typeCode" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const cameraTypeTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const CameraTypeEdit = ({...props}) =>(
    <Edit title={<cameraTypeTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="typeName" style={{display:'inline-block'}}/>
            <TextInput source="typeCode" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const cameraTypeDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const CameraTypeDelete = (props) => <Delete {...props} title={<cameraTypeDeleteTitle/>} />;