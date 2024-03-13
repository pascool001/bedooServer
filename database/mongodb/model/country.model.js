const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countrySchema = new Schema(
  {
    country_indic: {type: String, required: true, unique: true }, // indicatif du pays (+225)
    country_code: {type: String, unique: true }, // code du pays (CI: Cote d'Ivoire)
    country_name: {type: String, unique: true }, 
    country_flag: {type: String, unique: true } //image du drapeau
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


module.exports = mongoose.model("country", countrySchema);
