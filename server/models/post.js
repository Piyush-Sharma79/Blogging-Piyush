const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    likes:{
        type: Number,
        default: 0
    },
});

PostSchema.index({ title: 'text', body: 'text' });

module.exports= mongoose.model('Post',PostSchema);