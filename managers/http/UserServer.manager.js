const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const swaggerDocs = require("./swagger");

module.exports = class UserServer {
  constructor({ config, managers, rateLimiter }) {
    this.config = config;
    this.userApi = managers.userApi;
    this.rateLimiter = rateLimiter;
  }

  /** for injecting middlewares */
  use(args) {
    app.use(args);
  }

  /** server configs */
  run() {
    app.use(cors({ origin: "*" }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static("public"));

    /** Rate limiter */
    app.use(this.rateLimiter);

    /** an error handler */
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something broke!");
    });

    /** a single middleware to handle all */
    app.all("/api/:moduleName/:fnName", this.userApi.mw);

    let server = http.createServer(app);
    server.listen(this.config.dotEnv.USER_PORT, () => {
      swaggerDocs(app, this.config.dotEnv.USER_PORT);
      console.log(
        `${this.config.dotEnv.SERVICE_NAME.toUpperCase()} is running on port: ${
          this.config.dotEnv.USER_PORT
        }`
      );
    });
  }
};
