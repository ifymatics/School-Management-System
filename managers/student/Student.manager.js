module.exports = class StudentManager {
  constructor({ config, cache, cortex, managers, validators, mongomodels }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.managers = managers;
    this.validators = validators;
    this.StudentModel = mongomodels.student;
  }

  /** Exposed methods */
  httpExposed = [
    "post=createStudent __authSchoolAdmin",
    "get=getStudent __authSchoolAdmin",
    "get=getStudentsBySchool __authSchoolAdmin",
    "patch=updateStudent __authSchoolAdmin",
    "delete=deleteStudent __authSchoolAdmin",
  ];

  /** Create a new student */
  async createStudent({ name, age, gender, schoolId, classroomId, email }) {
    console.log({ name, age, gender, schoolId, classroomId, email });
    try {
      const student = { name, age, gender, schoolId, classroomId, email };

      let validatedResult = await this.validators.student.createStudent(
        student
      );

      if (validatedResult) {
        return { statusCode: 401, errors: validatedResult };
      }
      const studentExist = await this.StudentModel.findOne({ email });
      if (studentExist)
        return { statusCode: 401, errors: "Email already in use" };
      const studentDoc = {
        name,
        age,
        gender,
        schoolId,
        classroomId,
        email,
      };
      const newStudent = new this.StudentModel(studentDoc);
      await newStudent.save();
      return newStudent;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Get a student by ID */
  async getStudent({ studentId }) {
    const student = await this.StudentModel.findById(studentId);
    return student;
  }

  /** Get all students for a school */
  async getStudentsBySchool({ schoolId }) {
    const students = await this.StudentModel.find({ schoolId });
    return students;
  }

  /** Update a student */
  async updateStudent({ studentId, name, age, gender, classroomId }) {
    try {
      const updatedValue = { studentId, name, age, gender, classroomId };
      let validatedResult = await this.validators.student.updateStudent(
        updatedValue
      );
      if (validatedResult) {
        return { statusCode: 401, errors: validatedResult };
      }
      const updateFields = {};
      if (name) updateFields.name = name;
      if (age) updateFields.age = age;
      if (gender) updateFields.gender = gender;
      if (classroomId) updateFields.classroomId = classroomId;
      updateFields.updatedAt = new Date();

      const student = await this.StudentModel.findByIdAndUpdate(
        studentId,
        { $set: updateFields },
        { new: true }
      );
      return student;
    } catch (error) {
      console.log(error);
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  /** Delete a student */
  async deleteStudent({ studentId }) {
    await this.StudentModel.findByIdAndDelete(studentId);
    return { success: true };
  }
};
