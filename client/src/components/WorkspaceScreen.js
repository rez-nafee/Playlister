import React, { useContext, useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'

function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }

    var songCard = ""
    if (store.currentList){
        console.log(store.currentList.newList)
    }

    const handleKeyPress = useCallback((event) => {
        if(event.key.toString().toLowerCase() === 'z' && (event.ctrlKey || event.metaKey)){
            store.undo()
        }
        if(event.key.toString().toLowerCase() === 'y' && (event.ctrlKey || event.metaKey)){
            store.redo()
        }
    }) 

    useEffect(() => {
        // Add the event listener to the document
        document.addEventListener('keydown', handleKeyPress)

        // Remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress)
        }
    }, [handleKeyPress])


     // Check if we currently have a current list
     if(!store.currentList){
        store.history.push("/")
        return <></>
    }

    return (
        <Box 
        sx= {{height: '85%', overflow: 'scroll'}}>
        <List 
            id="playlist-cards" 
            sx={{ width: '100%'}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            }
         </List>            
         {modalJSX}
         </Box>
    )
}

export default WorkspaceScreen;