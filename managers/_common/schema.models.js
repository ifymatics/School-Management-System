const emojis = require("../../public/emojis.data.json");

module.exports = {
  id: {
    label: "id",
    type: "string",
    length: { min: 1, max: 50 },
  },
  username: {
    path: "username",
    type: "string",
    length: { min: 3, max: 20 },
    custom: "username",
  },
  password: {
    label: "password",
    type: "string",
    length: { min: 8, max: 100 },
    path: "password",
  },
  address: {
    label: "address",
    type: "string",
    length: { min: 8, max: 100 },
    path: "address",
  },
  name: {
    label: "name",
    type: "string",
    length: { min: 8, max: 100 },
    path: "name",
  },
  email: {
    path: "email",
    label: "email",
    type: "string",
    length: { min: 3, max: 100 },
  },
  title: {
    path: "title",
    type: "string",
    length: { min: 3, max: 300 },
  },
  label: {
    path: "label",
    type: "string",
    length: { min: 3, max: 100 },
  },
  shortDesc: {
    path: "desc",
    type: "string",
    length: { min: 3, max: 300 },
  },
  longDesc: {
    path: "desc",
    type: "string",
    length: { min: 3, max: 2000 },
  },
  url: {
    path: "url",
    type: "string",
    length: { min: 9, max: 300 },
  },
  emoji: {
    path: "emoji",
    type: "Array",
    items: {
      type: "string",
      length: { min: 1, max: 10 },
      oneOf: emojis.value,
    },
  },
  price: {
    path: "price",
    type: "number",
  },
  age: {
    path: "age",
    type: "Number",
    label: "age",
  },
  avatar: {
    path: "avatar",
    type: "string",
    length: { min: 8, max: 100 },
  },
  gender: {
    path: "gender",
    type: "String",
    label: "gender",
    length: { min: 4, max: 7 },
  },
  text: {
    type: "String",
    length: { min: 3, max: 15 },
  },
  longText: {
    type: "String",
    length: { min: 3, max: 250 },
    length: { min: 15, max: 24 },
  },
  schoolId: {
    type: "String",
    length: { min: 15, max: 24 },
    label: "schoolId",
    path: "schoolId",
  },
  capacity: {
    type: "Number",
    label: "capacity",

    length: { min: 1, max: 2000 },
    path: "capacity",
  },
  classroomId: {
    type: "String",
    length: { min: 15, max: 24 },
    label: "classroomId",
    path: "classroomId",
  },
  paragraph: {
    type: "String",
    length: { min: 3, max: 10000 },
  },
  phone: {
    type: "String",
    length: 13,
    label: "phone",
  },

  number: {
    type: "Number",
    length: { min: 1, max: 6 },
  },
  arrayOfStrings: {
    type: "Array",
    items: {
      type: "String",
      length: { min: 3, max: 100 },
    },
  },
  obj: {
    type: "Object",
  },
  bool: {
    type: "Boolean",
  },
};
