module.exports = {
  createClassroom: [
    { required: true, model: "name" },

    {
      model: "schoolId",
      required: true,
    },
    {
      model: "capacity",
      required: true,
    },
  ],

  createClassroom: [
    { required: true, model: "name" },

    {
      model: "schoolId",
      required: true,
    },
    {
      model: "capacity",
      required: true,
    },
  ],
  updatedClassroom: [
    { required: true, model: "name" },

    {
      model: "schoolId",
      required: true,
    },
    {
      model: "capacity",
      required: true,
    },
  ],
  deleteClassroom: { model: "classroomId", required: true },
};
