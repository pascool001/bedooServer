const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema(
  {
    user_id: {type: String, required: true}, 
    oper_id: {type: String, required: true}, 
    acc_number: {type: String, required: true}, 
    acc_balance: {type: Number, default: 0}, 
    acc_is_marchand: {type: Boolean, default: false}, // est-ce un compte marchant?
    acc_support_inc_fees: {type: Boolean, default: false} // support les frais entrants
  }, {
    toJSON: {
      transform(doc, ret) {
          delete ret.__v;
      }
    },
    timestamps: true
  }
);


module.exports = mongoose.model("account", accountSchema);

