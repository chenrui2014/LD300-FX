import React, { Component } from 'react';
import PropTypes from 'prop-types';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import DatagridCell from './DatagridCell';
import DatagridHeaderCell from './DatagridHeaderCell';
import DatagridBody from './DatagridBody';

const defaultStyles = {
    table: {
        tableLayout: 'auto',
    },
    tbody: {
        height: 'inherit',
    },
    header: {
        th: {
            padding: 0,
        },
        'th:first-child': {
            padding: '0 0 0 12px',
        },
    },
    cell: {
        td: {
            padding: '0 12px',
            whiteSpace: 'normal',
        },
        'td:first-child': {
            padding: '0 12px 0 16px',
            whiteSpace: 'normal',
        },
    },
};

class Datagrid extends Component {
    updateSort = (event) => {
        event.stopPropagation();
        this.props.setSort(event.currentTarget.dataset.sort);
    }

    render() {
        const { resource, children, ids, isLoading, data, currentSort, basePath, styles = defaultStyles, muiTheme, rowStyle, options, headerOptions, bodyOptions, rowOptions } = this.props;
        return (
            <Table style={options && options.fixedHeader ? null : styles.table} fixedHeader={false} {...options}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} {...headerOptions}>
                    <TableRow style={muiTheme.tableRow}>
                        {React.Children.map(children, (field, index) => (
                            <DatagridHeaderCell
                                key={field.props.source || index}
                                field={field}
                                defaultStyle={index === 0 ? styles.header['th:first-child'] : styles.header.th}
                                currentSort={currentSort}
                                isSorting={field.props.source === currentSort.field}
                                updateSort={this.updateSort}
                                resource={resource}
                            />
                        ))}
                    </TableRow>
                </TableHeader>
                <DatagridBody resource={resource} ids={ids} data={data} basePath={basePath} styles={styles} rowStyle={rowStyle} isLoading={isLoading} options={bodyOptions} rowOptions={rowOptions}>
                    {children}
                </DatagridBody>
            </Table>
        );
    }
}

Datagrid.propTypes = {
    basePath: PropTypes.string,
    bodyOptions: PropTypes.object,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }),
    data: PropTypes.object.isRequired,
    headerOptions: PropTypes.object,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    isLoading: PropTypes.bool,
    muiTheme: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    rowOptions: PropTypes.object,
    rowStyle: PropTypes.func,
    setSort: PropTypes.func,
    styles: PropTypes.object,
};

Datagrid.defaultProps = {
    data: {},
    ids: [],
};

export default muiThemeable()(Datagrid);
