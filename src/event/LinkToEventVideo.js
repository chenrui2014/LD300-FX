import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import { translate } from '../lib';
import { stringify } from 'query-string';
import Icon from 'material-ui/svg-icons/av/videocam';

const LinkToEventVideo = ({ record, translate }) => (
    <FlatButton
        primary
        label={translate('resources.event.fields.video')}
        icon={<Icon />}
        containerElement={<Link to={{
            pathname: '/eventVideo',
            search: stringify({ filter: JSON.stringify({ cameraId: record.id }) }),
        }} />}
    />
);

export default translate(LinkToEventVideo);
