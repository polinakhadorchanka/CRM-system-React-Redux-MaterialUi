import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
    default: {
        width: '100%',
        height: '40px',
        backgroundColor: '#1e1e1e',
        color: '#e1e1e1 !important',
        fontSize: '10px',
        padding: '8px 15px 7px',
        '&:hover': {
            color: '#7f9fd5 !important',
            backgroundColor: '#1e1e1e',
        },
        '&:active': {
            color: '#7f9fd5 !important',
            backgroundColor: '#1e1e1e',
        },
        '&:focus': {
            color: '#7f9fd5 !important',
            backgroundColor: '#1e1e1e',
        },
    },
});

export default function TabButton(props) {
    const classes = useStyles();

    return <Button id={props.id} className={classes.default + ' ' + props.className }
                   href={props.href} data-toggle={props.dataToggle} onClick={props.handleClick} startIcon={props.startIcon}>
        {props.label}
    </Button>;
}