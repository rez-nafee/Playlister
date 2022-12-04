const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new Schema(
    {
        name: { type: String, required: true},
        ownerEmail: { type: String, required: true },
        author: {type: String, required: true},
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], required: true },
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        listens: {type: Number, default: 0},
        published: {type: Boolean, default: false},
        date: {type: String},
        comments: {type: [{
            comment: String,
            author: String
        }], default: []}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
