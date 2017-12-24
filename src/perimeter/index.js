import React from 'react';
import Icon from 'material-ui/svg-icons/image/edit';
import PerimeterList from './PerimeterList';
import {Filter,TextInput,NullableBooleanInput} from '../lib'

export const PerimeterIcon = Icon;

const PerimeterPointFilter = (props) =>(
    <Filter {...props}>
        <TextInput label="pos.search"  source="q" alwaysOn/>
        <NullableBooleanInput source="status" defaultValue={true} />
    </Filter>
)

export const PerimeterPointList = ({...props}) =>(
    <PerimeterList {...props} filters={<PerimeterPointFilter/>} sort={{field:'No',order:'ASC'}}  perPage={1000}>
    </PerimeterList>
);