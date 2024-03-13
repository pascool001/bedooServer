
const sendSMS = async (phoneNumber, message ) => {

    return {
        status:200,
        message: {message: `Un sms a été envoyé à l\'adresse suivant : ${phoneNumber}`, sms_msg: message}
    }

}

module.exports = sendSMS