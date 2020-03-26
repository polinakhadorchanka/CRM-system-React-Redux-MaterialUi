import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
        borderColor: '#e1e1e1',
        color: '#e1e1e1 !important',
        fontSize: '12px',
        lineHeight: '14px',
        marginLeft: '10px',
        padding: '8px 15px 7px'
    },
});

export default function Hook(props) {
    const classes = useStyles();
    return <Button className={classes.root} variant="outlined" href={props.href}>{props.label}</Button>;
}