module.exports = {
  createSchool: [
    { required: true, model: "name" },
    {
      required: true,

      model: "address",
    },

    {
      required: true,

      model: "email",
    },
    // { required: true, model: "phone" },
  ],
  updateSchool: [
    { required: true, model: "name" },
    {
      required: true,

      model: "address",
    },
    {
      required: true,

      model: "email",
    },
    // { required: true, model: "phone" },
  ],
  deleteSchool: { model: "classroomId", required: true },
};
