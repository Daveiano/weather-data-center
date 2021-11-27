module.exports = {
    preset: "jest-playwright-preset",
    testMatch: ["**/tests/**/*.+(ts|js)", "**/?(*.)+(spec|test).+(ts|js)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};