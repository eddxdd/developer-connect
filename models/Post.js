const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    // Connect a user to a post
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    // By keeping the user name/avatar here, we assure that the user's post
    // won't be deleted even if the account is deleted
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    // Like/Dislike feature
    likes: [
        {
            // By keeping ref: users here, we know which post came from which user
            // We also stop multiple likes on the same post from one person
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);