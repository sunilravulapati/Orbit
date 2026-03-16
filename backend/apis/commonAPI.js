import exp from 'express'
import {login} from '../Services/authService.js'
import { register } from '../Services/authService.js';
import {UserModel} from '../models/UserModel.js'


export const commonRouter = exp.Router();


//register user
commonRouter.post('/register',async (req,res)=>{
    //get user from req
    let userObj = req.body
    //call register
    const newUserObj = await register({ ...userObj, role: "USER" })
    //send res
    res.status(201).json({ message: "user created", payload: newUserObj })
})

//login user
commonRouter.post('/login',async (req,res)=>{

});


//login route
commonRouter.post("/login",async(req,res)=>{
        
            //get user CRED object
            let userCRED = req.body
            //call authenticate service
            let { token,user } = await login(userCRED)
            //save token as HTTPonly cookie
            res.cookie('token', token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false
        })
        //send res
        const { _id, email, role } = user;
        res.json({
  message: "Login successful",
  token: token,
  payload: { userId: _id, email, role }
})
    
});

//logout route
commonRouter.post('/logout',()=>{
    res.clearCookie('token',{
        httpOnly:true,
        sameSite:"lax",
        secure:false
    });

    res.json({message:"logout successfully"});
});

//change password
commonRouter.put('/changepassword',async (req,res)=>{
    try {
        let userCRED = req.body;

        // call login properly
        let { user } = await login({
            email: userCRED.email,
            password: userCRED.password
        });

        // get result document
        let userDoc = await UserModel.findOne({ email: user.email });

        //hash the new password
        let newHashedPassword = await bcrypt.hash(userCRED.newPassword, 10);

        //insert the updated password into the document
        userDoc.password = newHashedPassword;

        //save the doc in the database
        await userDoc.save();

        //return res
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        next(err);
    }
})