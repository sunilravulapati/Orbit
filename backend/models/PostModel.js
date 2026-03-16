import { Schema,model } from "mongoose";

//likes schema
const likesSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,'user id is required']
    }
})

//comments schema
const commentsSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,'user id is required']
    },
    text:{
        type:String,
        required:[true,'comment text required']
    }
},{
    timestamps:true
})

//post schema
const postSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,'user id is required...']
    },
    text:{
        type:String,
    },
    image:{
        url:{
            type:String,
        },
        public_id:{
            type:String,
        }

    },
    likes:[likesSchema],
    comments:[commentsSchema],
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false
})

export const PostModel=model('post',postSchema)