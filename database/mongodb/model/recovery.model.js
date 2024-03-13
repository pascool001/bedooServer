const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recoverySchema = new Schema(
  {
    recov_amount: {type: Number, required: true}, 
    recov_src_acc: {type: String, required: true}, 
    recov_target_acc: {type: String, required: true}, 
    recov_query_resp: {type: String}, // object JSON.stringify
    recov_status: {type: Boolean, default: 'pending'},
    recovered_ids:  {type: String, required: true} // Tableau des Ids de depot temporaire cumulés en valeurs à recouvrer
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


module.exports = mongoose.model("recovery", recoverySchema);