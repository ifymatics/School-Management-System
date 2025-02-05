// const Auth = mongoose.model("Auth", authSchema);
// module.exports = Auth;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const AuthSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email regex
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role", // Reference to the Role model
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Auth", AuthSchema);
