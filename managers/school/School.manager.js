const { ObjectId } = require("mongodb");

module.exports = class SchoolManager {
  constructor({ config, cache, cortex, mongomodels, validators, managers }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.managers = managers;
    this.validators = validators;
    this.SchoolModel = mongomodels.school;
    this.ClassroomModel = mongomodels.classroom;
    this.schoolCollection = "schools";
  }

  /** Exposed methods */
  httpExposed = [
    "post=createSchool __authSuperAdmin",
    "get=getSchool __authSuperAdmin",
    "get=getSchools __authSuperAdmin",
    "patch=updateSchool __authSuperAdmin",
    "delete=deleteSchool __authSuperAdmin",
  ];

  /** Create a new school */
  async createSchool({ name, address, email, phone }) {
    const school = { name, address, email };

    let validatedResult = await this.validators.school.createSchool(school);

    if (validatedResult) {
      return { statusCode: 401, errors: validatedResult };
    }

    try {
      const schoolExist = await this.SchoolModel.findOne({ email });
      if (schoolExist)
        return { error: true, message: "Email already in use", code: 401 };
      const schoolDoc = {
        name,
        address,
        email,
        phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const newSchool = new this.SchoolModel(schoolDoc);
      const result = await newSchool.save();
      return { ...schoolDoc, _id: result.insertedId };
    } catch (error) {
      console.log(error);
      return { statusCode: 401, errors: "something went wrong" };
    }
  }

  /** Get a school by ID */
  async getSchool({ schoolId }) {
    const school = await this.SchoolModel.findOne({
      _id: schoolId,
    });
    return school;
  }

  /** Get all schools */
  async getSchools() {
    const school = await this.SchoolModel.find({});
    return school;
  }

  /** Update a school */
  async updateSchool({ schoolId, name, address, email, phone }) {
    try {
      const school = { name, address, email, phone };

      let validatedResult = await this.validators.school.updateSchool(school);

      if (validatedResult) {
        return { statusCode: 401, errors: validatedResult };
      }

      const updateFields = {};
      if (name) updateFields.name = name;
      if (address) updateFields.address = address;
      if (email) updateFields.email = email;
      if (phone) updateFields.phone = phone;
      updateFields.updatedAt = new Date();

      const updatedSchool = await this.SchoolModel.findByIdAndUpdate(
        schoolId,
        { $set: updateFields },
        { new: true }
      );
      //console.log(updatedSchool);
      if (!updatedSchool) {
        return { statusCode: 404, errors: "Not found!" };
      }

      return updatedSchool;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Delete a school */
  async deleteSchool({ schoolId }) {
    // Delete the school
    try {
      await this.SchoolModel.deleteOne({ _id: new ObjectId(schoolId) });

      // Delete all classrooms associated with the school
      await this.ClassroomModel.deleteMany({
        schoolId: new ObjectId(schoolId),
      });

      return { success: true };
    } catch (error) {
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }
};
