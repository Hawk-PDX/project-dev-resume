export default {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/backend/'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/main.jsx',
        '!src/App.jsx',
    ],
    coverageThreshold: {
        global: {
            statements: 5,
            branches: 5,
            functions: 3,
            lines: 5
        }
    }
};
