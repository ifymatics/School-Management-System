const jwt = require("jsonwebtoken");
const utils = require("./../../libs/utils");

module.exports = class AuthManager {
  constructor({ config, cache, cortex, managers, validators, mongomodels }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.validators = validators;
    this.managers = managers;
    this.AuthModel = mongomodels.auth;
    this.jwtSecret = config.dotEnv.JWT_SECRET;
  }

  /** Exposed methods */
  httpExposed = ["post=login", "post=register"];

  /** Login */
  async login({ email, password }) {
    try {
      const auth = { email, password };

      let validationResult = await this.validators.auth.login(auth);

      if (validationResult) {
        return { statusCode: 400, errors: validationResult };
      }
      // Validate credentials (e.g., check against database)
      const userExist = await this.AuthModel.findOne({ email });

      if (!userExist) {
        return { error: true, ok: false, message: "User not found" };
      }
      // check is passwordMatch
      const isMatch = await utils.comparePasswords(
        userExist.password,
        password
      );
      //const user = { _id: "12345", role: "admin" };
      if (!isMatch) return { statusCode: 401, errors: "Invalid credentials" };

      const token = this.managers.token.genLongToken({
        userId: userExist._id,
        userKey: userExist.roles,
      });
      return { token };
    } catch (error) {
      console.log(error);
      return { statusCode: 401, errors: "Something went wrong" };
    }
  }

  /** Register */
  async register({ email, password, role }) {
    try {
      // 1. validate data
      const signupData = { email, password, role };

      let validatedResult = await this.validators.auth.register(signupData);
      if (validatedResult) {
        return { statusCode: 401, errors: validatedResult };
      }
      //2. check if the meail already in use
      const userExist = await this.AuthModel.findOne({ email });

      if (userExist) return { statusCode: 401, errors: "Email already in use" };
      // 3. hash password
      const hashedPassword = await utils.hashPassword(password);
      // 4. Create user in database
      const authDoc = {
        email,
        password: hashedPassword,
        role,
      };
      const newAuth = new this.AuthModel(authDoc);
      const user = await newAuth.save();
      const token = this.managers.token.genLongToken({
        userId: user._id,
        userKey: user.role,
      });
      return { token };
    } catch (error) {
      console.log(error);
      return { statusCode: 400, errors: "something went wrong" };
    }
  }
};
