const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        require: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type:Date,
        default: Date.now(),
        expire:3600
    }
})
module.exports=mongoose.model("Token", tokenSchema)