/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['config'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tests/jest.tsconfig.json'
    }]
  },
  rootDir: "./tests"
  
};
