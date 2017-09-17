import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';

const FunctionField = ({ record = {}, source, render, elStyle }) => record ?
    <span style={elStyle}>{render(record)}</span> :
    null;

FunctionField.propTypes = {
    addLabel: PropTypes.bool,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    render: PropTypes.func.isRequired,
    record: PropTypes.object,
    source: PropTypes.string,
};

const PureFunctionField = pure(FunctionField);

PureFunctionField.defaultProps = {
    addLabel: true,
};

export default PureFunctionField;
