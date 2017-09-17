import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import Labeled from '../input/Labeled';
import {
    crudGetMany as crudGetManyAction,
    crudGetMatching as crudGetMatchingAction,
} from '../../actions/dataActions';
import { getPossibleReferences } from '../../reducer/references/possibleValues';

const referenceSource = (resource, source) => `${resource}@${source}`;

export class ReferenceArrayInput extends Component {
    constructor(props) {
        super(props);
        const { perPage, sort, filter } = props;
        // stored as a property rather than state because we don't want redraw of async updates
        this.params = { pagination: { page: 1, perPage }, sort, filter };
        this.debouncedSetFilter = debounce(this.setFilter.bind(this), 500);
    }

    componentDidMount() {
        this.fetchReferenceAndOptions();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReferenceAndOptions(nextProps);
        }
    }

    setFilter = (filter) => {
        if (filter !== this.params.filter) {
            this.params.filter = this.props.filterToQuery(filter);
            this.fetchReferenceAndOptions();
        }
    }

    setPagination = (pagination) => {
        if (pagination !== this.param.pagination) {
            this.param.pagination = pagination;
            this.fetchReferenceAndOptions();
        }
    }

    setSort = (sort) => {
        if (sort !== this.params.sort) {
            this.params.sort = sort;
            this.fetchReferenceAndOptions();
        }
    }

    fetchReferenceAndOptions({ input, reference, source, resource } = this.props) {
        const { pagination, sort, filter } = this.params;
        const ids = input.value;
        if (ids) {
            if (!Array.isArray(ids)) {
                throw Error('The value of ReferenceArrayInput should be an array');
            }
            this.props.crudGetMany(reference, ids);
        }
        this.props.crudGetMatching(reference, referenceSource(resource, source), pagination, sort, filter);
    }

    render() {
        const { input, resource, label, source, referenceRecords, allowEmpty, matchingReferences, basePath, onChange, children, meta } = this.props;

        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceArrayInput> only accepts a single child (like <Datagrid>)');
        }

        if (!(referenceRecords && referenceRecords.length > 0) && !allowEmpty) {
            return <Labeled
                label={typeof label === 'undefined' ? `resources.${resource}.fields.${source}` : label}
                source={source}
                resource={resource}
            />;
        }

        return React.cloneElement(children, {
            allowEmpty,
            input,
            label: typeof label === 'undefined' ? `resources.${resource}.fields.${source}` : label,
            resource,
            meta,
            source,
            choices: matchingReferences,
            basePath,
            onChange,
            setFilter: this.debouncedSetFilter,
            setPagination: this.setPagination,
            setSort: this.setSort,
            translateChoice: false,
        });
    }
}

ReferenceArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.element.isRequired,
    crudGetMatching: PropTypes.func.isRequired,
    crudGetMany: PropTypes.func.isRequired,
    filter: PropTypes.object,
    filterToQuery: PropTypes.func.isRequired,
    input: PropTypes.object.isRequired,
    label: PropTypes.string,
    matchingReferences: PropTypes.array,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    perPage: PropTypes.number,
    reference: PropTypes.string.isRequired,
    referenceRecords: PropTypes.array,
    resource: PropTypes.string.isRequired,
    sort: PropTypes.shape({
        field: PropTypes.string,
        order: PropTypes.oneOf(['ASC', 'DESC']),
    }),
    source: PropTypes.string,
};

ReferenceArrayInput.defaultProps = {
    allowEmpty: false,
    filter: {},
    filterToQuery: searchText => ({ q: searchText }),
    matchingReferences: [],
    perPage: 25,
    sort: { field: 'id', order: 'DESC' },
    referenceRecords: [],
};

function mapStateToProps(state, props) {
    const referenceIds = props.input.value || [];
    const data = state.admin[props.reference].data;
    return {
        referenceRecords: referenceIds.reduce((references, referenceId) => {
            if (data[referenceId]) {
                references.push(data[referenceId]);
            }
            return references;
        }, []),
        matchingReferences: getPossibleReferences(
            state,
            referenceSource(props.resource, props.source),
            props.reference,
            referenceIds,
        ),
    };
}

const ConnectedReferenceInput = connect(mapStateToProps, {
    crudGetMany: crudGetManyAction,
    crudGetMatching: crudGetMatchingAction,
})(ReferenceArrayInput);

ConnectedReferenceInput.defaultProps = {
    addField: true,
};

export default ConnectedReferenceInput;
