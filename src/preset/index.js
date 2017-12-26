import React from 'react';
import Icon from 'material-ui/svg-icons/maps/add-location';
import { EditButton,SaveButton,Create,Toolbar,List,Filter,Datagrid,TextField,TextInput,BooleanField,NullableBooleanInput,Edit,SimpleForm,Delete,DisabledInput,ReferenceInput,SelectInput,NumberInput } from '../lib';
import {translate} from '../lib';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const PresetIcon = Icon;

const PresetFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
        <NullableBooleanInput source="status" defaultValue={true} />
    </Filter>
)
export const PresetList = ({...props}) =>(
    <List {...props} filters={<PresetFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="cameraId" label="resources.preset.fields.cameraId"/>
            <TextField source="x" label="resources.preset.fields.x"/>
            <TextField source="y" label="resources.preset.fields.y"/>
            <TextField source="z" label="resources.preset.fields.z"/>
            <TextField source="preset" label="resources.preset.fields.preset"/>
            <TextField source="distance" label="resources.preset.fields.distance"/>
            <EditButton translate={props.translate}/>
        </Datagrid>
    </List>
);

const PresetCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const PresetCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<PresetCreateToolbar />} defaultValue={{ average_note: 0 }} validate={(values) => {
            const errors = {};
            ['monitorId'].forEach((field) => {
                if (!values[field]) {
                    errors[field] = ['Required field'];
                }
            });

            return errors;
        }}
        >
            <ReferenceInput  source="cameraId" reference="cameras" allowEmpty>
                <SelectInput source='ip' optionText="ip" optionValue="id" />
            </ReferenceInput>
            <NumberInput source="x" style={{display:'inline-block'}}/>
            <NumberInput source="y" style={{display:'inline-block'}}/>
            <NumberInput source="z" style={{display:'inline-block'}}/>
            
            <TextInput source="preset" />
            <NumberInput source="distance"style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);


const presetTitle = (record) => record?<TextField source='id' record={record} style={styles.edit_title}/>:null;

export const PresetEdit = ({...props}) =>(
    <Edit title={<presetTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput  source="cameraId" reference="cameras" allowEmpty>
                <SelectInput source='ip' optionText="ip" optionValue="id" />
            </ReferenceInput>
            <NumberInput source="x" style={{display:'inline-block'}}/>
            <NumberInput source="y" style={{display:'inline-block'}}/>
            <NumberInput source="z" style={{display:'inline-block'}}/>

            <TextInput source="preset" />
            <NumberInput source="distance"style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const presetDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const PresetDelete = (props) => <Delete {...props} title={<presetDeleteTitle/>} />;