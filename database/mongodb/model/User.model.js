const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
// const bcryptSalt = process.env.BCRYPT_SALT;
// const { hashedPwd } = require('../../utils')

const userSchema = new Schema(
  {
    email: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    name: {type: String },
    is_active: {type: Boolean, default: false },
    is_admin: {type: Boolean, default: false},
    phone_number: {type: String, required: true },
    user_type: {type: String, enum: ['WEB', 'MOBILE']}
  },
  {
    toJSON: {
      transform(doc, ret) {
          delete ret.password;
          delete ret.__v;
      }
    },
    timestamps: true
  }
);


module.exports = mongoose.model("user", userSchema);
