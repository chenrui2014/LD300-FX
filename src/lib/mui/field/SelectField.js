import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

export const SelectField = ({ source, record, choices, elStyle, optionValue, optionText, translate, translateChoice }) => {
    const value = get(record, source);
    const choice = choices.find(c => c[optionValue] === value);
    if (!choice) return null;
    const choiceName = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
        React.cloneElement(optionText, { record: choice }) :
        (typeof optionText === 'function' ?
            optionText(choice) :
            choice[optionText]
        );
    return (
        <span style={elStyle}>
            {translateChoice ? translate(choiceName, { _: choiceName }) : choiceName}
        </span>
    );
};

SelectField.propTypes = {
    addLabel: PropTypes.bool,
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    label: PropTypes.string,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

SelectField.defaultProps = {
    record: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

const enhance = compose(
    pure,
    translate,
);

const EnhancedSelectField = enhance(SelectField);

EnhancedSelectField.defaultProps = {
    addLabel: true,
};

export default EnhancedSelectField;
