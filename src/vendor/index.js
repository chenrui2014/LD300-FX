import React from 'react';
import Icon from 'material-ui/svg-icons/maps/local-library';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,DisabledInput } from '../lib';
import {translate} from '../lib';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const VendorIcon = Icon;

const VendorFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const VendorList = (props) =>(
    <List {...props} filters={<VendorFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="vendorName" label="resources.vendor.fields.vendorName"/>
            <TextField source="vendorCode" label="resources.vendor.fields.vendorCode"/>
            <TextField source="telephone" label="resources.vendor.fields.telephone"/>
            <TextField source="address" label="resources.vendor.fields.address"/>
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
        </Datagrid>
    </List>
);

const VendorCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;

export const VendorCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<VendorCreateToolbar />} defaultValue={{ average_note: 0 }} >
            <TextInput source="vendorName" style={{display:'inline-block'}}/>
            <TextInput source="vendorCode" style={{display:'inline-block'}}/>
            <TextInput source="telephone" style={{display:'inline-block'}}/>
            <TextInput source="address" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Create>
);

const vendorTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const VendorEdit = ({...props}) =>(
    <Edit title={<vendorTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="vendorName" style={{display:'inline-block'}}/>
            <TextInput source="vendorCode" style={{display:'inline-block'}}/>
            <TextInput source="telephone" style={{display:'inline-block'}}/>
            <TextInput source="address" style={{display:'inline-block'}}/>
        </SimpleForm>
    </Edit>
);

const vendorDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const VendorDelete = (props) => <Delete {...props} title={<vendorDeleteTitle/>} />;