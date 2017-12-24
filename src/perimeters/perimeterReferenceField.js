import React from 'react';
import { ReferenceField, TextField } from '../lib';

const PerimeterReferenceField = (props) => (
    <ReferenceField label="resources.perimeter.fields.hostId" source="hostId" reference="hosts" {...props}>
        <TextField source="hostName" />
    </ReferenceField>
)
PerimeterReferenceField.defaultProps = {
    source: 'hostId',
    addLabel: true,
};

export default PerimeterReferenceField;