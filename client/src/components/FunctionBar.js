import { useContext, useState} from 'react';
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import FunctionBarContext from '../context/FunctionBarContext';
import { useHistory } from 'react-router-dom'


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
    const { store } = useContext(GlobalStoreContext);
    const {sort, setSort, search, setSearch, isHome, setIsHome, isPeople, setIsPeople, isUser, setIsUser} = useContext(FunctionBarContext)
    store.history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSelection = (e) => {
        setSort(e.target.innerText)
        handleMenuClose()
    }

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
            <MenuItem onClick={(e) => handleSelection(e)}>Names (A-Z)</MenuItem>
            <MenuItem onClick={(e) => handleSelection(e)}>Publish Date (Newest)</MenuItem>
            <MenuItem onClick={(e) => handleSelection(e)}>Listens (High to Low)</MenuItem>
            <MenuItem onClick={(e) => handleSelection(e)}>Likes (High to Low)</MenuItem>
            <MenuItem onClick={(e) => handleSelection(e)}>Dislikes (High to Low)</MenuItem>
        </Menu> 
        
    let home = 'green'
    let people = ''
    let user = ''

    let homeSelected = 'white'
    let peopleSelected = ''
    let userSelected = ''

    if(isHome){
        home = 'green'
        people = ''
        user = ''

        homeSelected = 'white'
        peopleSelected = ''
        userSelected = ''
    }

    if(isPeople){
        home = ''
        people = 'green'
        user = ''

        homeSelected = ''
        peopleSelected = 'white'
        userSelected = ''
    }

    if(isUser){
        home = ''
        people = ''
        user = 'green'

        homeSelected = ''
        peopleSelected = ''
        userSelected = 'white'
    }

    console.log('[FUNCTION BAR] Home? ', isHome)
    console.log('[FUNCTION BAR] People? ', isPeople)
    console.log('[FUNCTION BAR] User? ', isUser)

    console.log('[FUNCTION BAR] Home Color? ', home)
    console.log('[FUNCTION BAR] People Color? ', people)
    console.log('[FUNCTION BAR] User Color? ', user)

    const handleHomeClick = () => {
        console.log('[FUNCTION BAR] Home Button Clicked!')
        setIsHome(true)
        setIsPeople(false)
        setIsUser(false)
        store.history.push('/')
    }

    const handlePeopleClick = () => {
        console.log('[FUNCTION BAR] People Button Clicked!')
        setIsHome(false)
        setIsPeople(true)
        setIsUser(false)
        store.history.push('/people')
    }

    const handleUserClick = () => {
        console.log('[FUNCTION BAR] User Button Clicked!')
        setIsHome(false)
        setIsPeople(false)
        setIsUser(true)
        store.history.push('/user')
    }

    let searchBar = 
    <TextField id="filled-basic" variant="filled" sx={{ flexGrow: 0.5 }} label="Search Playlists by Name" onChange={(e) => setSearch(e.target.value)}/>

    if(isUser){
        searchBar =
        <TextField id="filled-basic" variant="filled" sx={{ flexGrow: 0.5 }} label="Search Playlists by User" onChange={(e) => setSearch(e.target.value)}/>
    }
    
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
                    <IconButton
                        sx = {{
                            backgroundColor: home,
                            color: homeSelected
                        }}
                        onClick = {() => handleHomeClick()}
                    >
                        <HomeIcon>
                        </HomeIcon>
                    </IconButton>
                    <IconButton
                        sx = {{
                            backgroundColor: people,
                            color: peopleSelected
                        }}
                        onClick = {() => handlePeopleClick()}
                    >
                        <PeopleIcon>
                        </PeopleIcon>
                    </IconButton>
                    <IconButton
                        sx = {{
                            backgroundColor: user,
                            color: userSelected
                        }}
                        onClick = {() => handleUserClick()}
                    >
                        <PersonIcon>
                        </PersonIcon>
                    </IconButton>
                </Stack>
                {
                    searchBar
                }
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