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
import YouTubePlayer from 'react-player/youtube'

const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [value, setValue]= useState('player');
    const [urlList, setUrlList] = useState([])
    const [url, setUrl] = useState('')
    const [playlist, setPlaylist] = useState(null);
    const [song, setSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlistPosition, setPlaylistPosition] = useState(null)
    const [key, setKey] = useState(null)


    // STATE VARIABLES FOR FOOL PROOFING THE VIDEO CONTROLS!
    const [disablePlay, updatePlay] = useState(false)
    const [disablePause, updatePause] = useState(false)
    const [disableBackward, updateBackward] = useState(false)
    const [disableForward, updateForward] = useState(false)

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

    useEffect(() => {
        if(urlList.length > 0){
            setPlaylistPosition(0)
            setSong(playlist.songs[0])
            setUrl(urlList[0])
            console.log('[HOME SCREEN] Playlist is loaded: ', playlist)
            console.log('[HOME SCREEN] Updating playlist listen count...')
            store.updateListens(playlist)
        }
        else{
            setUrl('')
        }
    }, [urlList])

    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;
      
        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }

    function loadVideos(playlist){
        console.log('[HOME SCREEN] Playlist clicked? ', playlist)
        var vidList = playlist.songs.map((a) => "https://www.youtube.com/watch?v=" + a.youTubeId)
        console.log('[HOME SCREEN] URL List:  ', vidList)
        console.log('[HOME SCREEN] URL List:  ', urlList)
        console.log('[HOME SCREEN] URL list the same?', )
        if(!arraysEqual(vidList, urlList)){
            console.log('[HOME SCREEN] DIFFERENT URL LIST LOADED...')
            setUrlList(vidList)
            setPlaylist(playlist)
        }
    }

    function pauseVideo(){
        console.log('[HOME SCREEN] Pausing video...')
        setIsPlaying(false)
    }

    function playVideo(){
        console.log('[HOME SCREEN] Playing video...')
        setIsPlaying(true)
    }

    function goBack(){
        console.log('[HOME SCREEN] Go back a song...')
        console.log('[HOME SCREEN] Current Position: ', playlistPosition)
        if (playlistPosition === 0){
            //We're at the start of the playlist 
            setKey(urlList[0])
            setUrl(urlList[0])
            setSong(playlist.songs[0])
            setIsPlaying(true)
            updateBackward(true)
        }else if (playlistPosition > 0){
            setKey(urlList[playlistPosition-1])
            setUrl(urlList[playlistPosition-1])
            setSong(playlist.songs[playlistPosition-1])
            setPlaylistPosition(playlistPosition-1)
            updateBackward(false)
        }
    }

    function goForward(){
        console.log('[HOME SCREEN] Go forward a song...')
        console.log('[HOME SCREEN] Current Position: ', playlistPosition)
        if (playlistPosition === urlList.length-1){
            //We're at the end of the playlist!
            setKey(urlList[urlList.length-1])
            setUrl(urlList[urlList.length-1])
            setSong(playlist.songs[playlistPosition])
            setIsPlaying(true)
            //Disable the forward button
            updateForward(true)
        }else if (playlistPosition < urlList.length){
            setKey(urlList[playlistPosition+1])
            setUrl(urlList[playlistPosition+1])
            setSong(playlist.songs[playlistPosition+1])
            setPlaylistPosition(playlistPosition+1)
            updateForward(false)
        }
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
                        loadVideos = {loadVideos}
                    />
                ))
    }

    let disableBtns = false

    if (store.listNameActive || store.currentModal === 'DELETE_LIST'){
        disableBtns = true
    }

    console.log(disableBtns)

    let tabContent = ''
    console.log('[HOME SCREEN] BACKWARD?: ', disableBackward)
    console.log('[HOME SCREEN] PLAY?: ', disablePlay)
    console.log('[HOME SCREEN] PAUSE?: ', disablePause)
    console.log('[HOME SCREEN] FORWARD?: ', disableForward)

    function onReady (){
        // The video is ready. Enable the play button! 
        updatePlay(true)
        if(playlistPosition !== playlist.songs.length-1)
            // The video is being played. Enable the forward button!
            updateForward(true)
        else
            // The video is being played. Disabled the forward button!
            updateForward(false)

        // CHECK IF WE CAN MOVE BACKWARDS IN THE PLAYLIST
        if(playlistPosition !== 0)
            updateBackward(true)
        else
            updateBackward(false)
    
        setKey(null)
    }

    function onPlay (){
        // The video is being played. Enable the play button!
        updatePlay(false)
        // The video is being played. Enable the pause button!
        updatePause(true)

        // CHECK IF WE CAN MOVE FORWARD IN THE PLAYLIST! 
        if(playlistPosition !== playlist.songs.length-1)
            // The video is being played. Enable the forward button!
            updateForward(true)
        else
            // The video is being played. Disabled the forward button!
            updateForward(false)

        // CHECK IF WE CAN MOVE BACKWARDS IN THE PLAYLIST
        if(playlistPosition !== 0)
            updateBackward(true)
        else
            updateBackward(false)

        // Start playing the video
        setIsPlaying(true)
    }

    function onStart (){
        // The video is being played. Enable the play button!
        updatePlay(true)
        // The video is being played. Enable the pause button!
        updatePause(true)
        // Start playing the video
        setIsPlaying(true)
    }

    function onPause (){
        // The video is paused. Disable the pause button!
        updatePause(false)
        // The video is paused. Enable the play button!
        updatePlay(true)
        // CHECK IF WE CAN MOVE FORWARD IN THE PLAYLIST! 
        if(playlistPosition !== playlist.songs.length-1)
            // The video is being played. Enable the forward button!
            updateForward(true)
        else
            // The video is being played. Disabled the forward button!
            updateForward(false)

        // CHECK IF WE CAN MOVE BACKWARDS IN THE PLAYLIST
        if(playlistPosition !== 0)
            updateBackward(true)
        else
            updateBackward(false)
        // Stop playing the video
        setIsPlaying(false)
    }

    function onEnded (){
        // The video has ended. Check if we have more songs to play
        goForward()
    }

   
    if (value === 'player'){
        tabContent =
        <Grid item>
            <YouTubePlayer
                key={key}
                url={url}
                playing = {isPlaying}
                onReady={() => onReady()}
                onStart={() => onStart()}
                controls = {true}
                width={'50vw'}
                height={'40vh'}
                onPlay = {() => onPlay()}
                onPause = {() => onPause()}
                onEnded = {() => onEnded()}
                pip={false}
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
                <Typography align='center'sx={{fontStyle: 'italic'}}>Now Playing:</Typography>
                <Typography align='left' display="inline" > Playlist:<Typography display="inline" sx={{ fontWeight: 'bold', textDecoration: 'none'}}>{playlist ? playlist.name : ''}</Typography></Typography> <br/>
                <Typography align='left' display="inline" > Song #: <Typography display="inline" sx={{ fontWeight: 'bold', textDecoration: 'none'}}>{playlistPosition === null ? '': (playlistPosition+1)}</Typography></Typography><br/>
                <Typography align='left' display="inline" > Title: <Typography display="inline" sx={{ fontWeight: 'bold', textDecoration: 'none'}}> {song ? song.title : ''}</Typography></Typography><br/>
                <Typography align='left' display="inline" > Artist:<Typography display="inline" sx={{ fontWeight: 'bold', textDecoration: 'none'}}> {song ? song.artist : ''}</Typography></Typography>
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
                    <IconButton 
                        size = 'large'
                        onClick={() => goBack()}
                        sx = {{
                            color: 'black'
                        }}
                        disabled = {!disableBackward}
                    >
                        <FastRewindIcon/>
                    </IconButton>
                    <IconButton 
                        size = 'large'
                        onClick={() => playVideo()}
                        sx = {{
                            color: 'black'
                        }}
                        disabled = {!disablePlay}
                    >
                        <PlayArrowIcon />
                    </IconButton>
                    <IconButton 
                        size = 'large'
                        onClick={() => pauseVideo()}
                        sx = {{
                            color: 'black'
                        }}
                        disabled = {!disablePause}
                    >
                        <PauseIcon />
                    </IconButton>
                    <IconButton 
                        size = 'large'
                        onClick={() => goForward()}
                        sx = {{
                            color: 'black'
                        }}
                        disabled = {!disableForward}
                    >
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