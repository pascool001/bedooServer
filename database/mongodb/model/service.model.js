const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    srv_name: {type: String, required: true}, 
    srv_code: {type: String },
    srv_desc: {type: String},
    srv_to_suscribe: {type: Boolean, default: false},
    srv_daily_price : {type: Number, required: true}, // 5%
    srv_weekly_plan_reduction : {type: Number, required: true}, // 10%
    srv_mounthly_plan_reduction : {type: Number, required: true}, //15%
    srv_yearly_plan_reduction : {type: Number, required: true}, // 20%
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


module.exports = mongoose.model("service", serviceSchema);
