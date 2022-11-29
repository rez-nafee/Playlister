import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link, useHistory } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import "@fontsource/pacifico";
import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

import Linkie from '@mui/material/Link';

export default function SplashScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();
    return (
        <>
            <div id="splash-screen" style={{fontFamily: "Pacifico"}}>
                Playlister
                <Stack spacing={2} justifyContent="center" alignItems="center" sx={{padding: "25px"}}>
                    <Typography variant="h4" sx={{color : 'black'}}>WELCOME TO PLAYLISTER!</Typography>
                    <Typography variant="h4" sx={{color : 'black', fontStyle: 'italic'}}>Create, listen, & share your playlists with others!</Typography>
                </Stack>
                <Stack direction = "row" spacing={2} justifyContent="center" alignItems="center" sx={{padding: "50px"}}>
                    <Button variant="contained" sx={{backgroundColor : '#808080'}} href = '/login/'>Login</Button>
                    <Button variant="contained" sx={{backgroundColor : '#808080'}}>Continue as Guest</Button>
                    <Button variant="contained" sx={{backgroundColor : '#808080'}} href = '/register'>Create an Account</Button>
                </Stack>
                <Stack 
                    justifyContent="center" 
                    alignItems="center" 
                    sx={{
                        padding: "25px",
                        position: "absolute",
                        textAlign: "center",
                        bottom: "0px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0
                    }}
                >
                    <Typography variant="h6" sx={{color : 'black', fontSize : '12pt'}}>Copyright © <Link to='/'>Playlister 2022</Link></Typography>
                    <Typography variant="h6" sx={{color : 'black', fontSize : '12pt', fontStyle: 'italic'}}>Created by Rezvan Nafee</Typography>
                </Stack>    
            </div>
        </>
    )
}