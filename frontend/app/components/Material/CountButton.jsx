import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {red} from "@material-ui/core/colors";

const useStyles = makeStyles({
    header: {
        backgroundColor: red[500],
        color: '#e1e1e1',
        width: '250px',
        height: '60px',

        position: 'fixed',
        bottom: '6px',
        right: '24px',
        transition: 'bottom 0.3s ease-out',
        '&:hover': {
            backgroundColor: red[500],
            color: '#e1e1e1',
        },
        '&:active': {
            backgroundColor: red[500],
            color: '#e1e1e1',
        },
        '&:focus': {
            backgroundColor: red[500],
            color: '#e1e1e1',
        },
    },
    hide: {
        backgroundColor: red[500],
        color: '#e1e1e1',
        width: '250px',
        height: '60px',

        position: 'fixed',
        bottom: '-70px',
        right: '24px',
    }
});

export default function ContainedButtons(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Button variant="contained" className={props.count > 0 ? classes.header : classes.hide} onClick={props.handleClick} >
                {"show " + props.count + " new vacancies"}
            </Button>

        </div>
    );
}