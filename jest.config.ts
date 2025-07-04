import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // For TypeScript support
  testEnvironment: 'jest-environment-jsdom', // Explicitly specify jsdom
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // For jest-dom extensions
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS modules
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock static assets
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
  },
};

export default config;