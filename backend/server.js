import exp from 'express'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser'
import { connect } from 'mongoose'
import { userRoute } from './apis/userAPI.js'
import { adminRoute } from './apis/adminAPI.js'
import { commonRouter } from './apis/commonAPI.js'
import {postRoute} from  './apis/postAPI.js'
import cors from 'cors';
import http from 'http';
import { initSocket } from './socket/index.js';
config()

const app = exp()

//cors allowed so that request can be made from other ports
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true // for cookies and tokens
}))

// Create HTTP server for Socket.IO
const httpServer = http.createServer(app);
initSocket(httpServer);
//body parser middleware
app.use(exp.json())
//cookie-parser
app.use(cookieParser())
//custom apis
app.use('/user-api', userRoute)
app.use('/admin-api', adminRoute)
app.use('/common-api', commonRouter)
app.use('/post-api',postRoute)
//connect to mongodb and listen to port
const connectDB = async () => {
    try {
        await connect(process.env.DB_URL)
        console.log("db connection successful!")
        httpServer.listen(process.env.PORT, () => console.log(`http server started and listening to port ${process.env.PORT}`))
    } catch (err) {
        console.log("an error occured")
        console.log(err.message)
    }
}
connectDB()

//invalid paths
app.use((req, res, next) => {
    return res.json({ message: `${req.url} is an invalid path` })
})

//error handling middleware
app.use((err, req, res, next) => {

    console.log("Error name:", err.name);
    console.log("Error code:", err.code);
    console.log("Full error:", err);

    // mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: "error occurred",
            error: err.message,
        });
    }

    // mongoose cast error
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "error occurred",
            error: err.message,
        });
    }

    const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
    const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

    if (errCode === 11000) {
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];
        return res.status(409).json({
            message: "error occurred",
            error: `${field} "${value}" already exists`,
        });
    }
    // ✅ HANDLE CUSTOM ERRORS
    if (err.status) {
        return res.status(err.status).json({
            message: "error occurred",
            error: err.message,
        });
    }
    // default server error
    res.status(500).json({
        message: "error occurred",
        error: "Server side error",
    });
});