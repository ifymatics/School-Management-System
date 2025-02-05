module.exports = class ClassroomManager {
  constructor({ config, cache, cortex, mongomodels, validators }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.validators = validators;
    this.ClassroomModel = mongomodels.classroom;
    this.StudentModel = mongomodels.student;
  }

  /** Exposed methods */
  httpExposed = [
    "post=createClassroom __authSchoolAdmin",
    "get=getClassroom __authSchoolAdmin",
    "get=getClassroomsBySchool __authSchoolAdmin",
    "patch=updateClassroom __authSchoolAdmin",
    "delete=deleteClassroom __authSchoolAdmin",
  ];

  /** Create a new classroom */
  async createClassroom({ name, schoolId, capacity, resources }) {
    try {
      const classroom = { name, schoolId, capacity, resources };
      let validatedResult = await this.validators.classroom.createClassroom(
        classroom
      );
      if (validatedResult) {
        return { statusCode: 401, errors: validatedResult };
      }
      const classroomExist = await this.ClassroomModel.findOne({ name });

      if (classroomExist)
        return { statusCode: 401, errors: "classroom already exists" };
      const classroomDoc = {
        name,
        schoolId,
        capacity,
        resources,
      };
      const newClassroom = new this.ClassroomModel(classroomDoc);
      await newClassroom.save();
      return newClassroom;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Get a classroom by ID */
  async getClassroom({ classroomId }) {
    try {
      const classroom = await this.ClassroomModel.findById(classroomId);
      return classroom;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Get all classrooms for a school */
  async getClassroomsBySchool({ schoolId }) {
    try {
      const classrooms = await this.ClassroomModel.find({ schoolId });
      return classrooms;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Update a classroom */
  async updateClassroom({ classroomId, name, capacity, resources }) {
    try {
      const classroomValue = { name, schoolId, capacity, resources };
      let validatedResult = await this.validators.classroom.updateClassroom(
        classroomValue
      );
      if (!validatedResult) {
        return { error: true, message: "Input field missing", code: 401 };
      }
      const updateFields = {};
      if (name) updateFields.name = name;
      if (capacity) updateFields.capacity = capacity;
      if (resources) updateFields.resources = resources;
      updateFields.updatedAt = new Date();

      const classroom = await this.ClassroomModel.findByIdAndUpdate(
        classroomId,
        { $set: updateFields },
        { new: true }
      );
      return classroom;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Delete a classroom */
  async deleteClassroom({ classroomId }) {
    try {
      await this.ClassroomModel.findByIdAndDelete(classroomId);
      // Delete all associated with the classroom
      await this.StudentModel.deleteMany({
        classroomId: new ObjectId(classroomId),
      });
      return { success: true };
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }
};
