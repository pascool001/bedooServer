const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sousDepositSchema = new Schema(
  {
    sd_amount: {type: Number, required: true}, 
    sd_src_acc: {type: String, required: true}, 
    sd_target_acc: {type: String, required: true},
    sd_query_resp: {type: String}, // object JSON.stringify
    sd_status: {type: Boolean, default: 'pending'},
    sd_bedoo_recovered: {type:Boolean, default: false}
  },
  {
    toJSON: {
      transform(doc, ret) {
          delete ret.__v;
      }
    },
    timestamps: true
  }
);


module.exports = mongoose.model("sous_deposite", sousDepositSchema);
