import { useContext, useState, useRef, useEffect } from 'react'
import { GlobalStoreContext } from '../store'

import SongCard from './SongCard.js'

//IMPORT OUR MATERIAL UI COMPONENTS
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import {Accordion, AccordionSummary, AccordionDetails} from '@mui/material/'

//IMPORT OUR BUTTONS
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState('');
 
    const listCard = useRef(null);

    useEffect(() => {
        if (listCard.current) {
          listCard.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      },
      [store.currentList])

    const {idNamePair, selected} = props;

    function handleLoadList() {
        console.log('ID of List: ', idNamePair._id)
        // CHANGE THE CURRENT LIST
        store.setCurrentList(idNamePair._id);
    }

    function handleClose() {
        store.closeCurrentList();
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    // Check if the currentList is selected
    let currentListID = null
    if (store.currentList){
        currentListID = store.currentList._id
    }

    async function handleDeleteList() {
        console.log("List to be deleted: ", idNamePair._id)
        // Grab the lists id that is being marked for deletion by the user
        store.markListForDeletion(idNamePair._id);
    }

    function handlePublishList(){
        console.log("[LISTCARD] Publishing Playlist: ", store.currentList._id)
        store.publishList()
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text ? text : idNamePair.name);
            toggleEdit();
        }
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }


    function handleDuplicate(){
        store.duplicatePlaylist()
    }

    function handleAddNewSong() {
        console.log("adding a new song...")
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }

    let disableAdd = store.canAddNewSong()
    let disableUndo = store.canUndo()
    let disableRedo = store.canRedo()
    let disalbePublish = true
    let disableDuplicate = true 
    let disableDelete = true 
   
    if (store.isEditSongModalOpen() || store.isRemoveSongModalOpen() || store.isDeleteListModalOpen()){
        console.log('[LIST CARD] MODAL IS OPEN --> DISABLED ALL BUTTONS!')
        disableAdd = false
        disableUndo = false
        disableRedo = false
        disalbePublish = false
        disableDuplicate = false
        disableDelete = false
    }

    console.log('[LISTCARD] Add disabled?: ', disableAdd)
    console.log('[LISTCARD] Undo disabled?: ', disableUndo)
    console.log('[LISTCARD] Redo disabled?: ', disableRedo)
    console.log('[LISTCARD] Publish disabled?: ', disalbePublish)
    console.log('[LISTCARD] Duplicate disabled?: ', disableDuplicate)


    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }

    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    // CHECK IF THE LIST HAS BEEN PUBLISHED BY THE USER OR NOT 
    let publishedInfo = ''
    let publishedStats = ''
    let playlistListens = ''
    let playlistSongs = ''
    let addSongs = ''
    let controls = ''
    if (!idNamePair.playlist.published){
        console.log("PLAYLIST IS NOT PUBLISHED")

        publishedInfo = 
        <Stack>
            <Typography fontSize={'28pt'} >{idNamePair.name}</Typography>
            <Typography fontSize={'10pt'} display="inline">By: <Typography fontSize='10pt' sx={{color: 'blue'}} display="inline"> {idNamePair.playlist.author}</Typography></Typography>
        </Stack>

        playlistSongs = 
        <Box
            p = {2}
            sx = {{
                backgroundColor: '#A9A9A9',
                border: 2,
                borderRadius: '2%',
                height: '35vh',
                overflow: 'scroll'
            }}
        >
            {
                idNamePair.playlist.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))
            }
        </Box>
        
        addSongs = 
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p = {1}
        >
            <Button
                disabled = {!disableAdd}
                className = 'list-card'
                sx = {{
                    fontSize: 16,
                }}
                variant = 'contained'
                onClick={() => handleAddNewSong()}
            >
                +
            </Button>
        </Box>

        controls = 
        <Stack
            direction = 'row'
            alignItems= 'center'
            justifyContent= 'space-between'
            p= {1}
        >
            <Stack
                direction = 'row'
                alignItems= 'center'
                spacing = {1}
            >
                <Button disabled = {!disableUndo} variant = 'contained' onClick={() => handleUndo()}> Undo</Button>
                <Button disabled = {!disableRedo} variant = 'contained' onClick={() => handleRedo()} > Redo </Button>
            </Stack>

            <Stack
                direction = 'row'
                alignItems= 'center'
                spacing = {1}
            >
                <Button disabled = {!disalbePublish} variant = 'contained' onClick={() => handlePublishList()}>Publish</Button>
                <Button disabled = {!disableDelete} variant = 'contained' onClick={() => handleDeleteList()}>Delete</Button>
                <Button disabled = {!disableDuplicate} variant = 'contained' onClick={() => handleDuplicate()}>Duplicate</Button>
            </Stack>
        </Stack>
    }
    else {
        // PLAYLIST IS PUBLISHED
        console.log("PLAYLIST IS PUBLISHED!")
        // SHOW THE PUBLISHED INFO --> NAME of the playlist, AUTHOR of the playlist, and DATE of when it was published
        publishedInfo = 
        <Stack>
            <Typography fontSize={'28pt'} >{idNamePair.name}</Typography>
            <Typography fontSize={'10pt'} display="inline">By: <Typography fontSize='10pt' sx={{color: 'blue'}} display="inline"> {idNamePair.playlist.author}</Typography></Typography>
            <Typography fontSize={'10pt'} display='inline'>Published: <Typography fontSize='10pt' sx={{color: 'green'}} display="inline">{idNamePair.playlist.date}</Typography></Typography>
        </Stack>

        // SHOW THE STATS OF THE PLAYLIST --> # of LIKES & of DISLIKES
        publishedStats =
        <Stack  
            direction="row"
            spacing = {3}>
            <Box>
                <IconButton>
                        <ThumbUpIcon>
                        </ThumbUpIcon>
                        <Typography>{idNamePair.playlist.likes}</Typography>
                </IconButton>
            </Box>
            <Box>
                <IconButton>
                    <ThumbDownIcon>
                    </ThumbDownIcon>
                    <Typography>{idNamePair.playlist.dislikes}</Typography>
                    </IconButton>
            </Box>
        </Stack>

        // SHOW THE # OF LISTENS FOR THE PLAYLIST
        playlistListens = 
        <Typography fontSize={'10pt'} display='inline'>Listens: <Typography fontSize='10pt' sx={{color: 'red'}} display="inline">0</Typography></Typography>
    
        // SHOW THE SONGS AS TYPOGRAPHY
        playlistSongs = 
        <Box
            p = {2}
            sx = {{
                backgroundColor: 'beige',
                border: 2,
                borderRadius: '5%' 
            }}
            
        >
            {
                idNamePair.playlist.songs.map((song, index) => (
                    <Typography
                        id={'playlist-song-' + (index)}
                        fontSize='18pt'
                        color = ''
                    >
                        {index + 1}. {song.title} by {song.artist}
                    </Typography>
                ))
            }
        </Box>  

        addSongs = 
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb = {2}
        >
        </Box>

        controls = 
        <Stack
            direction = 'row'
            alignItems= 'center'
            justifyContent= 'flex-end'
        >
            <Stack
                direction = 'row'
                alignItems= 'center'
                spacing = {2}
            >
                <Button disabled = {!disableDuplicate} variant = 'contained' onClick={() => handleDuplicate()}>Duplicate</Button>
                <Button disabled = {!disableDelete} variant = 'contained' onClick={() => handleDeleteList()}>Delete</Button>
            </Stack>
        </Stack>
    }
    
    console.log('[LISTCARD] Making card for: ', idNamePair)
    let mouse = idNamePair.playlist.published ? 'none' : 'auto'
    let cardElement = 
        <Accordion
            expanded = {idNamePair._id === currentListID}
            sx = {{
                mb : 2,
                pointerEvents: "none",
                border: 1,
            }}
        >
            <AccordionSummary
                ref = {idNamePair._id === currentListID ? listCard  : null}
                id={idNamePair._id}
                className = {'list-box list-card ' + selectClass + " "}
                key={idNamePair._id}
                sx={{
                    display: 'flex', 
                    p: 1,
                    height: '25vh',
                    fontSize: '32pt',
                    pointerEvents : mouse,
                    border: 1,
                }}
                onDoubleClick = {handleToggleEdit}
                expandIcon = {
                    <KeyboardDoubleArrowDownIcon
                        sx={{
                            pointerEvents: "auto",
                        }}
                        onClick = {() => idNamePair._id === currentListID ? handleClose() : handleLoadList()}
                    />
                }
            >
                            <Grid container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                            <Grid item>
                                {
                                    publishedInfo
                                }
                            </Grid>
                            <Grid item>
                                <Grid container
                                    direction = 'column'
                                >
                                    <Grid item>
                                        {
                                            publishedStats
                                        }
                                    </Grid>
                                    <Grid item align = 'right'>
                                        <Grid container
                                            direction = 'row'
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                {
                                                    playlistListens
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails
                m = {0}
                sx = {{
                    overflow: "scroll",
                    pointerEvents: "auto"
                }}
            >
                {
                    playlistSongs
                }
                {
                    addSongs
                }
                {
                    controls
                }
            </AccordionDetails>
        </Accordion>
    
    

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;