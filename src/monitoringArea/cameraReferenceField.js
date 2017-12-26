import React from 'react';
import { ReferenceField, TextField } from '../lib';

const CameraReferenceField = (props) => (
    <ReferenceField label="resources.monitoringArea.fields.cameraId" source="cameraId" reference="cameras" {...props}>
        <TextField source="ip" />
    </ReferenceField>
)
CameraReferenceField.defaultProps = {
    source: 'cameraId',
    addLabel: true,
};

export default CameraReferenceField;