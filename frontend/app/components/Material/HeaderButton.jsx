import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    header: {
        borderColor: '#e1e1e1',
        color: '#e1e1e1 !important',
        fontSize: '12px',
        lineHeight: '14px',
        marginRight: '10px',
        padding: '8px 15px 7px',
        '&:hover': {
            borderColor: '#7f9fd5',
            color: '#7f9fd5 !important',
        },
        '&:active': {
            borderColor: '#7f9fd5',
            color: '#7f9fd5 !important',
        },
        '&:focus': {
            borderColor: '#7f9fd5',
            color: '#7f9fd5 !important',
        },
    },
});


export default function HeaderButton(props) {
    const classes = useStyles();

    return <Button className={classes.header} variant="outlined" href={props.href} onClick={props.handleClick}>
        {props.label}
    </Button>;
}