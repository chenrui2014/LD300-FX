import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import AutoComplete from 'material-ui/AutoComplete';

import FieldTitle from '../../util/FieldTitle';
import translate from '../../i18n/translate';

export class AutocompleteInput extends Component {
    handleNewRequest = (chosenRequest, index) => {
        if (index !== -1) {
            const { choices, input, optionValue } = this.props;
            input.onChange(choices[index][optionValue]);
        }
    }

    getSuggestion(choice) {
        const { optionText, optionValue, translate, translateChoice } = this.props;
        const choiceName = typeof optionText === 'function' ? optionText(choice) : get(choice, optionText);
        return translateChoice ? translate(choiceName, { _: choiceName }) : choiceName;
    }

    render() {
        const {
            choices,
            elStyle,
            filter,
            input,
            isRequired,
            label,
            meta: { touched, error },
            options,
            optionValue,
            resource,
            setFilter,
            source,
        } = this.props;

        const selectedSource = choices.find(choice => get(choice, optionValue) === input.value);
        const dataSource = choices.map(choice => ({
            value: get(choice, optionValue),
            text: this.getSuggestion(choice),
        }));
        return (
            <AutoComplete
                searchText={selectedSource && this.getSuggestion(selectedSource)}
                dataSource={dataSource}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
                filter={filter}
                onNewRequest={this.handleNewRequest}
                onUpdateInput={setFilter}
                openOnFocus
                style={elStyle}
                errorText={touched && error}
                {...options}
            />
        );
    }
}

AutocompleteInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    elStyle: PropTypes.object,
    filter: PropTypes.func.isRequired,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    optionElement: PropTypes.element,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    setFilter: PropTypes.func,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

AutocompleteInput.defaultProps = {
    addField: true,
    choices: [],
    filter: AutoComplete.fuzzyFilter,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default translate(AutocompleteInput);
