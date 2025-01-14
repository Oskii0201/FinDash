import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["<rootDir>/src/__tests__/backend/**/*.test.{ts,tsx}"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  coverageDirectory: "./coverage/backend",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!src/__tests__/**",
  ],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Backend Test Report",
        outputPath: "./reports/backend-test-report.html",
      },
    ],
  ],
};

export default config;
