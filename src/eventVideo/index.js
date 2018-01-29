import React from 'react';
import {
    translate,
    Create,
    Datagrid,
    DateField,
    Edit,
    EditButton,
    Filter,
    FormTab,
    List,
    NumberInput,
    ReferenceInput,
    ReferenceManyField,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput,
} from '../lib';
import GridList from './GridList';
import Icon from "material-ui/svg-icons/action/chrome-reader-mode";
import DateInput from "../lib/mui/input/DateInput";
import CameraReferenceField from "./CameraReferenceField";

import EventVideo from './EventVideo';
import EvEditButton from './EvEditButton';

export const EventIcon = Icon;

export const EventVideoFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <ReferenceInput source="hid" reference="hosts">
            <SelectInput source="port" />
        </ReferenceInput>
        <ReferenceInput source="eventId" reference="event">
            <SelectInput source="happenTime" optionText="happenTime" optionValue="id" />
        </ReferenceInput>
        <DateInput source="happenTime_gte" />
        <DateInput source="happenTime_lte" />
    </Filter>
);

export const EventVideoList = props => (
    <List {...props} filters={null} sort={{field:'pid',order:'ASC'}}  perPage={100}>
        <Datagrid bodyOptions={{ stripedRows: true, showRowHover: true }}>
            <CameraReferenceField allowEmpty linkType={false} />
            <TextField source="path" label="resources.eventVideo.fields.path"/>
            <EvEditButton label='调取录像' />
        </Datagrid>
    </List>
);

export const EventVideoEdit = ({...props}) =>(
    <EventVideo  title='事件录像' {...props}/>
);