import React from 'react';
import Icon from 'material-ui/svg-icons/av/videocam';
import { EditButton,SaveButton,Create,Toolbar,List,Filter,Datagrid,TextField,TextInput,BooleanField,NullableBooleanInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const CameraIcon = Icon;

const CameraFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
        <NullableBooleanInput source="status" defaultValue={true} />
    </Filter>
)
export const CameraList = ({...props}) =>(
    <List {...props} filters={<CameraFilter/>} sort={{field:'name',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="id" />
            <TextField source="name" label="resources.cameras.fields.name"/>
            <TextField source="ip" label="resources.cameras.fields.ip"/>
            <TextField source="type" label="resources.cameras.fields.type"/>
            <TextField source="manufacturer" label="resources.cameras.fields.manufacturer"/>
            <TextField source="Video_protocol" label="resources.cameras.fields.Video_protocol"/>
            <BooleanField source="talkBack" label="resources.cameras.fields.talkBack"/>
            <TextField source="yunTai_protocol" label="resources.cameras.fields.yunTai_protocol"/>
            <BooleanField source="status" label="resources.cameras.fields.status"/>
            <EditButton translate={props.translate}/>
        </Datagrid>
    </List>
);

const CameraCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const CameraCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<CameraCreateToolbar />} defaultValue={{ average_note: 0 }} validate={(values) => {
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
            <TextInput source="name" />
            <TextInput source="ip" />
            <TextInput source="type" />
            <TextInput source="manufacturer" />
            <TextInput source="Video_protocol" />
            <NullableBooleanInput source="talkBack" />
            <TextInput source="yunTai_protocol" />
            <NullableBooleanInput source="status" />
        </SimpleForm>
    </Create>
);


const cameraTitle = (record) => record?<TextField source='name' record={record} style={styles.edit_title}/>:null;

export const CameraEdit = ({...props}) =>(
    <Edit title={<cameraTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <TextInput source="name" style={{display:'inline-block'}}/>
            <TextInput source="ip" style={{display:'inline-block'}}/>
            <TextInput source="type" style={{display:'inline-block'}}/>
            <TextInput source="manufacturer" style={{display:'inline-block'}}/>
            <TextInput source="Video_protocol" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="talkBack" />
            <TextInput source="yunTai_protocol" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="status"/>
        </SimpleForm>
    </Edit>
);

const cameraDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const CameraDelete = (props) => <Delete {...props} title={<cameraDeleteTitle/>} />;