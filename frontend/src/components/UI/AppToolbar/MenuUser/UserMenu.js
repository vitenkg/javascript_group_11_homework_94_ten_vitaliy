import React, {useState} from 'react';
import {Button, Menu, MenuItem} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {logoutUserRequest} from "../../../../store/actions/usersActions";
import {Link} from "react-router-dom";

const UserMenu = ({user}) => {
    const dispatch = useDispatch();
    const avatar = useSelector(state => state.users.avatar)
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} color="inherit">
                {avatar ? <img src={avatar} width="50" height="50"alt="avatar"/> : null}  Hello, {user.displayName}!

            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem>Profile</MenuItem>
                <MenuItem>My account</MenuItem>
                <MenuItem component={Link} to="/new">ADD new Event</MenuItem>
                <MenuItem onClick={() => dispatch(logoutUserRequest(user))}>Logout</MenuItem>
            </Menu>
        </>);
};

export default UserMenu;