module.exports = {
  displayName: "End-to-end tests",
  preset: "jest-playwright-preset",
  testMatch: ["**/src/main/**/?(*.)+(spec|test).+(ts|js|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "node",
};
