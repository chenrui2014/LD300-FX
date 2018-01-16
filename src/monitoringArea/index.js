import React from 'react';
import Icon from 'material-ui/svg-icons/action/visibility';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput,ReferenceInput,SelectInput,NumberInput } from '../lib';
import {translate} from '../lib';
import CameraReferenceField from './cameraReferenceField';
//import PerimeterReferenceField from './perimeterReferenceField';
import HostReferenceField from './hostReferenceField';

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
            <CameraReferenceField allowEmpty linkType={false} />
            <HostReferenceField allowEmpty linkType={false} />
            <TextField source="num" label="resources.monitoringArea.fields.num"/>
            <TextField source="min_dis" label="resources.monitoringArea.fields.min_dis"/>
            <TextField source="max_dis" label="resources.monitoringArea.fields.max_dis"/>
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
        </Datagrid>
    </List>
);

const MonitorAreaCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const MonitorAreaCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<MonitorAreaCreateToolbar />} defaultValue={{ average_note: 0 }}>
            <ReferenceInput  source="hostId" reference="hosts" allowEmpty style={{display:'inline-block'}}>

                <SelectInput source='port' optionText="port" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput  source="cameraId" reference="cameras" allowEmpty style={{display:'inline-block'}}>

                <SelectInput source="ip" optionText="ip" optionValue="id" />
            </ReferenceInput><br/>
            <NumberInput source="num" style={{display:'inline-block'}}/>
            <NumberInput source="min_dis" style={{display:'inline-block'}}/>
            <NumberInput source="max_dis" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const MonitorAreaTitle = ({record}) => record?<TextField source='cameraName'  record={record} style={styles.edit_title}/>:null;

export const MonitorAreaEdit = ({...props}) =>(
    <Edit title={<MonitorAreaTitle/>} {...props}>
        <SimpleForm>
            <ReferenceInput  source="hostId" reference="hosts" allowEmpty style={{display:'inline-block'}}>
                <SelectInput source='port' optionText="port" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput  source="cameraId" reference="cameras" allowEmpty style={{display:'inline-block'}}>
                <SelectInput source="ip" optionText="ip" optionValue="id" />
            </ReferenceInput><br/>
            <NumberInput source="num" style={{display:'inline-block'}}/>
            <NumberInput source="min_dis" style={{display:'inline-block'}}/>
            <NumberInput source="max_dis" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const MonitorAreaDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const MonitorAreaDelete = (props) => <Delete {...props} title={<MonitorAreaDeleteTitle/>} />;