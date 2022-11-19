import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function MUIEditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const [ title, setTitle ] = useState(store.currentSong.title);
    const [ artist, setArtist ] = useState(store.currentSong.artist);
    const [ youTubeId, setYouTubeId ] = useState(store.currentSong.youTubeId);

    function handleConfirmEditSong() {
        let newSongData = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        store.addUpdateSongTransaction(store.currentSongIndex, newSongData);        
    }

    function handleCancelEditSong() {
        store.hideModals();
    }

    console.log(store.currentModal)

    function handleUpdateTitle(event) {
        setTitle(event.target.value);
    }

    function handleUpdateArtist(event) {
        setArtist(event.target.value);
    }

    function handleUpdateYouTubeId(event) {
        setYouTubeId(event.target.value);
    }

    return (
        <Modal open={store.currentModal === 'EDIT_SONG'}>
            <Box>
            <div
                id="edit-song-modal"
                className="modal is-visible"
                data-animation="slideInOutLeft">
            <div
                id='edit-song-root'
                className="modal-root">
                <div
                    id="edit-song-modal-header"
                    className="modal-north">Edit Song:</div>
                <div
                    id="edit-song-modal-content"
                    className="modal-center">
                    <div className='update-song-container'>
                        <div id="title-prompt" className="modal-prompt">Title:</div>
                        <span>
                            <input 
                                id="edit-song-modal-title-textfield" 
                                className='modal-textfield' 
                                type="text" 
                                defaultValue={title} 
                                onChange={handleUpdateTitle} />
                        </span>
                    </div>
                    <div className='update-song-container'>
                        <div id="artist-prompt" className="modal-prompt">Artist:</div>
                        <span>
                            <input 
                                id="edit-song-modal-artist-textfield" 
                                className='modal-textfield' 
                                type="text" 
                                defaultValue={artist} 
                                onChange={handleUpdateArtist} />
                        </span>
                    </div>
                    <div className='update-song-container'>
                        <div id="you-tube-id-prompt" className="modal-prompt">You Tube ID:</div>
                        <span>
                            <input 
                                id="edit-song-modal-youTubeId-textfield" 
                                className='modal-textfield' 
                                type="text" 
                                defaultValue={youTubeId} 
                                onChange={handleUpdateYouTubeId} />
                        </span>
                    </div>
                </div>
                <div className="modal-south" id="edit-song-btns">
                        <input 
                            type="button" 
                            id="edit-song-confirm-button" 
                            className="modal-button" 
                            value='Confirm' 
                            onClick={handleConfirmEditSong} />
                        <input 
                            type="button" 
                            id="edit-song-cancel-button" 
                            className="modal-button" 
                            value='Cancel' 
                            onClick={handleCancelEditSong} />
                        </div>
            </div>
        </div>
        </Box>
        </Modal>
    );
}