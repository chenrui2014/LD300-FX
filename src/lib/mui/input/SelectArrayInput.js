import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import ChipInput from 'material-ui-chip-input';

import translate from '../../i18n/translate';
import FieldTitle from '../../util/FieldTitle';

const dataSourceConfig = { text: 'text', value: 'value' };

export class SelectArrayInput extends Component {
    state = {
        values: [],
    };

    componentWillMount = () => {
        this.setState({
            values: this.getChoicesForValues(this.props.input.value || [], this.props.choices),
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (
            this.props.choices !== nextProps.choices ||
            this.props.input.value !== nextProps.input.value
        ) {
            this.setState({
                values: this.getChoicesForValues(nextProps.input.value || [], nextProps.choices),
            });
        }
    };

    handleBlur = () => {
        const extracted = this.extractIds(this.state.values);
        this.props.onBlur(extracted);
        this.props.input.onBlur(extracted);
    };

    handleFocus = () => {
        const extracted = this.extractIds(this.state.values);
        this.props.onFocus(extracted);
        this.props.input.onFocus(extracted);
    };

    handleAdd = (newValue) => {
        const values = [...this.state.values, newValue];
        this.setState({ values });
        this.handleChange(values);
    };

    handleDelete = (newValue) => {
        const values = this.state.values.filter(v => (v.value !== newValue));
        this.setState({ values });
        this.handleChange(values);
    };

    handleChange = (eventOrValue) => {
        const extracted = this.extractIds(eventOrValue);
        this.props.onChange(extracted);
        this.props.input.onChange(extracted);
    };

    extractIds = (eventOrValue) => {
        const value = (eventOrValue.target && eventOrValue.target.value) ? eventOrValue.target.value : eventOrValue;
        if (Array.isArray(value)) {
            return value.map(o => o.value);
        }
        return [value];
    };

    getChoicesForValues = (values, choices = []) => {
        const { optionValue, optionText } = this.props;
        if (!values || !Array.isArray(values)) {
            throw Error('Value of SelectArrayInput should be an array');
        }
        return values
            .map(value => choices.find(c => c[optionValue] === value) || { [optionValue]: value, [optionText]: value })
            .map(this.formatChoice);
    };

    formatChoices = choices => choices.map(this.formatChoice);

    formatChoice = (choice) => {
        const { optionText, optionValue, translateChoice, translate } = this.props;
        const choiceText = typeof optionText === 'function' ? optionText(choice) : get(choice, optionText);
        return {
            value: get(choice, optionValue),
            text: translateChoice ? translate(choiceText, { _: choiceText }) : choiceText,
        };
    }

    render() {
        const {
            elStyle,
            input,
            isRequired,
            choices,
            label,
            meta: { touched, error },
            options,
            optionText,
            optionValue,
            resource,
            source,
            setFilter,
            translate,
            translateChoice,
        } = this.props;

        return (
            <ChipInput
                {...input}
                value={this.state.values}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onTouchTap={this.handleFocus}
                onRequestAdd={this.handleAdd}
                onRequestDelete={this.handleDelete}
                onUpdateInput={setFilter}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
                errorText={touched && error}
                style={elStyle}
                dataSource={this.formatChoices(choices)}
                dataSourceConfig={dataSourceConfig}
                openOnFocus
                {...options}
            />
        );
    }
}

SelectArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    choices: PropTypes.arrayOf(PropTypes.object),
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    setFilter: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

SelectArrayInput.defaultProps = {
    addField: true,
    choices: [],
    onBlur: () => true,
    onChange: () => true,
    onFocus: () => true,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default translate(SelectArrayInput);
