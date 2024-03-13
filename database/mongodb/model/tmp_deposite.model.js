const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tmp_depositSchema = new Schema(
  {
    tmpdep_amount: {type: Number, required: true}, 
    tmpdep_src_acc: {type: String, required: true}, 
    tmpdep_src_acc_mask: {type: String, required: true}, 
    tmpdep_target_acc: {type: String, required: true},
    tmpdep_query_resp: {type: String}, // object JSON.stringify
    tmpdep_status: {type: Boolean, default: 'pending'},
    tmpdep_payee_acc: {type: String, required: true},
    tmpdep_payee_amount: {type: Number, required: true},
    tmpdep_pattr: {type: Number, required: true}, // pattr : payee amount time to recover / delais de recouvrement
    tmpdep_fees: {type: Number, default: 0},
    tmpdep_fees: {type: Number, default: 0},
    tmpdep_payee_amount_recovered: {type: Boolean, default: false},
    tmpdep_fees_recovered: {type: Boolean, default: false},
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


module.exports = mongoose.model("tmp_deposite", tmp_depositSchema);

// create table TMP_DEPOSITE
// (

//    AMOUNT               numeric(8,0) not null  comment '',
//    SRC_ACC              varchar(15) not null  comment '',
//    SRC_ACC_MASK         varchar(15) not null  comment '',
//    TARGET_ACC           varchar(15) not null  comment '',
//    OPERATOR_RESPONSE    text not null  comment '',
//    STATUS               varchar(10) not null  comment '',
//    DATE                 date not null  comment '',
//    PAYEE_ACC            varchar(15)  comment '',
//    PAYEE_AMOUNT         numeric(8,0)  comment '',
//    PATTR                varchar(4)  comment '',
//    FEES                 numeric(8,0)  comment '',
//    PAYEE_AMOUNT_RECOVERED bool  comment '',
//    FEES_RECOVERED       bool  comment '',
// );