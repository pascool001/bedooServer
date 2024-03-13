const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactPricingSchema = new Schema(
  {
    oper_id: {type: String, required: true}, 
    tp_category: {type: String, required: true}, // pricing bedoo ou pricing operator
    tp_trans_type: {type: String, required: true}, // (bedoo_trans_in / bedoo_trans_out / ope_transfert / ope_retrait )
    tp_tax_mode: {type: String, required: true}, // valeur exprimée en pourcentage (PCTG) ou montant fixe (MtpIX)
    tp_mtmin: {type: Number, required: true}, 
    tp_mtmax: {type: Number, required: true},
    tp_value: {type: Number, required: true}
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


module.exports = mongoose.model("transactPricing", transactPricingSchema);


