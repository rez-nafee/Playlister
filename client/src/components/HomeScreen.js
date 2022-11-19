import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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
            <div id="playlist-selector">
                <div id="playlist-selector-heading">
                    <Fab 
                        color="primary" 
                        aria-label="add"
                        id="add-list-button"
                        size = "medium"
                        onClick={handleCreateNewList}
                        sx={style}
                        disabled={disableBtns}
                    >
                        <AddIcon />
                    </Fab>
                    <Typography 
                    variant = "h3"
                    sx = {{color : 'black', size: "32px"}}
                    >
                        Your Lists
                    </Typography>
                </div>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
            <MUIDeleteModal></MUIDeleteModal>
        </>
        )
}

export default HomeScreen;