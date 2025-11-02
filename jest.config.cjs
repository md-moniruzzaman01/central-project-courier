module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.vscode/',
    '<rootDir>/../AppData/',
    '<rootDir>/../.vscode/',
    '<rootDir>/../extensions/', // defensive, in case symlinked
  ],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      { tsconfig: 'tsconfig.jest.json' },
    ],
  },
  moduleNameMapper: {
    '^@middlewares/(.*)$': '<rootDir>/src/app/middlewares/$1',
    '^@modules/(.*)$': '<rootDir>/src/app/modules/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@types/(.*)$': '<rootDir>/src/interfaces/$1',
  },
  resolver: 'jest-ts-webcompat-resolver',
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
