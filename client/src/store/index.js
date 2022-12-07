import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    LOAD_ID_NAME_PAIRS_PUBLISHED: "LOAD_ID_NAME_PAIRS_PUBLISHED",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_CURRENT_LIST_PUBLISHED: "SET_CURRENT_LIST_PUBLISHED",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    SET_COMMENTS: 'SET_COMMENTS',
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        idNamePairsPublished: [],
        comments : null, 
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter++,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter++,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS_PUBLISHED: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter++,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: payload,
                    comments : store.comments
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : store.comments
                });
            }
            case GlobalStoreActionType.SET_COMMENTS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished,
                    comments : payload
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    idNamePairsPublished: store.idNamePairsPublished
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    store.updateComments = function (comment, playlist, destination){
        async function asyncGetPlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log('[STORE] GOT THE PLAYLIST. UPDATING COMMENTS....')
                let obj = {
                    comment: comment,
                    author: auth.user.firstName + " " + auth.user.lastName
                }
                playlist.comments.push(obj)
                console.log('[STORE] UPDATED COMMENTS ARE: ', playlist)
                store.comments = playlist.comments
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        console.log('[STORE] SUCCESSFUL IN UPDATING PLAYLIST')
                        // CHECK THE DESTINATION WE NEED TO FORWARD TO --> 
                        if(destination === '/'){
                            store.history.push(destination);
                            store.loadIdNamePairs();
                        }
                        if(destination === '/people' || destination === '/user'){
                            console.log('[STORE] SUCCESSFUL IN UPDATING PLAYLIST... RELOAD PUBLISHED PAIRS!')
                            store.history.push(destination);
                            store.loadIdNamePairsPublished();
                        }
                    }
                }
                updateList(playlist);
            }
        }
        console.log('[STORE] Adding comment to the playlist...')
        console.log('[STORE] Comment is: ', comment)
        console.log('[STORE] Playlist is: ', playlist)
        console.log('[STORE] Destination is: ', destination)
        if (comment !== ''){
            asyncGetPlaylist(playlist._id);
        }
    }

    store.updateListens = function (playlist, destination){
        async function asyncGetPlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                console.log('[STORE] GOT THE PLAYLIST. UPDATING LISTENS....')
                let playlist = response.data.playlist;
                playlist.listens = playlist.listens + 1;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        console.log('[STORE] SUCCESSFUL IN UPDATING PLAYLIST')
                        // CHECK THE DESTINATION WE NEED TO FORWARD TO --> 
                        if(destination === '/'){
                            store.history.push(destination)
                            store.loadIdNamePairs()
                        }
                        if(destination === '/people' || destination === '/user'){
                            store.history.push(destination)
                            store.loadIdNamePairsPublished()
                        }

                    }
                }
                updateList(playlist);
            }
        }
        console.log('[STORE] Updating the listens of the following playlist: ', playlist)
        if(playlist.published)
            asyncGetPlaylist(playlist._id);
    }
    store.updatePlaylistLikesById = function(id, likes, dislikes, active){
        async function asyncGetPlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                console.log('[STORE] GOT THE PLAYLIST. UPDATING LIKES....')
                let playlist = response.data.playlist;
                playlist.likes = likes
                playlist.dislikes = dislikes 
                if(active === 'like'){
                    if(playlist.likedBy.indexOf(auth.user.email) === -1){
                        playlist.likedBy.push(auth.user.email)
                    }
                    if(playlist.dislikedBy.indexOf(auth.user.email) !== -1){
                        playlist.dislikedBy.splice(playlist.dislikedBy.indexOf(auth.user.email), 1)
                    }
                }
                if(active === 'dislike'){
                    if(playlist.dislikedBy.indexOf(auth.user.email) === -1){
                        playlist.dislikedBy.push(auth.user.email)
                    }
                    if(playlist.likedBy.indexOf(auth.user.email) !== -1){
                        playlist.likedBy.splice(playlist.likedBy.indexOf(auth.user.email), 1)
                    }
                }
                if(active === 'none'){
                    if(playlist.likedBy.indexOf(auth.user.email) !== -1){
                        playlist.likedBy.splice(playlist.likedBy.indexOf(auth.user.email), 1)
                    }
                    if(playlist.dislikedBy.indexOf(auth.user.email) !== -1){
                        playlist.dislikedBy.splice(playlist.dislikedBy.indexOf(auth.user.email), 1)
                    }
                }
                console.log('[STORE] After updating the likes of the playlist: ',playlist)
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        console.log('[STORE] SUCCESSFUL IN UPDATING PLAYLIST')
                        store.loadIdNamePairs()
                    }
                }
                updateList(playlist);
            }
        }
        console.log('[STORE] UPDATING LIKES OF PLAYLIST...')
        asyncGetPlaylist(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        // Clear the transaction stack
        tps.clearAllTransactions();
        // Update out state
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled Playlist"
        let author = auth.user.firstName + " " + auth.user.lastName
        const response = await api.createPlaylist(newListName, [], auth.user.email, author);
        console.log("createNewList response: " + response.data.playlist);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );
            //Update the current list
            store.currentList = response.data.playlist
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
        store.loadIdNamePairs()
    }

    store.publishList = function (){
        let list = store.currentList
        console.log('[STORE] Before --> Publish Status? ', list.published)
        // PUBLISH THE PLAYLIST BY SETTING THE PUBLISH FIELD --> TRUE 
        list.published = true
        console.log('[STORE] After --> Publish Status? ', list.published)
        // NOW GRAB THE DATE WHEN THE USER HIT PUBLISHED 
        var current = new Date();
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var date = `${monthNames[current.getMonth()]} ${current.getDate()},${current.getFullYear()}`;
        console.log("[STORE] Today's date is: ", date)
        // SET THE DATE FIELD OF THE LIST 
        list.date = date 
        // UPDATE THE CURRENT LIST IN THE BACKEND
        store.updateCurrentList();
    }

    //THIS FUNCTION LOADS ALL THE ID, NAME PAIRS, & PLAYLISTS SO WE CAN LIST ALL THE LIST 
    store.loadIdNamePairsPublished = function () {
        async function asyncLoadIdNamePairsPublished() {
            const response = await api.getPlaylistPairsPublished();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log('[STORE] PUBLISHED PAIRS ARRAY IS: ',pairsArray)
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS_PUBLISHED,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairsPublished();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.duplicatePlaylist = async function () {
        console.log("STORE: duplicating playlist...")
        // Copy the current fields of the playlist
        console.log(store.currentList)
        // Copy all the fields
        let newListName = "Copy of " + store.currentList.name
        let author = auth.user.firstName + " " + auth.user.lastName
        let songs = JSON.parse(JSON.stringify(store.currentList.songs))
    
        const response = await api.createPlaylist(newListName, songs, auth.user.email, author);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;
            store.currentList = newList
            store.loadIdNamePairs()
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal

    // Function to mark the playlist that is set to be deleted
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                // Update our state with the list that was marked for deletion 
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: playlist._id, playlist: playlist}
                });
                // Show the modal that is going to confirm with the user to delete the list
            }
        }
        getListToDelete(id);
    }

    // Function that removes the playlist from user's list of playlists 
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                //SET THE CURRENT LIST TO BE NULL!
                store.currentList = null
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    // Shows the edit song modal to collect that changes that need to be made
    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });      
    }

    // Show the remove song modal to verify that they want to remove the song from the playlist
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }

    // Hides all the modals
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }

    // Checks if the delete list modal is open
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    // Checks if the edit song modal is open
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    // Checks if the remove song modal is open
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                console.log(playlist)
                response = await api.updatePlaylistById(playlist._id, playlist);
                if (response.data.success) {
                    console.log('updating state...')
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                }
            }
        }
        // Clear the transaction stack just in case we have any left over transactions
        tps.clearAllTransactions()
        asyncSetCurrentList(id);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        var songs = [...store.currentList.songs]
        let temp = songs[start]
        songs[start] = songs[end]
        songs[end] = temp

        list.songs = songs
    
        console.log('[STORE] SONGS AFTER MOVING: ', songs)
        
        
        // // WE NEED TO UPDATE THE STATE FOR THE APP
        // if (start < end) {
        //     let temp = list.songs[start];
        //     for (let i = start; i < end; i++) {
        //         list.songs[i] = list.songs[i + 1];
        //     }
        //     list.songs[end] = temp;
        // }
        // else if (start > end) {
        //     let temp = list.songs[start];
        //     for (let i = start; i > end; i--) {
        //         list.songs[i] = list.songs[i - 1];
        //     }
        //     list.songs[end] = temp;
        // }

        // console.log('[STORE] SONGS AFTER MOVING: ', list.songs)

        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        console.log("[STORE] UPDATING SONG...")
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        console.log("[STORE] MOVING SONG:")
        console.log("Starting Index: ", start)
        console.log("Ending Index: ", end)
        console.log(start !== end)
        if (start != end){
            let transaction = new MoveSong_Transaction(store, start, end);
            tps.addTransaction(transaction);
        }
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };

        console.log("[UPDATE SONG TRANSACTION] Old Song: ", oldSongData)
        console.log("[UPDATE SONG TRANSACTION] New Song: ", newSongData)
        const haveSameData = function(obj1, obj2) {
            const obj1Length = Object.keys(obj1).length;
            const obj2Length = Object.keys(obj2).length;
      
            if(obj1Length === obj2Length) {
                return Object.keys(obj1).every(
                    key => obj2.hasOwnProperty(key)
                       && obj2[key] === obj1[key]);
            }
            return false;
        }
        if(!haveSameData(newSongData, oldSongData)){
            let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
            tps.addTransaction(transaction);
        }
        store.hideModals()
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            if (response.data.success) {
                console.log('[UPDATING PLAYLIST] SUCCESSFUL!')
                console.log('[UPDATING PLAYLIST] UPDATED PLAYLIST:')
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
                store.loadIdNamePairs();
            }
        }
        asyncUpdateCurrentList();
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.reset = function (){
        setStore({
            currentModal : CurrentModal.NONE,
            idNamePairs: [],
            currentList: null,
            currentSongIndex : -1,
            currentSong : null,
            newListCounter: 0,
            listNameActive: false,
            listIdMarkedForDeletion: null,
            listMarkedForDeletion: null
        });
    }

    store.logoutApp = function() {
         // Clear the transaction stack
         tps.clearAllTransactions()
         // Update out state
         storeReducer({
             type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
             payload: {}
         });
        // Push the user back to the home screen after closing the list 
        history.push("/")
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };