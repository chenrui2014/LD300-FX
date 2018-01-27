import React from 'react';
import { List,Filter,Datagrid,TextField,TextInput } from '../lib';
const PortFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const PortList = ({...props}) =>(
    <List {...props} filters={<PortFilter/>} sort={{field:'name',order:'ASC'}}  perPage={1000}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="name" label="resources.ports.fields.name"/>
            <TextField source="id" label="resources.ports.fields.value"/>
        </Datagrid>
    </List>
);