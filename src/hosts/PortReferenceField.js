import React from 'react';
import { ReferenceField, TextField } from '../lib';

const PortReferenceField = (props) => (
    <ReferenceField label="resources.hosts.fields.port" source="port" reference="ports" {...props}>
        <TextField source="name" />
    </ReferenceField>
)
PortReferenceField.defaultProps = {
    source: 'port',
    addLabel: true,
};

export default PortReferenceField;