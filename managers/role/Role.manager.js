const jwt = require("jsonwebtoken");
const utils = require("../../libs/utils");

module.exports = class RoleManager {
  constructor({ config, cache, cortex, managers, validators, mongomodels }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.validators = validators;
    this.managers = managers;
    this.RoleModel = mongomodels.role;
    this.UserModel = mongomodels.auth;
  }

  /** Exposed methods */
  httpExposed = [
    "post=createRole __authSuperAdmin",
    "get=getRole __authSuperAdmin",
    "patch=updateRole __authSuperAdmin",
    "delete=deleteRole __authSuperAdmin",
    "post=assignRoleToUser __authSuperAdmin",
    "post=assignRoleToUser __authSuperAdmin",
    "get=getUsersForRole __authSuperAdmin",
  ];

  async createRole({ description, name }) {
    try {
      const role = { description, name };
      let validatedResult = await this.validators.role.createRole(role);

      if (validatedResult) {
        return { statusCode: 401, errors: validatedResult };
      }

      const roleExist = await this.RoleModel.findOne({ name });

      if (roleExist) {
        return { statusCode: 401, errors: "Role already exists" };
      }

      const newRole = new this.RoleModel(role);
      const createdRole = await newRole.save();

      return createdRole;
    } catch (error) {
      return { statusCode: 401, errors: "Role already exists" };
    }
  }

  async assignRoleToUser({ userId, roleId }) {
    try {
      const user = await this.UserModel.findById(userId);
      const role = await this.RoleModel.findById(roleId);

      if (!user || !role) {
        return { statusCode: 404, errors: "User or Role not found" };
      }

      // Add the role to the user's roles array
      user.roles.push(role._id);
      await user.save();

      // Add the user to the role's users array
      role.users.push(user._id);
      await role.save();

      return `Role ${role.name} assigned to user ${user.name}`;
    } catch (error) {
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  async getUsersForRole({ roleId }) {
    try {
      const role = await this.RoleModel.findById(roleId).populate("users");
      return `Users with role ${role.name}:`, role.users;
    } catch (error) {
      return { statusCode: 401, errors: "Something went wrong" };
    }
  }

  async getRoles() {
    const roles = await this.RoleModel.find({});
    return roles;
  }
  async getRolesForUser(userId) {
    try {
      const user = await this.UserModel.findById(userId).populate("roles");
      return `Roles for user ${user.name}:`, user.roles;
    } catch (error) {
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  async updateRole({ roleId, duties }) {
    const role = { duties };

    let validatedResult = await this.validators.role.updateRole(role);
    if (!validatedResult) {
      return { error: true, message: "Input field missing", code: 401 };
    }
    try {
      const updateFields = {};
      if (Array.isArray(duties)) updateFields.duties = duties;

      updateFields.updatedAt = new Date();

      const updatedRole = await this.RoleModel.findByIdAndUpdate(
        roleId,
        { $set: updateFields },
        { new: true }
      );

      if (!updatedRole) {
        return { statusCode: 404, errors: "School not fount" };
      }

      return updatedRole;
    } catch (error) {
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }

  async deleteRole({ roleId }) {
    try {
      // Delete the role
      await this.SchoolModel.deleteOne({ _id: new ObjectId(roleId) });

      // Delete all roles associated with the user
      await this.RoleModel.deleteMany({ roleId: new ObjectId(roleId) });

      return { success: true };
    } catch (error) {
      return { statusCode: 500, errors: "Something went wrong" };
    }
  }
};
