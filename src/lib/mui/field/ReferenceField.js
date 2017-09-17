import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';
import get from 'lodash.get';
import { crudGetManyAccumulate as crudGetManyAccumulateAction } from '../../actions/accumulateActions';
import linkToRecord from '../../util/linkToRecord';

export class ReferenceField extends Component {
    componentDidMount() {
        this.fetchReference(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record.id !== nextProps.record.id) {
            this.fetchReference(nextProps);
        }
    }

    fetchReference(props) {
        const source = get(props.record, props.source);
        if (source !== null && typeof source !== 'undefined') {
            this.props.crudGetManyAccumulate(props.reference, [source]);
        }
    }

    render() {
        const { record, source, reference, referenceRecord, basePath, allowEmpty, children, elStyle, linkType } = this.props;
        if (React.Children.count(children) !== 1) {
            throw new Error('<ReferenceField> only accepts a single child');
        }
        if (!referenceRecord && !allowEmpty) {
            return <LinearProgress />;
        }
        const rootPath = basePath.split('/').slice(0, -1).join('/');
        const href = linkToRecord(`${rootPath}/${reference}`, get(record, source));
        const child = React.cloneElement(children, {
            record: referenceRecord,
            resource: reference,
            allowEmpty,
            basePath,
            translateChoice: false,
        });
        if (linkType === 'edit' || linkType === true) {
            return <Link style={elStyle} to={href}>{child}</Link>;
        }
        if (linkType === 'show') {
            return <Link style={elStyle} to={`${href}/show`}>{child}</Link>;
        }
        return child;
    }
}

ReferenceField.propTypes = {
    addLabel: PropTypes.bool,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    crudGetManyAccumulate: PropTypes.func.isRequired,
    elStyle: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    reference: PropTypes.string.isRequired,
    referenceRecord: PropTypes.object,
    source: PropTypes.string.isRequired,
    linkType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]).isRequired,
};

ReferenceField.defaultProps = {
    referenceRecord: null,
    record: {},
    allowEmpty: false,
    linkType: 'edit',
};

function mapStateToProps(state, props) {
    return {
        referenceRecord: state.admin[props.reference].data[get(props.record, props.source)],
    };
}

const ConnectedReferenceField = connect(mapStateToProps, {
    crudGetManyAccumulate: crudGetManyAccumulateAction,
})(ReferenceField);

ConnectedReferenceField.defaultProps = {
    addLabel: true,
};

export default ConnectedReferenceField;
