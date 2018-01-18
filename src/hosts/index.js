import React from 'react';
import Icon from 'material-ui/svg-icons/hardware/computer';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput,ReferenceInput,SelectInput } from '../lib';
import {translate} from '../lib';
import PerimeterReferenceField from './PerimeterReferenceField';
import PortReferenceField from './PortReferenceField';

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
    <List {...props} filters={<HostFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="hostName" label="resources.hosts.fields.hostName"/>
            <TextField source="alias" label="resources.hosts.fields.alias"/>
            <TextField source="port" label="resources.hosts.fields.port"/>
            <PerimeterReferenceField allowEmpty linkType={false} />
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
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
            <ReferenceInput  source="port" reference="ports" allowEmpty style={{display:'inline-block'}}>

                <SelectInput source='name' optionText="name" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput  source="ppId" reference="pp" allowEmpty style={{display:'inline-block'}}>

                <SelectInput source='name' optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

const hostTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const HostEdit = ({...props}) =>(
    <Edit title={<hostTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="hostName" style={{display:'inline-block'}}/>
            <TextInput source="alias" style={{display:'inline-block'}}/>
            <ReferenceInput  source="port" reference="ports" allowEmpty style={{display:'inline-block'}}>

                <SelectInput source='name' optionText="name" optionValue="id" />
            </ReferenceInput>
            <ReferenceInput  source="ppId" reference="pp" allowEmpty style={{display:'inline-block'}}>

                <SelectInput source='name' optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const hostDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const HostDelete = (props) => <Delete {...props} title={<hostDeleteTitle/>} />;