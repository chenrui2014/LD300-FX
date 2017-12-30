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
export const EventVideoFilter = props => (
    <Filter {...props}>
        <TextInput label="pos.search" source="q" alwaysOn /> />
    </Filter>
);

export const EventVideoList = props => (
    <List {...props} filters={<ProductFilter />} perPage={20}>
        <GridList />
    </List>
);