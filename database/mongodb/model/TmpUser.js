const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {genOtp, genToken, hashedPwd } = require('../../../utils')


const tmpUserSchema = new Schema(
  {
    email: {type: String, required: true, unique: true },
    name: {type: String, required: true },
    password: {type: String, required: true },
    is_active: {type: Boolean, default: false },
    is_admin: {type: Boolean, default: false},
    phone_number: {type: String, required: true },
    user_type: {type: String, enum: ['WEB', 'MOBILE']},
    otp: {type: String},
    token: {type: String},
    createdAt: {type: Date, default: Date.now, expires: '600s' }
  });
  // const schema = new Schema({ "expireAt": { type: Date,  expires: 11 } }); // expires at 11 seconds
// The document will be automatically deleted after 3 minutes of its creation time
tmpUserSchema.pre("save", async function (next) {
    // Only send an email when a new document is created
    if (this.isNew) {
        this.otp = await genOtp()
        this.token = await genToken();  
        this.password = await hashedPwd(this.password)
    }
    next();
  });

module.exports = mongoose.model("TmpUser", tmpUserSchema);

