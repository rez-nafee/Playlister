import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import YoutubePlayer from 'react-youtube-player';
import FunctionBar from './FunctionBar';

// IMPORT OUR MUI COMPONENTS
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';


const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store && store.idNamePairs.length > 0) {
        listCard =
                // Sorts the List by their name and then create the list card elements for the user.
                store.idNamePairs.sort((a,b) => a.name.localeCompare(b.name, undefined , {numeric: true, sensitivity: 'base'})).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
    }

    let disableBtns = false

    if (store.listNameActive || store.currentModal === 'DELETE_LIST'){
        disableBtns = true
    }

    console.log(disableBtns)
    
    let style = {}
    if(disableBtns){
        style = {
            bgcolor: 'grey',
            cursor: 'not-allowed',
        }
    }

    console.log(store.idNamePairs)
    return (
        <> 
            <Grid container 
                spacing={1}
                direction="row"
                justifyContent="space-around"
                alignItems="center"
            >
                <Grid item
                    sx = {{
                        width: '50vw',
                        height: '70vh',
                        overflow: 'scroll' 
                    }}
                >  
                    {
                        listCard
                    }
                </Grid>
                <Grid item
                    sx = {{
                        width: '50vw',
                        height: '70vh'
                    }}
                >
                    <Grid container direction = "column">
                        <Grid item>
                            <Button variant="contained" >Player</Button>
                            <Button variant="contained" >Comments</Button>
                        </Grid>
                        <Grid item>
                            <YoutubePlayer></YoutubePlayer>
                            <Typography align='center'> Now Playing</Typography>
                            <Typography align='left'> Song #</Typography>
                            <Typography align='left'> Title: </Typography>
                            <Typography align='left'> Artist: </Typography>
                            <Stack direction = "row" spacing={2} justifyContent="center" alignItems="center">
                                <IconButton aria-label="delete">
                                    <FastRewindIcon/>
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <PlayArrowIcon />
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <PauseIcon />
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <FastForwardIcon />
                                </IconButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Box id="playlister-statusbar">
                <IconButton 
                    aria-label="add-list" 
                    size = "large"  
                    sx={{ 
                    color: "white", 
                    backgroundColor: "black", 
                    borderRadius: "50%" 
                    }
                }>
                    <AddIcon></AddIcon>
                </IconButton>
                <Typography variant="h4">Your Lists</Typography>
            </Box>
        </>
        )
}

export default HomeScreen;