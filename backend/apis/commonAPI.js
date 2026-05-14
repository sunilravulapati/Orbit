import exp from 'express'
import { login } from '../Services/authService.js'
import { register } from '../Services/authService.js';
import { UserModel } from '../models/UserModel.js'
import { verifyToken } from '../middleware/verifyToken.js';

export const commonRouter = exp.Router();

// Register: Public
commonRouter.post('/register', (async (req, res) => {
    const newUserObj = await register({ ...req.body, role: "USER" });
    res.status(201).json({ message: "user created", payload: newUserObj });
}));

// Login: Public
// Login: Public
commonRouter.post("/login", (async (req, res) => {
    const { token, user } = await login(req.body);
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production", // must be true for sameSite: none
        maxAge: 24 * 60 * 60 * 1000
    });
    res.json({
        message: "Login successful",
        token,
        payload: { userId: user._id, email: user.email, role: user.role }
    });
}));

// Logout: Protected
commonRouter.post('/logout', verifyToken("USER", "ADMIN"), (req, res) => {
    res.clearCookie('token');
    res.json({ message: "logout successfully" });
});

//change password
commonRouter.put("/changepassword", verifyToken("USER", "ADMIN"), async (req, res, next) => {
    try {

        const userId = req.user.userId
        const { password, newPassword } = req.body

        const userDoc = await UserModel.findById(userId)

        const isMatch = await bcrypt.compare(password, userDoc.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid current password"
            })
        }

        userDoc.password = await bcrypt.hash(newPassword, 10)

        await userDoc.save()

        res.json({
            message: "Password updated successfully"
        })

    } catch (err) {
        next(err)
    }
})

//currently logged in user
commonRouter.get("/me", verifyToken("USER", "ADMIN"), (req, res) => {
    res.json({
        message: "current user",
        payload: req.user
    })
})