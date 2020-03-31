import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from "@material-ui/core/IconButton";
import StarsIcon from '@material-ui/icons/Stars';

export default function SimpleMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <span>
            <IconButton aria-label="add to board" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                <StarsIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {props.values.map(function (el) {
                    return <MenuItem onClick={(e) => props.handleChooseStatus(e, handleClose)}>{el}</MenuItem>;
                })}
            </Menu>
        </span>
    );
}