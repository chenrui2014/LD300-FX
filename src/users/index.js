import React from 'react';
import Icon from 'material-ui/svg-icons/maps/local-library';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,ReferenceInput,SelectInput } from '../lib';
import {translate} from '../lib';
import RoleReferenceField from "./RoleReferenceField";
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const UserIcon = Icon;

const UserFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const UserList = (props) =>(
    <List {...props} filters={<UserFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="username" label="resources.user.fields.username"/>
            <RoleReferenceField allowEmpty linkType={false} />
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
        </Datagrid>
    </List>
);

const UserCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const UserCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<UserCreateToolbar />} defaultValue={{ average_note: 0 }} >
            <TextInput source="username" style={{display:'inline-block'}}/>
            <TextInput type="password" source="password" style={{display:'inline-block'}}/>
            <ReferenceInput  source="role" reference="role" allowEmpty style={{display:'inline-block'}}>
                <SelectInput source='name' optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

const vendorTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const UserEdit = ({...props}) =>(
    <Edit title={<vendorTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="username" style={{display:'inline-block'}}/>
            <TextInput type="password" source="password" style={{display:'inline-block'}}/>
            <ReferenceInput  source="role" reference="role" allowEmpty style={{display:'inline-block'}}>
                <SelectInput source='name' optionText="name" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const vendorDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const UserDelete = (props) => <Delete {...props} title={<vendorDeleteTitle/>} />;