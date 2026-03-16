import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UserModel } from '../models/UserModel.js'

//register function
export const register = async (userObj) => {
    const userDoc = new UserModel(userObj);
    //validating the user obj
    await userDoc.validate();

    //hashing the password
    userDoc.password = await bcrypt.hash(userDoc.password, 10);

    //saving the created user with hashed password
    const createdUser = await userDoc.save();

    //saving the user object
    const newUserObj = createdUser.save();

    //deleting the user password
    delete newUserObj.password;

    return newUserObj;

};


//login function
export const login = async (email, password) => {
    //finding the user by user email
    const user = await UserModel.findOne({ email });

    //if user not found 
    if (!user) {
        const err = new Error("Invalid email")
        err.status = 404
        throw err
    }

    //checking if the password is matching with hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    //if password not found
    if (!isMatch) {
        const err = new Error("Invalid password")
        err.status = 404
        throw err
    }

    //if the user is blocked by admin
    if (!user.isActive) {
        const err = new Error("Your account is blocked by admin");
        err.status = 403;
        throw err;
    }

    //generating token
    const token = jwt.sign(
        { userid: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const newUserObj = user.toObject();
    delete newUserObj.password;


    return { user: newUserObj, token };
};