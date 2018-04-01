import React from 'react';
import { List,Filter,Datagrid,TextField,TextInput } from '../lib';
const RoleFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const RoleList = ({...props}) =>(
    <List {...props} filters={<RoleFilter/>} sort={{field:'name',order:'ASC'}}  perPage={1000}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="name" label="resources.roles.fields.name"/>
            <TextField source="id" label="resources.roles.fields.value"/>
        </Datagrid>
    </List>
);