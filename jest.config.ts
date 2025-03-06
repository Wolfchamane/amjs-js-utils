import type { Config } from 'jest';

export default (): Config => ({
    extensionsToTreatAsEsm: ['.ts'],
    collectCoverage: process.argv.includes('--coverage'),
    collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', { useESM: true, isolatedModules: true }]
    },
    rootDir: './src',
    moduleNameMapper: {
        '^@/(.+)': '<rootDir>/$1'
    },
    testEnvironment: 'node',
    verbose: true
});
