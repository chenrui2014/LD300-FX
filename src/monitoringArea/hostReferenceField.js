import React from 'react';
import { ReferenceField, TextField } from '../lib';

const HostReferenceField = (props) => (
    <ReferenceField label="resources.monitoringArea.fields.hostId" source="hostId" reference="hosts" {...props}>
        <TextField source="port" />
    </ReferenceField>
)
HostReferenceField.defaultProps = {
    source: 'hostId',
    addLabel: true,
};

export default HostReferenceField;