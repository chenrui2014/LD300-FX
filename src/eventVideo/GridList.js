import React from 'react';
import { GridList as MuiGridList, GridTile } from 'material-ui/GridList';
import { NumberField, EditButton } from '../lib';
import Reflv from 'reflv';

const styles = {
    root: {
        margin: '-2px',
    },
    gridList: {
        width: '100%',
        margin: 0,
    },
};

const GridList = ({ ids, isLoading, data, currentSort, basePath, rowStyle }) => (
    <div style={styles.root}>
        <MuiGridList cellHeight={180} cols={4} style={styles.gridList}>
            {ids.map((id) => (
                <GridTile
                    key={id}
                    title={<span>{data[id].hid}-{data[id].pid}, <b>位置{data[id].position}</b></span>}
                    subtitle={data[id].happenTime}
                    titleBackground="linear-gradient(to top, rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0) 100%)"
                >
                    <Reflv url={data[id].path} type="flv"/>
                </GridTile>
            ))}
        </MuiGridList>
    </div>
);

export default GridList;
