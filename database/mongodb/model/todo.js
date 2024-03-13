const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the TodoItem schema
const TodoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, {
  toJSON: {
    transform(doc, ret){
        delete ret.__v;
    }
  },
  timestamps: true
});


module.exports = mongoose.model('Todo', TodoSchema);