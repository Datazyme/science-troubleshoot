const HttpError = require('../models/errorModel')

//===========Register User
//POST : api/users/register
//Unprotected

const registerUser = async (req, res, next) => {
    try {
        res.json("Register User")
    } catch (error) {
        return next(new HttpError(error))
    }
}

//=============Login User
//POST : api/users/login
//Unprotected

const loginrUser = async (req, res, next) => {
    try {
        res.json("Login User")
    } catch (error) {
        return next(new HttpError(error))
    }
}

//==============Get User
//Get : api/users/:id
//Protected

const getUser = async (req, res, next) => {
    try {
        res.json("Get User")
    } catch (error) {
        return next(new HttpError(error))
    }
}

//================Get Users
//GET : api/users
//Protected

const getUsers = async (req, res, next) => {
    try {
        res.json("Get Users")
    } catch (error) {
        return next(new HttpError(error))
    }
}

//================Edit User
//PATCH : api/user/edit
//Protected

const editUser = async (req, res, next) => {
    try {
        res.json("Edit User")
    } catch (error) {
        return next(new HttpError(error))
    }
}

//================Follow/Unfollow User
//PATCH : api/user/edit
//Protected

const followUnfollowUser= async (req, res, next) => {
    try {
        res.json("Follow/Unfollow User")
    } catch (error) {
        return next(new HttpError(error))
    }
}


//================Change User Profile Pic
//PATCH : api/user/avatar
//Protected

const changeUserAvatar = async (req, res, next) => {
    try {
        res.json("Change User Avatar")
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {registerUser, loginrUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar}