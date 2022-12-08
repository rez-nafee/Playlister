import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import FunctionBarContext from '../context/FunctionBarContext';

import EditToolbar from './EditToolbar'
import FunctionBar from './FunctionBar';

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import "@fontsource/pacifico";

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const {sort, setSort, search, setSearch, isHome, setIsHome, isPeople, setIsPeople, isUser, setIsUser} = useContext(FunctionBarContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        store.logoutApp();
        auth.logoutUser();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
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
            <Link to='/login/' style={{ textDecoration: 'none' }}><MenuItem onClick={handleMenuClose}>Login</MenuItem></Link>
            <Link to='/register/' style={{ textDecoration: 'none' }}><MenuItem onClick={handleMenuClose}>Create New Account</MenuItem></Link>
        </Menu>
    );
    const loggedInMenu = 
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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        // if (store.currentList) {
        //     editToolbar = <EditToolbar />;
        // }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    const handleHomeClick = () => {
        console.log('[FUNCTION BAR] Home Button Clicked!')
        setIsHome(true)
        setIsPeople(false)
        setIsUser(false)
        store.closeCurrentList();
        store.history.push('/')
    }


    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: '#A8A8A8'}}>
                    <Toolbar>
                        <Typography                        
                            variant="h3"
                            noWrap
                            component="div"
                            p = {1}
                            sx={
                                {  
                                    // display: { xs: 'none', sm: 'block' },
                                    textDecoration: 'none', 
                                    color: 'red', 
                                    fontFamily: "Pacifico", 
                                    fontSize: '20pt' 
                                }
                            }
                            onClick = {() => handleHomeClick()}                        
                        >
                            Playlister
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                {getAccountMenu(auth.loggedIn)}
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {
                    menu
                }
            </Box>
            {auth.loggedIn ? <FunctionBar></FunctionBar> : <></>}
        </>

    );
}