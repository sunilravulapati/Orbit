import { Schema, model } from "mongoose";

//custom schema for user - Followers
const userFollowersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Fllower Id is required...']
    }
})

//custom schema for user - following
const userFollowingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Fllower Id is required...']
    }
})

//custom schema for the bookmarks
const bookmarkSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: [true, 'Post Id is required']
    }
})

//user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, 'Email already existed']
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    profileImageUrl: {
        type: String
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        required: [true, "{Value} is invalid role"],
        default: 'USER'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    followers: [userFollowersSchema],
    following: [userFollowingSchema],
    bio: {
        type: String,
    },
    bookmarks:[bookmarkSchema],
}, {
    timestamps: true,
    strict: "throw",
    versionKey: false
})

//export the usermodel
export const UserModel = model('user', userSchema);