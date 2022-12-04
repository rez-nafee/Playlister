import React, { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    const handleDragStart = (event) => {
        event.dataTransfer.setData("drag-start-song", event.target.id)
    }
    
    const handleDrop = (event) => {
        event.preventDefault()
        console.log("Drag started from: ", event.dataTransfer.getData("drag-start-song").match((/(\d+)/))[0])
        console.log("Drag ended from: ", event.target.id.match((/(\d+)/))[0])
        store.addMoveSongTransaction(event.dataTransfer.getData("drag-start-song").match((/(\d+)/))[0], event.target.id.match((/(\d+)/))[0])
    }
    
    const handleDragOver = (event) => {
        event.preventDefault();
    }

    function handleRemoveSong(event) {
        event.preventDefault();
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    let disableRemove = false

    if (store.currentModal === 'EDIT_SONG' || store.currentModal === 'REMOVE_SONG'){
        disableRemove = true
    }


    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            {index + 1}. {song.title} by {song.artist}
            <input
                type="button"
                id={"remove-song-" + index}
                disabled = {disableRemove}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
        </div>
    );
}

export default SongCard;