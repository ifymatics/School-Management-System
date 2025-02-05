//  name: { type: String, required: true },
//   age: { type: Number, required: true },
//   gender: { type: String, required: true },
//   schoolId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "School",
//     required: true,
//   },
//   classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },

module.exports = {
  createStudent: [
    { required: true, model: "name" },
    { required: true, model: "age" },
    { required: true, model: "gender" },
    {
      required: true,
      model: "schoolId",
    },
    {
      required: true,
      model: "classroomId",
    },
    {
      required: true,

      model: "email",
    },
    // { required: true, model: "phone" },
  ],
  updateStudent: [
    { required: true, model: "name" },
    { required: true, model: "age" },
    { required: true, model: "gender" },
    {
      required: true,
      model: "schoolId",
    },
    {
      required: true,
      model: "classroomId",
    },
    {
      required: true,

      model: "email",
    },
  ],
  deleteClassroom: { model: "classroomId", required: true },
};
