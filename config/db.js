const mongoose = require('mongoose');
const config1 = require('./config');
const config = require('config');
const env = process.env.NODE_ENV || 'development';
//const db = config[env].db;
const db = config.get('mongoURI')
console.log('jwt', config1[env]);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
