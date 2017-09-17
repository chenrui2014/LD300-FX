import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { userCheck as userCheckAction } from '../actions/authActions';

export class Restricted extends Component {
    static propTypes = {
        authParams: PropTypes.object,
        location: PropTypes.object,
        userCheck: PropTypes.func,
    }

    componentWillMount() {
        this.checkAuthentication(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuthentication(nextProps);
        }
    }

    checkAuthentication(params) {
        const { userCheck, authParams, location } = params;
        userCheck(authParams, location && location.pathname);
    }

    // render the child even though the AUTH_CHECK isn't finished (optimistic rendering)
    render() {
        const { children, ...rest } = this.props;
        return React.cloneElement(children, rest);
    }
}

export default connect(null, {
    userCheck: userCheckAction,
})(Restricted);
