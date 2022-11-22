import { useContext, useState } from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import SortIcon from '@mui/icons-material/Sort';

export default function FunctionBar(){
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const { store } = useContext(GlobalStoreContext);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuId = 'primary-search-account-menu';
    const menu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem>Names (A-Z)</MenuItem>
            <MenuItem>Publish Date (Newest)</MenuItem>
            <MenuItem>Listens (High to Low)</MenuItem>
            <MenuItem>Likes (High to Low)</MenuItem>
            <MenuItem>Dislikes (High to Low)</MenuItem>
        </Menu>   

    return (
        <>
            <Stack 
                direction="row"
                justifyContent="space-between" 
                alignItems="center"
                sx={{
                    padding : "5px",
                }}
            >
                <Stack direction= "row" spacing = {1}>
                    <IconButton>
                        <HomeIcon>
                        </HomeIcon>
                    </IconButton>
                    <IconButton>
                        <PersonIcon>
                        </PersonIcon>
                    </IconButton>
                    <IconButton>
                        <PeopleIcon>
                        </PeopleIcon>
                    </IconButton>
                </Stack>
                <TextField id="filled-basic" variant="filled" sx={{ flexGrow: 0.5 }}/>
                <IconButton>
                    <SortIcon
                         onClick={handleProfileMenuOpen}
                    >
                    </SortIcon>
                    {
                    menu
                    }
                </IconButton>
            </Stack>
        </>
    );
}