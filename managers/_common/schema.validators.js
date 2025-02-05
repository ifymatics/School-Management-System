// module.exports = {
//   username: (data) => {
//     if (data.trim().length < 3) {
//       return false;
//     }
//     return true;
//   },
//   name: (data) => {
//     if (data.trim().length < 3) {
//       return false;
//     }
//     return true;
//   },
//   address: (data) => {
//     if (data.trim().length < 3) {
//       return false;
//     }
//     return true;
//   },
//   email: (data) => {
//     if (data.trim().length < 3 || data.trim().length > 100) {
//       return false;
//     }
//     return true;
//   },
//   phone: (data) => {
//     if (data.trim().length < 13) {
//       return false;
//     }
//     return true;
//   },
//   schoolId: (data) => {
//     if (data.trim().length < 20) {
//       return false;
//     }
//     return true;
//   },
//   classroomId: (data) => {
//     if (data.trim().length < 20) {
//       return false;
//     }
//     return true;
//   },
//   capacity: (data) => {
//     if (data.trim().length < 7) {
//       return false;
//     }
//     return true;
//   },

//   password: (data) => {
//     if (!data || typeof data !== "string" || data.trim().length < 7) {
//       return false;
//     }
//     return true;
//   },
//   duties: (data) => {
//     if (Array.isArray(data) && data.length < 1) {
//       return false;
//     }
//     return true;
//   },
// };
module.exports = {
  username: (data) => {
    return data.trim().length >= 3; // Username must be at least 3 characters
  },
  name: (data) => {
    return data.trim().length >= 3; // Name must be at least 3 characters
  },
  address: (data) => {
    return data.trim().length >= 3; // Address must be at least 3 characters
  },
  schoolId: (data) => {
    return data.trim().length >= 15; // Address must be at least 3 characters
  },
  capacity: (data) => {
    return data.trim().length >= 1; // Address must be at least 3 characters
  },
  gender: (data) => {
    return data.trim().length >= 4; // Address must be at least 3 characters
  },
  age: (data) => {
    return data.trim().length >= 1; // Address must be at least 3 characters
  },
  email: (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailRegex.test(data.trim()); // Validate email format
  },
  phone: (data) => {
    return data.trim().length === 13; // Phone must be exactly 13 characters
  },
  schoolId: (data) => {
    return data.trim().length >= 20; // School ID must be at least 20 characters
  },
  classroomId: (data) => {
    return data.trim().length >= 20; // Classroom ID must be at least 20 characters
  },
  capacity: (data) => {
    return data.trim().length >= 7; // Capacity must be at least 7 characters
  },
  password: (data) => {
    return data.trim().length >= 8; // Password must be at least 8 characters
  },
  duties: (data) => {
    return Array.isArray(data) && data.length > 0; // Duties must be a non-empty array
  },
};
