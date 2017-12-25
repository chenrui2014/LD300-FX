import React from 'react';
import { ReferenceField, TextField } from '../lib';

const VendorReferenceField = (props) => (
    <ReferenceField label="resources.cameras.fields.brand" source="brand" reference="vendor" {...props}>
        <TextField source="vendorName" />
    </ReferenceField>
)
VendorReferenceField.defaultProps = {
    source: 'brand',
    addLabel: true,
};

export default VendorReferenceField;