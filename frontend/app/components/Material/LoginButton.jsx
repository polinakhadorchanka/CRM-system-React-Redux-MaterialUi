import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    default: {
        width: '100%',
        height: '40px',
        backgroundColor: '#243070',
        color: '#e1e1e1 !important',
        fontSize: '12px',
        lineHeight: '14px',
        padding: '8px 15px 7px',
        '&:hover': {
            color: '#ffffff !important',
            backgroundColor: '#243070',
        },
        '&:active': {
            color: '#ffffff !important',
            backgroundColor: '#243070',
        },
        '&:focus': {
            color: '#ffffff !important',
            backgroundColor: '#243070',
        },
    },
});

export default function LoginButton(props) {
    const classes = useStyles();

    return <Button className={classes.default} href={props.href} type={props.type} >
        {props.label}
    </Button>;
}