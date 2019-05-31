// jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
    setupTestFrameworkScriptFile: "<rootDir>/src/jest.setup.ts",
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@env/(.*)': '<rootDir>/src/environments/$1'
    },
    "transformIgnorePatterns": [
        "node_modules/(?!@ngrx|ngx-cookie-service)"
    ]
};
