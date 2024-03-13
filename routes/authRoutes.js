const HyperExpress = require('hyper-express');

const auth_api_router = new HyperExpress.Router()


const AUTH_API_PREFIX = process.env.AUTH_API_PREFIX

const { 
    register, 
    tokenActivation, 
    login, 
    resetPasswordRequest, 
    resetPassword, 
    refreshtoken, 
    logout, 
    getMe,
    changePwd
} = require('../controller/securityController')

const {authenticate} = require('../middlewares')

auth_api_router.route(`${AUTH_API_PREFIX}/register`).post(register)


auth_api_router.route(`${AUTH_API_PREFIX}/activate`).post(tokenActivation);


auth_api_router.route(`${AUTH_API_PREFIX}/login`).post(login);

auth_api_router.route(`${AUTH_API_PREFIX}/resetPwdReq`).post(resetPasswordRequest);

auth_api_router.route(`${AUTH_API_PREFIX}/resetPwd`).post(resetPassword);

auth_api_router.route(`${AUTH_API_PREFIX}/refreshToken`).post(refreshtoken);


// auth_api_router.use(`${AUTH_API_PREFIX}/logout`, authenticate)


auth_api_router.route(`${AUTH_API_PREFIX}/logout`).post(logout);

auth_api_router.use(`${AUTH_API_PREFIX}/changePwd`, authenticate)

auth_api_router.route(`${AUTH_API_PREFIX}/changePwd`).post(changePwd);

auth_api_router.use(`${AUTH_API_PREFIX}/getMe`, authenticate) 

auth_api_router.route(`${AUTH_API_PREFIX}/getMe`).get(getMe);




module.exports = auth_api_router