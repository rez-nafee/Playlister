const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
router.get('/playlists', PlaylistController.getPlaylists)
router.put('/playlist/:id', PlaylistController.updatePlaylist)
router.get('/playlistpairspublished', PlaylistController.getPlaylistPairsPublished)

module.exports = router