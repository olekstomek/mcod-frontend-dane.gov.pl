// jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/'],
    setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"],
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@env/(.*)': '<rootDir>/src/environments/$1',
        "^lodash-es$": "lodash"
    },
    "transformIgnorePatterns": [
        'node_modules/(?!@ngrx)',
        "/!node_modules\\/lodash-es/"
    ]
};
