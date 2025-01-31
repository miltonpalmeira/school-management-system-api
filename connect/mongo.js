const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = ({ uri }) => {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on('connected', function () {
      console.log('💾  Mongoose default connection open to ' + uri);
      resolve();
    });

    mongoose.connection.on('error', function (err) {
      console.log('💾  Mongoose default connection error: ' + err);
      reject(err);
    });

    mongoose.connection.on('disconnected', function () {
      console.log('💾  Mongoose default connection disconnected');
    });

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log('💾  Mongoose default connection disconnected through app termination');
        process.exit(0);
      });
    });
  });
};
