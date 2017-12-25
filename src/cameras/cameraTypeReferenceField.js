import React from 'react';
import { ReferenceField, TextField } from '../lib';

const CameraTypeReferenceField = (props) => (
    <ReferenceField label="resources.cameras.fields.type" source="type" reference="cameraType" {...props}>
        <TextField source="typeName" />
    </ReferenceField>
)
CameraTypeReferenceField.defaultProps = {
    source: 'type',
    addLabel: true,
};

export default CameraTypeReferenceField;