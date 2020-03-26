import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
    default: {
        width: '100%',
        marginBottom: '15px',
        '& label.Mui-focused': {
            color: '#1e1e1e',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#1e1e1e',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: '1px solid CF3F3B',
            },
            '&.Mui-focused fieldset': {
                border: '1px solid #1e1e1e',
            },
        }
    }
});

export default function LoginTextField(props) {
    const classes = useStyles();

    return <TextField variant="outlined" className={classes.default} required={props.required} type={props.type}
                      error={props.error} helperText={props.helperText} size="small"
                      label={props.label} name={props.name} maxLength={props.maxLength}
                      id={props.id} onChange={props.handleChange}
    />
}