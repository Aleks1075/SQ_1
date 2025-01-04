module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.ts"],
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  rootDir: "src",
  verbose: true,
  testTimeout: 30000,
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "../coverage",
  collectCoverageFrom: [
    "**/services/**/*.ts",
    "**/models/**/*.ts",
    "!**/node_modules/**",
  ],
};
