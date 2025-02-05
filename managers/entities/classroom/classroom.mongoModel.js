const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  capacity: { type: Number, required: true },
  resources: [{ type: String }], // e.g., ["projector", "whiteboard"]
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Classroom = mongoose.model("Classroom", classroomSchema);

module.exports = Classroom;
