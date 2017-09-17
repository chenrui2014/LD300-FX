import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const hasNumberFormat = !!(typeof Intl === 'object' && Intl && typeof Intl.NumberFormat === 'function');

export const NumberField = ({ record, source, locales, options, elStyle }) => {
    if (!record) return null;
    const value = get(record, source);
    if (value == null) return null;
    if (!hasNumberFormat) return <span style={elStyle}>{value}</span>;
    return <span style={elStyle}>{value.toLocaleString(locales, options)}</span>;
};

NumberField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    record: PropTypes.object,
    source: PropTypes.string.isRequired,
};

const PureNumberField = pure(NumberField);

PureNumberField.defaultProps = {
    addLabel: true,
    style: { textAlign: 'right' },
    headerStyle: { textAlign: 'right' },
};

export default PureNumberField;
