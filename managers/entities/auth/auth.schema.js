module.exports = {
  register: [
    {
      model: "email",
      required: true,
    },
    { required: true, model: "password" },
  ],

  login: [
    {
      model: "email",
      required: true,
    },
    {
      model: "password",
      required: true,
    },
  ],
};
