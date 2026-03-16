import jwt from "jsonwebtoken"
import { config } from "dotenv"
config()

export const verifyToken = (...allowedRoles) => {
    return async (req, res, next) => {
        // read token from cookies
        const token = req.cookies.token
        console.log("token:", token)

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized request. Please login again"
            })
        }

        try {
            //verify and decode the token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            //check if the role is allowed
            if (!allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Forbidden" })
            }
            //attach user info to req for use in routes-why in the req we have encoded token and few other things, if any route wants to know who has sent the request then we have to attach the decoded token
            req.user = decodedToken
            //forward
            next()
        } catch (err) {
            //jwt.verify throws if token is invalid or expired
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "expired token" })
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token" })
            }
            //next(err);
        }
    }
}
