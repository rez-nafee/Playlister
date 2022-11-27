import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

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

//IMPORT OUR BUTTONS
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
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


    async function handleDeleteList(event, id) {
        event.stopPropagation();
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

    console.log(disableBtns)
    
    let style = {}
    if(disableBtns){
        style = {
            bgcolor: 'grey',
            cursor: 'not-allowed',
        }
    }

    let cardElement =
        <Box
            id={idNamePair._id}
            className = {'list-box list-card ' + selectClass + " "}
            key={idNamePair._id}
            sx={{
                display: 'flex', 
                p: 3,
                height: '15vh'
            }}
            style={{fontSize: '32pt' }}
        >
            <Grid container
                 direction="row"
                 justifyContent="space-between"
                 alignItems="center"
            >
                <Grid item>
                    <Stack>
                        <Typography fontSize={'28pt'} >{idNamePair.name}</Typography>
                        <Typography fontSize={'10pt'} >By: </Typography>
                        <Typography fontSize={'10pt'}>Published: </Typography>
                    </Stack>
                </Grid>
                <Grid item>
                    <Grid container
                        direction = 'column'
                    >
                        <Grid item>
                            <Stack  
                            direction="row"
                            spacing = {3}>
                                <Box>
                                    <IconButton>
                                        <ThumbUpIcon>
                                        </ThumbUpIcon>
                                        <Typography>2</Typography>
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton>
                                        <ThumbDownIcon>
                                        </ThumbDownIcon>
                                        <Typography>2</Typography>
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item align = 'right'>
                            <Grid container
                                direction = 'row'
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Typography fontSize={'10pt'}>Listens:</Typography>
                                </Grid>
                                <Grid item align = 'right'>
                                    <IconButton>
                                        <KeyboardDoubleArrowDownIcon>
                                        </KeyboardDoubleArrowDownIcon>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>

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