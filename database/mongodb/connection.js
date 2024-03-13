const mongoose = require("mongoose");

const Grid = require('gridfs-stream');

require('dotenv').config()

// const genAdminUser = require('./generateAdminUser')


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    // await genAdminUser()
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


let gfs;
(() => {
  mongoose.connection.on("connected", () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
  });
})();


module.exports = {connectDB, gfs};
