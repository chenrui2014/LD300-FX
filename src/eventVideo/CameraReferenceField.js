import React from 'react';
import { ReferenceField, TextField } from '../lib';

const CameraReferenceField = (props) => (
    <ReferenceField label="resources.eventVideo.fields.pid" source="pid" reference="cameras" {...props}>
        <TextField source="ip" />
    </ReferenceField>
)
CameraReferenceField.defaultProps = {
    source: 'pid',
    addLabel: true,
};

export default CameraReferenceField;