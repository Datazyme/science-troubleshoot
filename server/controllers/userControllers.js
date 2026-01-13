const HttpError = require('../models/errorModel')
const userModel = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jtoken = require("jsonwebtoken")
const uuid = require("uuid").v4;


//===========Register User
//POST : api/users/register
//Unprotected

const registerUser = async (req, res, next) => {
    try {
        const {fullName, email, password, confirmPassword} = req.body
        if(!fullName || !email || !password || !confirmPassword) {
            return next(new HttpError("Fill in all fields", 422)) //422 is invalid input from user
        }
        //make the email lowercase
        const lowerCaseEmail = email.toLowerCase();
        //check db if email exists
        const emailExists = await userModel.findOne({email: lowerCaseEmail})
        if(emailExists) {
            return next(new HttpError("Error already exists", 422))
        }
        //check if password and confirm password match
        if(password !== confirmPassword) {
            return next(new HttpError("Passwords do not match"))
        }
        //check password length
        if (password.length < 6) {
            return next(new HttpError("Password should be more than 6 characters", 422))
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //add user to db
        const newUser = await userModel.create({fullName, email: lowerCaseEmail, password: hashedPassword})
        res.json(newUser).status(201);

    } catch (error) {
        return next(new HttpError(error))
    }
}

//=============Login User
//POST : api/users/login
//Unprotected

const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return next(new HttpError("Fill in all fields", 422)) //422 is invalid input from user
        }

        //make the email lowercase
        const lowerCaseEmail = email.toLowerCase();

        //fetch user from db
        const yuser = await userModel.findOne({email: lowerCaseEmail})
        if(!yuser) {
            return next(new HttpError("Invalid credentials", 422))
        }
        const {uPassword, ...userInfo} = yuser;

        //compare passwords
        const comparedPass = await bcrypt.compare(password, yuser?.password);
        if(!comparedPass) {
            return next(new HttpError("Invalid credentials", 422)) 
        }
        const userToken = await jtoken.sign({id: yuser?._id}, process.env.JWT_SECRET,
        {expiresIn: "1hr"})
        res.json({userToken, id: yuser?._id}).status(200);
        //res.json({userToken, id: yuser?._id, ...userInfo}).status(200);
       
    } catch (error) {
        return next(new HttpError(error))
    }
}

//==============Get User
//Get : api/users/:id
//Protected

const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await userModel.findById(id)
        if(!user) {
            return next(new HttpError("Could not find registered user", 422))
        }
        res.json(user).status(200)
        //res.json("Get User")
    } catch (error) {
        return next(new HttpError(error))
    }
}

//================Get Users
//GET : api/users
//Protected

const getUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().limit(10).sort({createdAt: -1})
        res.json(users)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//================Edit User
//PATCH : api/user/edit
//Protected

const editUser = async (req, res, next) => {
    try {
        const {fullName, bio} = req.body
        const editedUser = await userModel.findByIdAndUpdate(req.user.id,
        {fullName, bio}, {new: true})
        res.json(editedUser).status(200)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//================Follow/Unfollow User
//Get : api/user/edit
//Protected

const followUnfollowUser = async (req, res, next) => {
    try {
        const userToFollowId = req.params.id; //gets user id of person you want to follow
        if(req.user.id === userToFollowId) {//req.user.id goes through authmiddleware and verifies the id of you, the current logged in user
            return next(new HttpError("You can't follow yourself", 422))
        }
        const currentUser = await userModel.findById(req.user.id); //gets info of current user to look through following to make sur
        const isFollowing = currentUser?.following?.includes(userToFollowId);
        //follow if not following, else unfollow if following
        if(!isFollowing) {
            const updatedUser = await userModel.findByIdAndUpdate(userToFollowId,
            {$push: {followers: req.user.id}}, {new: true})
            await userModel.findByIdAndUpdate(req.user.id, 
            {$push: {following: userToFollowId}}, {new: true})
            res.json(updatedUser)
        } else {
            const updatedUser = await userModel.findByIdAndUpdate(userToFollowId,
            {$pull: {followers: req.user.id}}, {new: true})
            await userModel.findByIdAndUpdate(req.user.id, 
            {$pull: {following: userToFollowId}}, {new: true})
            res.json(updatedUser)
        }
    } catch (error) {
        return next(new HttpError(error))
    }
}


//================Change User Profile Pic
//Post : api/user/avatar
//Protected

const changeUserAvatar = async (req, res, next) => {
    try {
        if(!req.files.avatar) {
            return next(new HttpError("Please choose an image", 422))
        }
        const {avatar} = req.files;
        //check file size
        if(avatar.size > 500000) {
            return next(new HttpError("file too large, must be less than 500kb"))
        }

        let fileName = avatar.name;
        let splitFilename = fileName.split(".")
        let newFilename = splitFilename[0] + uuid() + "." + splitFilename[splitFilename.length - 1];
        res.json(newFilename)
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar}