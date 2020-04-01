import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import green from "@material-ui/core/colors/green";

const GreenCheckbox = withStyles({
    root: {
        '&$checked': {
            color: '#243070',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);


export default function CheckboxLabels(props) {
    return (
        <GreenCheckbox checked={props.checked} onChange={(e) => props.handleChange(e, undefined, props.parserId)}/>
    );
}