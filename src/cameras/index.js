import React from 'react';
import Icon from 'material-ui/svg-icons/av/videocam';
import { EditButton,DeleteButton,SaveButton,Create,Toolbar,List,Filter,Datagrid,TextField,TextInput,BooleanField,NullableBooleanInput,Edit,SimpleForm,Delete,ReferenceInput,SelectInput,DisabledInput } from '../lib';
import {translate} from '../lib';
import CameraTypeReferenceField from './cameraTypeReferenceField';
import VendorReferenceField from './vendorReferenceField';
import LinkToRelatedPreset from './LinkToRelatedPreset';
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
    <List {...props} filters={<CameraFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="name" label="resources.cameras.fields.name"/>
            <TextField source="ip" label="resources.cameras.fields.ip"/>
            <TextField source="port" label="resources.cameras.fields.port"/>
            <TextField source="user" label="resources.cameras.fields.user"/>
            <CameraTypeReferenceField allowEmpty linkType={false} />
            <VendorReferenceField allowEmpty linkType={false} />
            <BooleanField source="ptz" label="resources.cameras.fields.ptz"/>
            <BooleanField source="alarm" label="resources.cameras.fields.alarm"/>
            <BooleanField source="audio" label="resources.cameras.fields.audio"/>
            <BooleanField source="screenShot" label="resources.cameras.fields.screenShot"/>
            <BooleanField source="status" label="resources.cameras.fields.status"/>
            <LinkToRelatedPreset />
            <EditButton translate={props.translate}/>
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
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
            ['ip', 'port','user','pwd'].forEach((field) => {
                if (!values[field]) {
                    errors[field] = ['必填项'];
                }
            });

            return errors;
        }}
        >
            <TextInput source="name" style={{display:'inline-block'}}/>
            <TextInput source="ip" style={{display:'inline-block'}}/>
            <TextInput source="port" style={{display:'inline-block'}}/><br/>
            <TextInput source="user"style={{display:'inline-block'}}/>
            <TextInput type="password" source="pwd" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="ptz" style={{display:'inline-block'}}/><br/>
            <ReferenceInput source="type" reference="cameraType" allowEmpty>
                <SelectInput source="typeName" optionText="typeName" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput source="brand" reference="vendor" allowEmpty>
                <SelectInput source="vendorName" optionText="vendorName" optionValue="id" />
            </ReferenceInput>

            <NullableBooleanInput source="alarm" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="audio" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="screenShot" style={{display:'inline-block'}}/><br/>
            <TextInput source="onvif_port" style={{display:'inline-block'}}/>
            <TextInput source="onvif_user" style={{display:'inline-block'}}/>
            <TextInput type="password" source="onvif_pwd" style={{display:'inline-block'}}/><br/>
            <TextInput source="onvif_path" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="status" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);


const cameraTitle = (record) => record?<TextField source='name' record={record} style={styles.edit_title}/>:null;

export const CameraEdit = ({...props}) =>(
    <Edit title={<cameraTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="name" style={{display:'inline-block'}}/>
            <TextInput source="ip" style={{display:'inline-block'}}/>
            <TextInput source="port" style={{display:'inline-block'}}/><br/>
            <TextInput source="user" style={{display:'inline-block'}}/>
            <TextInput type="password" source="pwd" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="ptz" style={{display:'inline-block'}}/><br/>
            <ReferenceInput source="type" reference="cameraType" allowEmpty>
                <SelectInput source="typeName" optionText="typeName" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput source="brand" reference="vendor" allowEmpty>
                <SelectInput source="vendorName" optionText="vendorName" optionValue="id" />
            </ReferenceInput>

            <NullableBooleanInput source="alarm" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="audio" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="screenShot" style={{display:'inline-block'}}/><br/>
            <TextInput source="onvif_port" style={{display:'inline-block'}}/>
            <TextInput source="onvif_user" style={{display:'inline-block'}}/>
            <TextInput type="password" source="onvif_pwd" style={{display:'inline-block'}}/><br/>
            <TextInput source="onvif_path" style={{display:'inline-block'}}/>
            <NullableBooleanInput source="status" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const cameraDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const CameraDelete = (props) => <Delete {...props} title={<cameraDeleteTitle/>} />;