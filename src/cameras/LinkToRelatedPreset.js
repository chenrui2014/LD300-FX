import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { translate } from '../lib';
import { stringify } from 'query-string';
import {PresetIcon} from '../preset';

const LinkToRelatedPreset = ({ record, translate }) => (
    <FlatButton
        primary
        label={translate('resources.cameras.fields.preset')}
        icon={<PresetIcon />}
        containerElement={<Link to={{
            pathname: '/preset',
            search: stringify({ filter: JSON.stringify({ cameraId: record.id }) }),
        }} />}
    />
);

export default translate(LinkToRelatedPreset);
