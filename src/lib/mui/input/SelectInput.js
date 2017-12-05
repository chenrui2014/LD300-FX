import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import translate from '../../i18n/translate';
import FieldTitle from '../../util/FieldTitle';

export class SelectInput extends Component {
    /*
     * Using state to bypass a redux-form comparison but which prevents re-rendering
     * @see https://github.com/erikras/redux-form/issues/2456
     */
    state = {
        value: this.props.input.value,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.input.value !== this.props.input.value) {
            this.setState({ value: nextProps.input.value });
        }
    }

    handleChange = (event, index, value) => {
        this.props.input.onChange(value);
        this.setState({ value });
    }

    renderMenuItem = (choice) => {
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
            <MenuItem
                key={get(choice, optionValue)}
                primaryText={translateChoice ? translate(choiceName, { _: choiceName }) : choiceName}
                value={get(choice, optionValue)}
            />
        );
    }

    render() {
        const {
            allowEmpty,
            choices,
            elStyle,
            isRequired,
            label,
            meta: { touched, error },
            options,
            resource,
            source,
        } = this.props;
        return (
            <SelectField
                value={this.state.value}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
                onChange={this.handleChange}
                autoWidth
                style={elStyle}
                underlineStyle={{marginBottom:-14}}
                errorText={touched && error}
                {...options}
            >
                {allowEmpty &&
                    <MenuItem value={null} primaryText="" />
                }
                {choices.map(this.renderMenuItem)}
            </SelectField>
        );
    }
}

SelectInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
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

SelectInput.defaultProps = {
    addField: true,
    allowEmpty: false,
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default translate(SelectInput);
