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

export const EventIcon = Icon;

export const EventVideoFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn />
        <ReferenceInput source="hid" reference="hosts">
            <SelectInput source="port" />
        </ReferenceInput>
        <ReferenceInput source="pid" reference="cameras">
            <SelectInput source="ip" />
        </ReferenceInput>
        <DateInput source="happenTime_gte" />
        <DateInput source="happenTime_lte" />
    </Filter>
);

export const EventVideoList = props => (
    <List {...props} filters={<EventVideoFilter />} perPage={20}>
        <GridList />
    </List>
);