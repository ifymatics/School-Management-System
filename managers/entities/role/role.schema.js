module.exports = {
  createRole: {
    name: { type: "string", required: true, min: 3, max: 60, custom: "name" },
    description: {
      type: "string",
      required: true,
      min: 3,
      max: 60,
      custom: "description",
    },
  },
};
