const jwt = require('jsonwebtoken');
const SecurityService = require('../services/securityService')
const repository = require("../database/mongodb/repository");
const User = repository("User")

exports.register = async (request, response) => {
    const userData = await request.json();
    const data = await SecurityService.Register(userData);
    return response.json(data)
}

exports.tokenActivation = async (request, response) => {
    const {token, userId } = await request.json()
    const result = await SecurityService.tokenBaseActivation({token, userId });
    return response.json(result)
}

exports.login = async (request, response) => {
    const {email, password} = await request.json();
    const result = await SecurityService.login({email, password});
    if (result.data) {
        const {accessToken, refreshToken} = result.data;
        return response.cookie(
            'refreshToken', refreshToken, 
            { httpOnly: true, sameSite: 'strict' }
        )
        .header('Authorization', accessToken)
        .status(result.status)
        .json({...result});
    }
    return response.status(result.status).json({...result})
}

exports.resetPasswordRequest = async (request, response) => {
    const {email} = await request.json();
    const result = await SecurityService.resetPasswordRequest(email);
    // return response.status(result.status).json({...result});
    return response.json({...result});
}


exports.resetPassword = async (request, response) => {
    const {userId, token, password} = await request.json();
    const result = await SecurityService.resetPassword({userId, token, password});
    return response.status(result.status).json({...result});
}


exports.refreshtoken = async (request, response) => {
    const refreshToken = request.cookies['refreshToken'];
    const result = await SecurityService.tokenRefresh(refreshToken) 
    return response.status(result.status).header('Authorization', result.data).json({accessToken: result.data})
}

exports.logout = async (request, response) => {
    const SECRET = 'qqefkuhio3k2rjkofn2mbikbkwjhnkk'
    const accessToken = jwt.sign({userId: request.user}, SECRET, {expiresIn: 1});
    const refreshToken = jwt.sign({userId: request.user}, SECRET, {expiresIn: 1});
    return response.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
    .header('Authorization', "")
    .json({message: 'vous êtes déconnectés', data: {accessToken, refreshToken} });
}

exports.getMe = async (request, response) => {
    try {
        const user = await User.GetById(request.user)
        if(!user){
            return response.status(404).json({message: 'Utilisateur inconnu'});
        }
        const {__v, is_active, is_verified, is_admin, createdAt, updatedAt, password, ...rest} = user.toJSON()
        console.log('Before on finish exécution ........')
        // me = rest;
        response.status(200).json(rest);

    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.changePwd = async (request, response) => {
    const accessToken = request.headers['authorization'];
    const {oldPassword, newPassword} = await request.json();
    if (!oldPassword) {  return response.status(400).json({error: 'Invalid old password.'}) }
    if (!newPassword) {  return response.status(400).json({error: 'Invalid new password.'}) }
    if (!accessToken) { return response.status(400).json({error: 'token is not defined'})  }
    const result = await SecurityService.changePassword({oldPassword, newPassword, accessToken});
    return response.status(result.status).json({message: result.message, data: result.data})
}

