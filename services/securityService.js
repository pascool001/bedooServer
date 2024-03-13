const repository = require("../database/mongodb/repository");
const TmpUser = repository("TmpUser")
const User = repository("User")
const Token = repository("Token");
const mailSender = require('../utils/email/sendEmail');
const smsSender = require('../utils/sms/sendSMS');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {genOtp, hashedPwd} = require('../utils')



const smsService = async (payload) => {
    const {phone_number, sms_msg} = payload
    const data = await smsSender(phone_number, sms_msg)
        return {
        status: 200,
        message: data.message,
        data: null
    }
}

const sendEmail = async (email, subject, payload, template, backMsg)  => {
    try {
        await mailSender(email, subject, { ...payload }, template);
        return { 
          status: 200, 
          message: backMsg,
          data: null
        }
    } catch (error) {
        return { status: 401, massage: error.message,  data: null }
    }
}


const Register = async (userData) => {
    
    const {email} = userData;

    const existingUser = await User.GetByEmail(email);

    if (existingUser) {
      return { status: 422, message: `Ce compte est déjà existant et actif`,  data:null } 
    }
  
    const existingTmpUser = await TmpUser.GetByEmail(email);
  
    if (existingTmpUser) {
      return {
        status: 422, 
        message: `Un processus de creation de compte est déjà en cours pour cet eMail ${email}. Veuillez patienter 10mn pour reprendre si nécéssaire. merci `,
        data: null
       }
    }
  
    try {

      const user = await TmpUser.Create({...userData})
      // const link = `${process.env.URL_PROTOCOL}://${process.env.CLIENT_URL}/activation?token=${user.token}&id=${user._id}`;
      const link = `${process.env.URL_PROTOCOL}://${process.env.CLIENT_URL}${process.env.ACTIVATION_PATH}?token=${user.token}&id=${user._id}`;
      const payload = {name: user.name, otp: user.otp, link}
      let emailOrSmsResult;
      if (user.user_type == "WEB") {
          emailOrSmsResult = await sendEmail(
            user.email, 
            "vérification et activation de compte", 
            payload, 
            "./template/emailVerification.handlebars",
            `Un message d'activation à été envoyé à votre email ${user.email} cliquez sur lien ou utiliser le code OTP pour activer votre compte. merci`
            )
      } else if (user.user_type == "MOBILE") {
          const smsPayload = {userid: user._id, phone_number: user.phone_number, sms_msg: `Ceci est votre code otp d\'activation: ${user.otp} `}
          emailOrSmsResult = await smsService(smsPayload)
      } 
      
      const {__v, is_active, is_verified, is_admin, otp, createdAt, token, password, ...rest} = user.toJSON()
      return { status: emailOrSmsResult.status, message: emailOrSmsResult.message, data: rest}
    
    } catch (error) {
      return {status: 422, message: error.message,  data:  null }
    }


}


const tokenBaseActivation = async (payload) => {

    const { token, userId } = payload;
    
    const user = await TmpUser.GetById(userId);

    if (!user) {
        return { status: 401, message: "Désolé votre token d'activation a expiré, vous pouvez reprendre le processus de creation de compte. merci.", data: null  }
    }

    if (user && user.token !== token) {
        return { status: 401, message: "Désolé votre token est invalide", data: null }
    }

    try {
        const {__v, otp, createdAt, token, ...rest} = user.toJSON()
        const existingUser = await User.GetById(rest._id);
        if (!existingUser) {
          const newUser = await User.Create({...rest, is_active: true})
          return { status: 200, message: "Votre compte a été activé avec succès. vous pouvez vous connecter à présent",  data: newUser }
        } else {
          return { status: 200, message: "Le compte utilisateur est déjà existant et activé.",  data: existingUser }
        }
        
    } catch (error) {
        return { status: 401, message: error.message,  data: null }
    }

}  


const login = async (credentials) => {
    const SECRET = process.env.JWT_SECRET;
    const expiresIn = process.env.TOKEN_EXPIRES_IN;

    const {email, password} = credentials;

    let connectingUser;

    try {
      // check if the user already exists
      connectingUser = await User.GetByEmail(email);
    } catch (error) {
      console.log('Error getting user: ', error)
    }

    if(!connectingUser) {
      return {status: 401,  message: "infos. d'identification incorrect, utilisateur inconu",  data: null   }
    }

    let isPasswordValid = false;

    try {
        
      isPasswordValid = await bcrypt.compare(password, connectingUser.password);

    } catch (error) {
      console.log('bcrypt.compare error : ', error.message)
    }

    if (isPasswordValid === false) {
      return { status: 401, message: "Infos. d'identification incorrect, email ou password invalid ",  data:null }
    }

    try {
      if (connectingUser.is_active) {
        //generate access token
        const accessToken = jwt.sign({userId: connectingUser._id}, SECRET, {expiresIn});
        //generate access token
        const refreshToken = jwt.sign({userId: connectingUser._id}, SECRET, {expiresIn: '7d'});
  
        return {status: 200,  message: 'vous êtes connectés', data: {accessToken, refreshToken}  }

      } else {
        return {status: 401,  message: 'Votre compte est désactivé, veuillez contacter l`\'administrateur du systeme. ', data: null }
      }
        
    } catch (error) {
        console.log('Server Error: ', error)
        return { status:500, message: 'Server error', data: null }
    }
  
}

const resetPasswordRequest = async (email) => {

    const userDoc = await User.GetByEmail(email)

    if (!userDoc) {
        return {status: 400, message: 'Votre email est inconnu du systeme, veuillez entrer celui de votre compte',  data:  null }
    }

    const tokenDoc = await Token.FindTokenByUserId(userDoc._id);
    if (tokenDoc) await Token.remove(tokenDoc._id);
    
    let emailOrSmsResult;

    if (userDoc.user_type == "WEB") {
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));
        await Token.Create({ userId: userDoc._id, token: hash, createdAt: Date.now() })
        const link = `${process.env.URL_PROTOCOL}://${process.env.CLIENT_URL}${process.env.RESET_PWD_PATH}?token=${resetToken}&id=${userDoc._id}`;
        const payload = {name: userDoc.name, link}
        emailOrSmsResult = await sendEmail(
            email, 
            "Réinitialisation du mot de passe", 
            payload,  
            "./template/requestResetPassword.handlebars",
            `Un lien de re-initialisation de mot de passe a été envoyé à l'addresse: ${email} `
            )
        return emailOrSmsResult;
    } else if (userDoc.user_type == "MOBILE") {
        const otp = await genOtp()
        const otpHashed = await bcrypt.hash(otp, Number(process.env.BCRYPT_SALT));
        const newToken = await Token.Create({ userId: userDoc._id, token: otpHashed, createdAt: Date.now(), });
        const smsPayload = {userid: newToken.userId, phone_number: userDoc.phone_number, sms_msg: `Ceci est votre code otp d\'activation: ${otp} `}
        emailOrSmsResult = await smsService(smsPayload)
        return emailOrSmsResult;
    } 
}


const resetPassword = async (payload) => {

    const {userId, token, password} = payload;

    const existingUser = await User.GetById(userId)

    console.log('existingUser: ', existingUser)
    if (!existingUser) {
      return { status: 400, message: 'Votre email est inconnu du systeme.',  data:  null }
    } 
    
    let passwordResetToken = await Token.FindTokenByUserId(existingUser._id)
    

    if (!passwordResetToken) {
      return {status: 401, message: 'Votre Token ou OTP expiré',  data:  null }
    }

    let emailOrSmsResult;
    if (existingUser.user_type == "WEB") {
        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
          return {status: 401, message: 'token invalid ou expiré',  data:  null }
        }
        const hashedPassword = await hashedPwd(password);
      
        const updateUpload = {...existingUser.toJSON(), password : hashedPassword};
      
        const updatedUser = await User.Update(updateUpload, userId);
      
        const payload = {name: updatedUser.name}
        emailOrSmsResult = await sendEmail(
            updatedUser.email, 
            "Password Reset Successfully", 
            payload,  
            "./template/resetPassword.handlebars",
            `Une confirmation de re-initialisation est envoyée au ${updatedUser.email}`
            )
        return emailOrSmsResult;
    } else if (existingUser.user_type == "MOBILE") {
      const isValid = await bcrypt.compare(token, passwordResetToken.token);
      if (!isValid) {
        return {status: 401, message: "OTP invalid ou expiré",  data:  null }
      }

      const smsPayload = {userid: existingUser._id, phone_number: existingUser.phone_number, sms_msg: `Votre mot de passe a été re-initialisé avec success. `}
      emailOrSmsResult = await smsService(smsPayload)
      return emailOrSmsResult;

    }
  
};

const tokenRefresh = async (refreshToken) => {

    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.TOKEN_EXPIRES_IN;

      if (!refreshToken) {
        return {status: 401, message: 'Access refusé. pas de refresh fourni.', data: null }
      }
      try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const accessToken = jwt.sign({userId: decoded.userId }, secretKey, { expiresIn });
        return {status: 200, message: "Token généré avec success.", data: accessToken}
      } catch (error) {
        return {status: 400, message: 'refresh token Invalide.',  data:  null }
      }
};

const changePassword = async (payload) => {
    const secretKey = process.env.JWT_SECRET;
    const {oldPassword, newPassword, accessToken} = payload;
  
    // try {
      let decoded;
      try {
        decoded = jwt.verify(accessToken, secretKey);
        
      } catch (error) {
          return {status: 400, message: 'token invalide', data: null }
      } 
      
      const {userId} = decoded;
      const user = await User.GetById(userId)
      if (!user) {
        return { status: 401, message: "Compte utilisateur introuvable ", data:null }
      }
      //check if password matches
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) { 
          return { status: 401, message: "Ancien mot de pase invalide", data: null } 
      }
  
      try {
        const newPassword_crypte = await bcrypt.hash(newPassword, Number(process.env.BCRYPT_SALT));
        await User.Update({password: newPassword_crypte}, user.id)
        return {status: 200, message: 'Password modifié avec success !', data: null }
      } catch (error) {
        return {status: 500, message: `Server error : ${error.message}`, data: null }
      }
  
}
// ({oldPassword, newPassword, accessToken})

module.exports = {
    Register,  
    tokenBaseActivation, 
    login, 
    resetPasswordRequest, 
    resetPassword,
    tokenRefresh,
    changePassword
}
