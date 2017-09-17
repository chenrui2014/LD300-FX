import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import Labeled from './Labeled';
import translate from '../../i18n/translate';

export class RadioButtonGroupInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    }

    renderRadioButton = (choice) => {
        const {
            optionText,
            optionValue,
            translate,
            translateChoice,
        } = this.props;
        const choiceName = React.isValidElement(optionText) ? // eslint-disable-line no-nested-ternary
            React.cloneElement(optionText, { record: choice }) :
            (typeof optionText === 'function' ?
                optionText(choice) :
                get(choice, optionText)
            );
        return (
            <RadioButton
                key={get(choice, optionValue)}
                label={translateChoice ? translate(choiceName, { _: choiceName }) : choiceName}
                value={get(choice, optionValue)}
            />
        );
    }

    render() {
        const { label, resource, source, input, isRequired, choices, options, elStyle } = this.props;
        return (
            <Labeled label={label} onChange={this.handleChange} resource={resource} source={source} isRequired={isRequired}>
                <RadioButtonGroup
                    name={source}
                    defaultSelected={input.value}
                    style={elStyle}
                    {...options}
                >
                    {choices.map(this.renderRadioButton)}
                </RadioButtonGroup>
            </Labeled>
        );
    }
}

RadioButtonGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

RadioButtonGroupInput.defaultProps = {
    addField: true,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default translate(RadioButtonGroupInput);
