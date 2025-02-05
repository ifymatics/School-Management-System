const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let connection = null;

module.exports = ({ uri }) => {
  if (connection) {
    // If a connection already exists, return the Mongoose instance
    return mongoose;
  }

  // Database connection
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // When successfully connected
  mongoose.connection.on("connected", () => {
    console.log("💾 Mongoose default connection open to " + uri);
  });

  // If the connection throws an error
  mongoose.connection.on("error", (err) => {
    console.log("💾 Mongoose default connection error: " + err);
    console.log(
      "=> if using local mongodb: make sure that mongo server is running \n" +
        "=> if using online mongodb: check your internet connection \n"
    );
  });

  // When the connection is disconnected
  mongoose.connection.on("disconnected", () => {
    console.log("💾 Mongoose default connection disconnected");
  });

  // If the Node process ends, close the Mongoose connection
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log(
        "💾 Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });

  // Store the connection instance
  connection = mongoose.connection;

  // Return the Mongoose instance for creating models
  return mongoose;
};
