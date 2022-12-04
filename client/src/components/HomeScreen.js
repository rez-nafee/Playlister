import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'

// IMPORT OUR MUI COMPONENTS
import AddIcon from '@mui/icons-material/Add';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import ReactPlayer from 'react-player'


const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue]= useState('player');

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    function handleCreateNewList() {
        console.log("creating new playlist")
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

    let tabContent = ''
    if (value === 'player'){
        tabContent =
        <Grid item>
            <ReactPlayer 
                url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                width={'50vw'}
                height={'42vh'}
            />
            <Box
                sx={
                    { 
                        borderRadius: '1%',
                        border: 2,
                        borderColor: 'black'
                    }
                }
                backgroundColor = 'white'  
            >
                <Typography align='center'> Now Playing</Typography>
                <Typography align='left'> Playlist</Typography>
                <Typography align='left'> Song #</Typography>
                <Typography align='left'> Title: </Typography>
                <Typography align='left'> Artist: </Typography>
                <Stack 
                direction = "row"
                justifyContent="center" 
                alignItems="center" 
            >
                <Box
                    sx={
                        { 
                            borderRadius: '25%',
                            border: 2,
                            borderColor: 'black'
                        }
                    }
                    backgroundColor = 'beige'
                >
                    <IconButton size = 'large'>
                        <FastRewindIcon/>
                    </IconButton>
                    <IconButton size = 'large'>
                        <PlayArrowIcon />
                    </IconButton>
                    <IconButton size = 'large'>
                        <PauseIcon />
                    </IconButton>
                    <IconButton size = 'large'>
                        <FastForwardIcon />
                    </IconButton>
                </Box>
            </Stack>
            </Box>
            
        </Grid>
    }
    if (value === 'comments'){
        tabContent = 
        <Grid item>
            <Box
                backgroundColor = 'white'
                sx={{
                    width: '50vw',
                    height: '55vh'
                }}
                overflow = 'scroll'
            >
            </Box> 
            <TextField 
                label="Write a comment..." 
                variant="filled" 
                sx={{
                    width: '50vw',
                }}
            />
        </Grid>
    }

    let statusbar = 
    <Box id="playlister-statusbar">
        <IconButton 
            aria-label="add-list" 
            size = "large"  
            sx={{ 
                color: "white", 
                backgroundColor: "black", 
                borderRadius: "50%" 
            }}
            onClick={() => handleCreateNewList()}
        >
            <AddIcon>
            </AddIcon>
        </IconButton>
        <Typography variant="h4">Your Lists</Typography>
    </Box>
    if(store.currentList){
        console.log(store.currentList)
        statusbar = 
        <Box id="playlister-statusbar">
            <Typography variant="h4">{store.currentList.name}</Typography>
        </Box>
    }
    
    let style = {}
    if(disableBtns){
        style = {
            bgcolor: 'grey',
            cursor: 'not-allowed',
        }
    }

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
                        height: '69vh',
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
                            <Tabs
                                value = {value}
                                indicatorColor="secondary"
                                sx = {{
                                    backgroundColor: 'lightgrey',
                                    height: '1vh'
                                }}
                                variant='fullWidth'
                                onChange={(e, val) => setValue(val)}
                            >
                                <Tab value = 'player' label = 'Player'/>
                                <Tab value = 'comments' label = 'Comments' disabled = {!store.currentList}/>
                            </Tabs>
                        </Grid>
                        {
                            tabContent
                        }
                    </Grid>
                </Grid>
            </Grid>
            {
                statusbar
            }
            <MUIDeleteModal></MUIDeleteModal>
            {
                modalJSX
            }
        </>
        )
}

export default HomeScreen;