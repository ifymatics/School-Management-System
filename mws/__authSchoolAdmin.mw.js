const mongoose = require("mongoose");

module.exports = ({ meta, config, managers, mongomodels }) => {
  const Role = mongomodels.role;
  return async ({ req, res, next }) => {
    const token = req.headers.authorization?.split(" ")[1];

    // If no token is provided
    if (!token) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401, // Unauthorized
        errors: "Unauthorized. No access token provided.",
      });
    }

    try {
      // Verify the token
      const decoded = managers.token.verifyLongToken({ token });

      // Fetch roles from the database using the role IDs in decoded.userKey
      const userRoles = await Role.find({
        _id: { $in: decoded.userKey },
        users: { $in: [decoded.userId] },
      });

      // If no roles are found for the user
      if (!userRoles.length) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 403, // Forbidden
          errors: "Access denied. No roles assigned to the user.",
        });
      }

      // Define the required roles for the route
      const requiredRoles = ["SCHOOL_ADMIN", "SUPER_ADMIN"];

      // Check if the user has at least one of the required roles
      const hasRequiredRole = [...userRoles.map((role) => role.name)].some(
        (role) => requiredRoles.includes(role)
      );

      // If the user does not have any of the required roles
      if (!hasRequiredRole) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 403, // Forbidden
          errors: "Access denied. Insufficient permissions.",
        });
      }

      // Attach the decoded user to the request object
      req.user = decoded;
      next(); // Proceed to the next middleware/route
    } catch (err) {
      console.error("Error during token verification or role check:", err);
      // Handle invalid token
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 400, // Bad Request
        errors: "Invalid token.",
      });
    }
  };
};
