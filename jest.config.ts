import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
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
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Setup dla frontendowych testów
  testMatch: ["<rootDir>/src/__tests__/frontend/**/*.test.{ts,tsx}"], // Ścieżki do testów frontendowych
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  coverageDirectory: "./coverage/frontend",
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
        pageTitle: "Frontend Test Report",
        outputPath: "./reports/frontend-test-report.html",
      },
    ],
  ],
};

export default config;
