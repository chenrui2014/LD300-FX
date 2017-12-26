import React from 'react';
import { ReferenceField, TextField } from '../lib';

const PerimeterReferenceField = (props) => (
    <ReferenceField label="resources.monitoringArea.fields.perimeterId" source="perimeterId" reference="perimeter" {...props}>
        <TextField source="name" />
    </ReferenceField>
)
PerimeterReferenceField.defaultProps = {
    source: 'perimeterId',
    addLabel: true,
};

export default PerimeterReferenceField;