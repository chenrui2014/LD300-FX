import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

class NumberInput extends Component {
    handleBlur = (eventOrValue) => {
        this.props.onBlur(eventOrValue);
        this.props.input.onBlur(eventOrValue);

        const value = parseFloat(this.props.input.value);
        this.handleChange(isNaN(value) ? undefined : value);
    }

    handleFocus = (event) => {
        this.props.onFocus(event);
        this.props.input.onFocus(event);
    }

    handleChange = (eventOrValue) => {
        this.props.onChange(eventOrValue);
        this.props.input.onChange(eventOrValue);
    }

    render() {
        const { elStyle, input, isRequired, label, meta: { touched, error }, options, source, step, resource } = this.props;
        return (
            <TextField
                {...input}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                type="number"
                step={step}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
                errorText={touched && error}
                style={elStyle}
                {...options}
            />
        );
    }
}

NumberInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    step: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    validate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func),
    ]),
};

NumberInput.defaultProps = {
    addField: true,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: {},
    step: 'any',
};

export default NumberInput;
