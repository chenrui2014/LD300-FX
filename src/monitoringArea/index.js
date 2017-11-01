import React from 'react';
import Icon from 'material-ui/svg-icons/action/visibility';
import { List,EditButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput,ReferenceInput,SelectInput,NumberInput } from '../lib';
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
            <TextField source="hostName" label="resources.monitoringArea.fields.hostName"/>
            <TextField source="cameraName" label="resources.monitoringArea.fields.cameraName"/>
            <TextField source="min" label="resources.monitoringArea.fields.min"/>
            <TextField source="max" label="resources.monitoringArea.fields.max"/>
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
            ['hostName',].forEach((field) => {
                if (!values[field]) {
                    errors[field] = ['Required field'];
                }
            });

            return errors;
        }}
        >
            <ReferenceInput  source="hostName" reference="hosts" allowEmpty>

                <SelectInput source="hostName" />
            </ReferenceInput>
            <ReferenceInput  source="cameraName" reference="cameras" allowEmpty>

                <SelectInput source="name" />
            </ReferenceInput>
            <NumberInput source="min"style={{display:'inline-block'}}/>
            <NumberInput source="max"style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const MonitorAreaTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const MonitorAreaEdit = (props) =>(
    <Edit title={<MonitorAreaTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput source="id" style={{display:'inline-block'}}/>
            <ReferenceInput  source="hostName" reference="hosts" allowEmpty={false}>
                <SelectInput source="hostName" />
            </ReferenceInput>
            <ReferenceInput  source="cameraName" reference="cameras" allowEmpty>

                <SelectInput source="name" />
            </ReferenceInput>
            <NumberInput source="min"style={{display:'inline-block'}}/>
            <NumberInput source="max"style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const MonitorAreaDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const MonitorAreaDelete = (props) => <Delete {...props} title={<MonitorAreaDeleteTitle/>} />;