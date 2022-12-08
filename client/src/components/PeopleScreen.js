import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import FunctionBarContext from '../context/FunctionBarContext';
import FunctionBar from './FunctionBar'
import AuthContext from '../auth'

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

export default function PeopleScreen(){
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const {sort, setSort, search, setSearch, isHome, setIsHome, isPeople, setIsPeople, isUser, setIsUser} = useContext(FunctionBarContext)
    const [value, setValue]= useState('player');
    const [urlList, setUrlList] = useState([])
    const [url, setUrl] = useState('')
    const [playlist, setPlaylist] = useState(null);
    const [song, setSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [playlistPosition, setPlaylistPosition] = useState(null)
    const [key, setKey] = useState(null)

    //CAN THE USER COMMENT ON THE PLAYLIST THAT IS SELECTED?
    const [canComment, setCanComment] = useState(false);
    const [comment, setComment] = useState('');

    // STATE VARIABLES FOR FOOL PROOFING THE VIDEO CONTROLS!
    const [disablePlay, updatePlay] = useState(false)
    const [disablePause, updatePause] = useState(false)
    const [disableBackward, updateBackward] = useState(false)
    const [disableForward, updateForward] = useState(false)

    useEffect(() => {
        if(search !== '' || search === null)
            setSearch('')
        store.loadIdNamePairsPublished();
        setIsHome(false)
        setIsPeople(true)
        setIsUser(false)
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
            console.log('[PEOPLE SCREEN] Playlist is loaded: ', playlist)
            console.log('[PEOPLE SCREEN] Updating playlist listen count...')
            if(playlist.published)
                setCanComment(true)
            else{
                setCanComment(false)
            }
            store.updateListens(playlist, '/people')
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

      function loadVideos(list){
        console.log('[PEOPLE SCREEN] Playlist clicked? ', list)
        setValue('player')
        var vidList = list.songs.map((a) => "https://www.youtube.com/watch?v=" + a.youTubeId)
        console.log('[PEOPLE SCREEN] URL List:  ', vidList)
        console.log('[PEOPLE SCREEN] URL List:  ', urlList)
        console.log('[PEOPLE SCREEN] URL list the same?', !arraysEqual(vidList, urlList))
        if(!arraysEqual(vidList, urlList)){
            console.log('[PEOPLE SCREEN] DIFFERENT URL LIST LOADED...')
            setUrlList(vidList)
            setIsPlaying(false)
            setPlaylist(list)
            if(playlist.published)
                setCanComment(true)
        }
        if(vidList.length === 0){
            console.log('[PEOPLE SCREEN] NO SONGS LOADED...')
            setUrlList([])
            setPlaylist(null)
            setPlaylistPosition(null)
            setSong(null)
            setCanComment(false)
        }
    }

    function pauseVideo(){
        console.log('[PEOPLE SCREEN] Pausing video...')
        setIsPlaying(false)
    }

    function playVideo(){
        console.log('[PEOPLE SCREEN] Playing video...')
        setIsPlaying(true)
    }

    function goBack(){
        console.log('[PEOPLE SCREEN] Go back a song...')
        console.log('[PEOPLE SCREEN] Current Position: ', playlistPosition)
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
        console.log('[PEOPLE SCREEN] Go forward a song...')
        console.log('[PEOPLE SCREEN] Current Position: ', playlistPosition)
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
        store.history.push('/')
    }

    let listCard = "";
    if (store && store.idNamePairsPublished.length > 0) {
        switch(sort){
            case 'Names (A-Z)':
                listCard =
                // If search field is present and the sort is selected for Names (A-Z)
                store.idNamePairsPublished.sort((a,b) => a.name.localeCompare(b.name, undefined , {numeric: true, sensitivity: 'base'})).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Publish Date (Newest)':
                listCard =
                store.idNamePairsPublished.sort((a,b) => a.playlist.date.localeCompare(b.playlist.date, undefined , {numeric: true, sensitivity: 'base'})).reverse().map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Listens (High to Low)':
                listCard =
                // If search field is present 
                store.idNamePairsPublished.sort((a,b) => b.playlist.listens - a.playlist.listens ).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Likes (High to Low)':
                listCard =
                // If search field is present 
                store.idNamePairsPublished.sort((a,b) => b.playlist.likes - a.playlist.likes).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Dislikes (High to Low)':
                listCard =
                // If search field is present 
                store.idNamePairsPublished.sort((a,b) => b.playlist.dislikes - a.playlist.dislikes).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            default:
                listCard =
                // If search field is present 
                store.idNamePairsPublished.map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
        }
    }
    
    if (store && store.idNamePairsPublished.length > 0 && search) {
        switch(sort){
            case 'Names (A-Z)':
                listCard =
                // If search field is present and the sort is selected for Names (A-Z)
                store.idNamePairsPublished.filter((a) => a.playlist.name.includes(search)).sort((a,b) => a.name.localeCompare(b.name, undefined , {numeric: true, sensitivity: 'base'})).reverse().map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Publish Date (Newest)':
                listCard =
                // If search field is present and the sort is selected for Names (A-Z)
                store.idNamePairsPublished.filter((a) => a.playlist.name.includes(search)).sort((a,b) => a.playlist.date.localeCompare(b.playlist.date, undefined , {numeric: true, sensitivity: 'base'})).reverse().map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Listens (High to Low)':
                listCard =
                // If search field is present 
                store.idNamePairsPublished.filter((a) => a.playlist.name.includes(search)).sort((a,b) => b.playlist.listens - a.playlist.listens ).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Likes (High to Low)':
                listCard =
                // If search field is present 
                store.idNamePairsPublished.filter((a) => a.playlist.name.includes(search)).sort((a,b) => b.playlist.likes - a.playlist.likes).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            case 'Dislikes (High to Low)':
                listCard =
                // If search field is present 
                store.idNamePairsPublished.filter((a) => a.playlist.name.includes(search)).sort((a,b) => b.playlist.dislikes - a.playlist.dislikes).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
                break;
            default:
                listCard =
                // If search field is present 
                store.idNamePairsPublished.filter((a) => a.playlist.name.includes(search)).map((pair) => 
                (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                        songPosition = {playlistPosition}
                        loadVideos = {loadVideos}
                    />
                ))
        }
    }
    

    let disableBtns = false

    if (store.listNameActive || store.currentModal === 'DELETE_LIST'){
        disableBtns = true
    }

    console.log(disableBtns)

    console.log('[PEOPLE SCREEN] BACKWARD?: ', disableBackward)
    console.log('[PEOPLE SCREEN] PLAY?: ', disablePlay)
    console.log('[PEOPLE SCREEN] PAUSE?: ', disablePause)
    console.log('[PEOPLE SCREEN] FORWARD?: ', disableForward)

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

    let tabContent = ''
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

    let commentList = [];
    console.log('[PEOPLE SCREEN] IDNAMEPAIRS ARE: ', store.idNamePairs)
    if (store.idNamePairsPublished !== null && playlist !== null){
        commentList = store.idNamePairsPublished.filter((a) => a._id === playlist._id)[0].playlist.comments
        console.log('[PEOPLE SCREEN] Comments are: ', commentList)
    }

    if (value === 'comments' && canComment){
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
                {
                    commentList.map((a) => 
                        <Box
                            p={2}
                            m= {2}
                            sx={{
                                width: '45vw',
                                backgroundColor: '#888888',
                                borderRadius: '10%',
                                border: 2 
                            }}
                        >
                            <Typography
                                sx = {{
                                    color: 'blue',
                                    textDecoration: 'underline'
                                }}
                                mb={1}
                            >
                                {a.author}
                            </Typography>
                            <Typography
                                sx = {{
                                    color:'white'
                                }}
                                mt={1}
                            >
                                {a.comment}
                            </Typography>
                        </Box>
                    )
                }
            </Box> 
            <TextField 
                label="Write a comment..." 
                variant="filled" 
                sx={{
                    width: '50vw',
                }}
                value = {comment}
                onChange = {(e) => setComment(e.target.value)}
                onKeyDown = {(e)=> {
                    if(e.key === 'Enter'){
                        console.log('[PEOPLE SCREEN] Enter key was pressed')
                        // Update the comment section for this playlist
                        console.log('[PEOPLE SCREEN] IS THE COMMENT EMPTY?', comment === '')
                        store.updateComments(comment, playlist, '/people')
                        // Get rid of the comment that was posted and reset the 
                        setComment('')
                    }
                }}
                disabled = {!auth.loggedIn}
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

    console.log('[PEOPLE SCREEN] PAIRS ARRAY: ', store.idNamePairsPublished)
    return (
        <> 
            {auth.loggedIn ? <></> : <FunctionBar></FunctionBar>}
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
                                <Tab value = 'comments' label = 'Comments' disabled = {!canComment}/>
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