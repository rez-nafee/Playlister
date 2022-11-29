import { useContext, useState } from 'react'
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

    console.log(store.currentList)
    console.log(store)

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

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    let disableBtns = false

    if (store.listNameActive || store.currentModal === 'DELETE_LIST'){
        disableBtns = true
    }
 
    let style = {}
    if(disableBtns){
        style = {
            bgcolor: 'grey',
            cursor: 'not-allowed',
        }
    }

    // let cardElement =
    //     <Box
    //         id={idNamePair._id}
    //         className = {'list-box list-card ' + selectClass + " "}
    //         key={idNamePair._id}
    //         sx={{
    //             display: 'flex', 
    //             p: 1,
    //             height: '30vh'
    //         }}
    //         style={{fontSize: '32pt' }}
    //     >
            // <Grid container
            //      direction="row"
            //      justifyContent="space-between"
            //      alignItems="center"
            // >
            //     <Grid item>
            //         <Stack>
            //             <Typography fontSize={'28pt'} >{idNamePair.name}</Typography>
            //             <Typography fontSize={'10pt'} >By: </Typography>
            //             <Typography fontSize={'10pt'}>Published: </Typography>
            //         </Stack>
            //     </Grid>
            //     <Grid item>
            //         <Grid container
            //             direction = 'column'
            //         >
            //             <Grid item>
            //                 <Stack  
            //                 direction="row"
            //                 spacing = {3}>
            //                     <Box>
            //                         <IconButton>
            //                             <ThumbUpIcon>
            //                             </ThumbUpIcon>
            //                             <Typography>2</Typography>
            //                         </IconButton>
            //                     </Box>
            //                     <Box>
            //                         <IconButton>
            //                             <ThumbDownIcon>
            //                             </ThumbDownIcon>
            //                             <Typography>2</Typography>
            //                         </IconButton>
            //                     </Box>
            //                 </Stack>
            //             </Grid>
            //             <Grid item align = 'right'>
            //                 <Grid container
            //                     direction = 'row'
            //                     justifyContent="space-between"
            //                     alignItems="center"
            //                 >
            //                     <Grid item>
            //                         <Typography fontSize={'10pt'}>Listens:</Typography>
            //                     </Grid>
            //                     <Grid item align = 'right'>
            //                         <IconButton>
            //                             <KeyboardDoubleArrowDownIcon>
            //                             </KeyboardDoubleArrowDownIcon>
            //                         </IconButton>
            //                     </Grid>
            //                 </Grid>
            //             </Grid>
            //         </Grid>
            //     </Grid>
            // </Grid>
    //         <Box>
            // {
            //     idNamePair.playlist.songs.map((song, index) => (
            //         <SongCard
            //             id={'playlist-song-' + (index)}
            //             key={'playlist-song-' + (index)}
            //             index={index}
            //             song={song}
            //         />
            //     ))  
            // }
    //         </Box>
    //     </Box>


    // CHECK IF THE LIST HAS BEEN PUBLISHED BY THE USER OR NOT 
    let publishedInfo = ''
    let publishedStats = ''
    let playlistListens = ''
    if (!idNamePair.playlist.published){
        console.log("PLAYLIST IS NOT PUBLISHED")
        publishedInfo = 
        <Stack>
            <Typography fontSize={'28pt'} >{idNamePair.name}</Typography>
            <Typography fontSize={'10pt'} display="inline">By: <Typography fontSize='10pt' sx={{color: 'blue'}} display="inline"> {idNamePair.playlist.author}</Typography></Typography>
        </Stack>
    }else {
        console.log("PLAYLIST IS PUBLISHED!")
        publishedInfo = 
        <Stack>
            <Typography fontSize={'28pt'} >{idNamePair.name}</Typography>
            <Typography fontSize={'10pt'} display="inline">By: <Typography fontSize='10pt' sx={{color: 'blue'}} display="inline"> {idNamePair.playlist.author}</Typography></Typography>
            <Typography fontSize={'10pt'} display='inline'>Published: <Typography fontSize='10pt' sx={{color: 'green'}} display="inline">{idNamePair.playlist.date}</Typography></Typography>
        </Stack>
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
        playlistListens = 
        <Typography fontSize={'10pt'} display='inline'>Listens: <Typography fontSize='10pt' sx={{color: 'red'}} display="inline">0</Typography></Typography>
        
    }
    

    console.log(store.currentList)

    let cardElement = 
        <Accordion
            expanded = {idNamePair._id === currentListID}
            sx = {{
                mb : 2,
                pointerEvents: "none",
            }}
        >
            <AccordionSummary
                id={idNamePair._id}
                className = {'list-box list-card ' + selectClass + " "}
                key={idNamePair._id}
                sx={{
                    display: 'flex', 
                    p: 1,
                    height: '30vh',
                    fontSize: '32pt',
                    pointerEvents : 'auto'
                }}
                onDoubleClick = {handleToggleEdit}
                expandIcon = {
                    <KeyboardDoubleArrowDownIcon
                        sx={{
                            pointerEvents: "auto"
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
                    height: '40vh',
                    overflow: "scroll",
                    pointerEvents: "auto"
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
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mb = {2}
                >
                    <Button
                        sx = {{
                            color : 'black',
                            fontSize: 18
                        }}
                    >
                        +
                    </Button>
                </Box>
        
                <Stack
                    direction = 'row'
                    alignItems= 'center'
                    justifyContent= 'space-between'
                >
                    <Stack
                        direction = 'row'
                        alignItems= 'center'
                        spacing = {1}
                    >
                        <Button variant = 'contained'> Undo</Button>
                        <Button variant = 'contained'> Redo </Button>
                    </Stack>

                    <Stack
                        direction = 'row'
                        alignItems= 'center'
                        spacing = {1}
                    >
                        <Button variant = 'contained'>Publish</Button>
                        <Button variant = 'contained' onClick={() => handleDeleteList()}>Delete</Button>
                        <Button variant = 'contained'>Duplicate</Button>
                    </Stack>
                </Stack>
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