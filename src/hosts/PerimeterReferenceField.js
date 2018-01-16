import React from 'react';
import { ReferenceField, TextField } from '../lib';

const PerimeterReferenceField = (props) => (
    <ReferenceField label="resources.hosts.fields.perimeterId" source="ppId" reference="pp" {...props}>
        <TextField source="name" />
    </ReferenceField>
)
PerimeterReferenceField.defaultProps = {
    source: 'ppId',
    addLabel: true,
};

export default PerimeterReferenceField;