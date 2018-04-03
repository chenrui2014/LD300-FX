import React from 'react';
import { ReferenceField, TextField } from '../lib';

const RoleReferenceField = (props) => (
    <ReferenceField label="resources.user.fields.role" source="role" reference="role" {...props}>
        <TextField source="name" />
    </ReferenceField>
)
RoleReferenceField.defaultProps = {
    source: 'role',
    addLabel: true,
};

export default RoleReferenceField;