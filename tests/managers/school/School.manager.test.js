const SchoolManager = require("../../../managers/school/School.manager");
const mongoose = require("mongoose");

describe("SchoolManager", () => {
  let schoolManager;
  let schoolId;

  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect("mongodb://localhost:27017/school_management_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    schoolManager = new SchoolManager({
      config: {},
      cache: {},
      cortex: {},
      mongomodels: {
        school: mongoose.model("School", new mongoose.Schema({ name: String })),
      },
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should create a new school", async () => {
    const schoolData = {
      name: "Greenwood High",
      address: "123 Main St",
      contactEmail: "info@greenwood.com",
      contactPhone: "+1234567890",
    };
    const school = await schoolManager.createSchool(schoolData);
    expect(school).toHaveProperty("_id");
    expect(school.name).toBe(schoolData.name);
    schoolId = school._id;
  });

  it("should get a school by ID", async () => {
    const school = await schoolManager.getSchool({ schoolId });
    expect(school).toHaveProperty("_id");
    expect(school.name).toBe("Greenwood High");
  });

  it("should update a school", async () => {
    const updatedData = { name: "Updated School Name" };
    const updatedSchool = await schoolManager.updateSchool({
      schoolId,
      ...updatedData,
    });
    expect(updatedSchool.name).toBe(updatedData.name);
  });

  it("should delete a school", async () => {
    const result = await schoolManager.deleteSchool({ schoolId });
    expect(result).toEqual({ success: true });
  });

  it("should throw an error if school ID is invalid", async () => {
    await expect(
      schoolManager.getSchool({ schoolId: "invalidId" })
    ).rejects.toThrow();
  });
});
