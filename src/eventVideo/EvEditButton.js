import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/av/play-circle-filled';
import linkToRecord from '../lib/util/linkToRecord';
import translate from '../lib/i18n/translate';

const EvEditButton = ({ basePath = '', label = 'aor.action.edit', record = {}, translate }) => <FlatButton
    primary
    label={label && translate(label)}
    icon={<ContentCreate />}
    containerElement={<Link to={linkToRecord(basePath, record.id)} />}
    style={{ overflow: 'inherit' }}
/>;

EvEditButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    shouldUpdate((props, nextProps) =>
        (props.record
            && props.record.id !== nextProps.record.id
            || props.basePath !== nextProps.basePath)
        || (props.record == null && nextProps.record != null)
    ),
    translate,
);

export default enhance(EvEditButton);
