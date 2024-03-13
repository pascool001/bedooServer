const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mobileApiSchema = new Schema(
  {
    ope_id: {type: String, required: true}, 
    api_name: {type: String, required: true, unique: true },
    api_path: {type: String, required: true},
    api_method: {type: String, required: true},
    api_headers: {type: String, required: true} // Objet contenant les infos d'entete converti en texte avec JSON.stringify()
    // le champ body n'est pas necessaire car il n'est pas static
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


module.exports = mongoose.model("mobileApi", mobileApiSchema);
