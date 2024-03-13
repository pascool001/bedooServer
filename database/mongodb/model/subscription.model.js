const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema(
  {
    user_id: {type: String, required: true}, 
    srv_id: {type: String, required: true}, 
    transfert_id: {type: String, required: true}, 
    nb_period: {type: Number, required: true},
    end_date: {type: Date, required: true}
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


module.exports = mongoose.model("subscription", subscriptionSchema);