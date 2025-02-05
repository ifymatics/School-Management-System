// const mongoose = require("mongoose");

// const roleSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   users: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Auth",
//     },
//   ],
// });

// const Role = mongoose.model("Role", roleSchema);
// module.exports = Role;
const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "Auth", // Reference to the User model
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
