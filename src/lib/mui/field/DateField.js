import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import pure from 'recompose/pure';

const toLocaleStringSupportsLocales = (() => {
    try {
        new Date().toLocaleString("i");
    } catch (error) {
        return (error instanceof RangeError);
    }
    return false;
})();


export const DateField = ({ elStyle, locales, options, record, showTime = false, source }) => {
    if (!record) return null;
    const value = get(record, source);
    if (value == null) return null;
    const date = value instanceof Date ? value : new Date(value);
    const dateString = showTime ?
        (toLocaleStringSupportsLocales ? date.toLocaleString(locales, options) : date.toLocaleString()) :
        (toLocaleStringSupportsLocales ? date.toLocaleDateString(locales, options) : date.toLocaleDateString());

    return <span style={elStyle}>{dateString}</span>;
};

DateField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    locales: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    options: PropTypes.object,
    record: PropTypes.object,
    showTime: PropTypes.bool,
    source: PropTypes.string.isRequired,
};

const PureDateField = pure(DateField);

PureDateField.defaultProps = {
    addLabel: true,
};

export default PureDateField;
