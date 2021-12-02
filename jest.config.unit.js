module.exports = {
    displayName: 'Unit & integration tests',
    testMatch: ["**/src/renderer/**/?(*.)+(spec|test).+(ts|js|tsx)"],
    transform: {
        '^.+\\.jsx?$': require.resolve('babel-jest'),
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    setupFilesAfterEnv: ['./jest-setup-unit.ts'],
    transformIgnorePatterns: [
        "node_modules/?!(react-router)"
    ],
    testEnvironment: 'jest-environment-jsdom',
};