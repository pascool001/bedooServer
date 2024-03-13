const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const operatorSchema = new Schema(
  {
    country_id: {type: String, required: true}, 
    oper_name: {type: String, unique: true }, 
    oper_logo: {type: String}, 
    oper_apiBaseUrl: {type: String}
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


module.exports = mongoose.model("operator", operatorSchema);