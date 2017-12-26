import React from 'react';
import Icon from 'material-ui/svg-icons/editor/border-outer';
import { List,EditButton,DeleteButton,Toolbar,Create,SaveButton,Filter,Datagrid,TextField,TextInput,Edit,SimpleForm,Delete,ReferenceInput,SelectInput,DisabledInput } from '../lib';
import {translate} from '../lib';
import PerimeterReferenceField from './perimeterReferenceField';
// import EditButton from '../buttons/EditButton';

const styles = {
    edit_title:{
        fontSize:32
    }
}

export const PerimetersIcon = Icon;

const PerimetersFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
    </Filter>
)
export const PerimetersList = (props) =>(
    <List {...props} filters={<PerimetersFilter/>} sort={{field:'id',order:'ASC'}}  perPage={25}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <TextField source="name" label="resources.perimeter.fields.name"/>
            <PerimeterReferenceField allowEmpty linkType={false} />
            <EditButton />
            <DeleteButton basePath={props.basePath} record={props.data} translate={props.translate}/>
        </Datagrid>
    </List>
);

const PerimetersCreateToolbar = props => <Toolbar {...props} >
    <SaveButton label="resources.cameras.add" redirect={false} submitOnEnter={false} raised={false} />
</Toolbar>;
export const PerimetersCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm toolbar={<PerimetersCreateToolbar />} defaultValue={{ average_note: 0 }}
        >
            <TextInput source="name" style={{display:'inline-block'}}/>
            <ReferenceInput source="hostId" reference="hosts" allowEmpty>
                <SelectInput source="port" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

const perimetersTitle = ({record}) => record?<TextField record={record} style={styles.edit_title}/>:null;

export const PerimetersEdit = ({...props}) =>(
    <Edit title={<perimetersTitle/>} {...props}>
        <SimpleForm>
            <TextInput source="name" style={{display:'inline-block'}}/>
            <ReferenceInput source="hostId" reference="hosts" allowEmpty>
                <SelectInput source="port" optionText="port" optionValue="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const perimetersDeleteTitle = translate(({ record, translate }) => <span>
    {record?record:null}
</span>)

export const PerimetersDelete = (props) => <Delete {...props} title={<perimetersDeleteTitle/>} />;