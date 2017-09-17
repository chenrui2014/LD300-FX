import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

const defaultLabelStyle = {
    paddingTop: '2em',
    height: 'auto',
};

class Labeled extends Component {
    render() {
        const { input, isRequired, meta, label, resource, record, onChange, basePath, children, source, disabled = true, labelStyle = defaultLabelStyle } = this.props;
        if (!label && !source) {
            throw new Error(`Cannot create label for component <${children && children.type && children.type.name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'addLabel: false' in the component default props`);
        }
        return (
            <TextField
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
                floatingLabelFixed
                fullWidth
                disabled={disabled}
                underlineShow={false}
                style={labelStyle}
                errorText={meta && meta.touched && meta.error}
            >
                {children && typeof children.type !== 'string' ?
                    React.cloneElement(children, { input, meta, record, resource, onChange, basePath }) :
                    children
                }
            </TextField>
        );
    }
}

Labeled.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    disabled: PropTypes.bool,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelStyle: PropTypes.object,
};

export default Labeled;
