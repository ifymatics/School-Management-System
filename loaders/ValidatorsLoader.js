const loader = require("./_common/fileLoader");
const Pine = require("qantra-pineapple");

/**
 * load any file that match the pattern of function file and require them
 * @return an array of the required functions
 */

// module.exports = class ValidatorsLoader {
//   constructor({ models, customValidators } = {}) {
//     this.models = models;
//     this.customValidators = customValidators;
//   }

//   load() {
//     const validators = {};

//     // Load schemes
//     const schemes = loader("./managers/**/*.schema.js");

//     Object.keys(schemes).forEach((sk) => {
//       let pine = new Pine({
//         models: this.models,
//         customValidators: this.customValidators,
//       });

//       validators[sk] = {};
//       Object.keys(schemes[sk]).forEach((s) => {
//         validators[sk][s] = async (data) => {
//           console.log(`Validating data for schema: ${s}`, data);
//           try {
//             const result = await pine.validate(data, schemes[sk][s]);
//             if (!result.success) {
//               return {
//                 isValid: false,
//                 errors: result.errors || ["Unknown error"],
//               };
//             }
//             return { isValid: true, data: result };
//           } catch (error) {
//             console.error("Error during validation:", error);
//             throw error; // Re-throw unexpected errors
//           }
//         };

//         // Add trimmer function
//         validators[sk][`${s}Trimmer`] = async (data) => {
//           try {
//             const result = await pine.trim(data, schemes[sk][s]);

//             return result;
//           } catch (error) {
//             console.error("Error during trimming:", error);
//             throw error;
//           }
//         };
//       });
//     });

//     return validators;
//   }
// };

// module.exports = class ValidatorsLoader {
//   constructor({ models, customValidators } = {}) {
//     this.models = models;
//     this.customValidators = customValidators;
//   }
//   load() {
//     const validators = {};

//     /**
//      * load schemes
//      * load models ( passed to the consturctor )
//      * load custom validators
//      */
//     const schemes = loader("./managers/**/*.schema.js");

//     Object.keys(schemes).forEach((sk) => {
//       let pine = new Pine({
//         models: this.models,
//         customValidators: this.customValidators,
//       });
//       validators[sk] = {};
//       Object.keys(schemes[sk]).forEach((s) => {
//         validators[sk][s] = async (data) => {
//           return await pine.validate(data, schemes[sk][s]);
//         };
//         /** also exports the trimmer function for the same */
//         validators[sk][`${s}Trimmer`] = async (data) => {
//           return await pine.trim(data, schemes[sk][s]);
//         };
//       });
//     });

//     return validators;
//   }
// };

// module.exports = class ValidatorsLoader {
//   constructor({ models, customValidators } = {}) {
//     this.models = models;
//     this.customValidators = customValidators;
//   }

//   load() {
//     const validators = {};

//     // Load schemes
//     const schemes = loader("./managers/**/*.schema.js");

//     Object.keys(schemes).forEach((sk) => {
//       console.log(`Loading schema for key: ${sk}`);
//       let pine = new Pine({
//         models: this.models,
//         customValidators: this.customValidators,
//       });

//       validators[sk] = {};
//       Object.keys(schemes[sk]).forEach((s) => {
//         console.log(`Adding validator for schema: ${s}`);
//         validators[sk][s] = async (data) => {
//           console.log(`Validating data for schema: ${s}`, data);
//           try {
//             console.log(data, schemes[sk][s]);
//             const result = await pine.validate(data, schemes[sk][s]);
//             // console.log("LOGGING_THE_RESULT+++++>===>:", result);
//             // If validation fails, return detailed errors
//             if (result === false || result.errors) {
//               console.error(
//                 "Validation errors:",
//                 result.errors || "No detailed errors returned"
//               );
//               return {
//                 isValid: false,
//                 errors: result.errors
//                   ? this.formatValidationErrors(result.errors)
//                   : [{ field: "unknown", message: "Validation failed" }],
//               };
//             }

//             console.log(`Validation result for schema: ${s}`, result);
//             return {
//               isValid: true,
//               data: result, // Return validated data
//             };
//           } catch (error) {
//             console.error("Error during validation:", error);
//             throw error; // Re-throw unexpected errors
//           }
//         };

//         // Add trimmer function
//         validators[sk][`${s}Trimmer`] = async (data) => {
//           console.log(`Trimming data for schema: ${s}`, data);
//           try {
//             const result = await pine.trim(data, schemes[sk][s]);
//             console.log(`Trimming result for schema: ${s}`, result);
//             return result;
//           } catch (error) {
//             console.error("Error during trimming:", error);
//             throw error;
//           }
//         };
//       });
//     });

//     return validators;
//   }

//   /**
//    * Format validation errors to include field name and error message
//    * @param {Array} errors - Array of validation errors
//    * @returns {Array} - Formatted errors
//    */
//   formatValidationErrors(errors) {
//     return errors.map((error) => ({
//       field: error.path || "unknown", // Field that failed validation
//       message: error.message || "Validation failed", // Error message
//     }));
//   }
// };

/**
 * load any file that match the pattern of function file and require them
 * @return an array of the required functions
 */
module.exports = class ValidatorsLoader {
  constructor({ models, customValidators } = {}) {
    this.models = models;
    this.customValidators = customValidators;
  }
  load() {
    const validators = {};

    /**
     * load schemes
     * load models ( passed to the consturctor )
     * load custom validators
     */
    const schemes = loader("./managers/**/*.schema.js");

    Object.keys(schemes).forEach((sk) => {
      let pine = new Pine({
        models: this.models,
        customValidators: this.customValidators,
      });
      validators[sk] = {};
      Object.keys(schemes[sk]).forEach((s) => {
        validators[sk][s] = async (data) => {
          return await pine.validate(data, schemes[sk][s]);
        };
        /** also exports the trimmer function for the same */
        validators[sk][`${s}Trimmer`] = async (data) => {
          return await pine.trim(data, schemes[sk][s]);
        };
      });
    });

    return validators;
  }
};
/////////////////////////////////////////////////////////////////////
