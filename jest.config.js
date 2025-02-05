module.exports = {
  roots: ["./", "./tests"], // Add your folder here
  moduleDirectories: ["node_modules", "src"], // Ensure Jest finds modules
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};
