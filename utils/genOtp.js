const otpGenerator = require('otp-generator');
// const bcrypt = require("bcryptjs");

const genOtp = async () =>  {
    const otp = otpGenerator.generate(6, {upperCaseAlphabets: false,  lowerCaseAlphabets: false,  specialChars: false, });
    // const hashedOtp = await bcrypt.hash(otp, Number(process.env.BCRYPT_SALT));
    return otp;
}

module.exports = genOtp