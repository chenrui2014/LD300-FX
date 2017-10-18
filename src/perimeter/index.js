import React from 'react';
import PerimeterComponent from './Perimeter';
import Icon from 'material-ui/svg-icons/editor/border-outer';
import PerimeterList from './PerimeterList';
import {Filter,TextInput,NullableBooleanInput} from '../lib'
export const PerimeterIcon = Icon;
export const Perimeter = PerimeterComponent;

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