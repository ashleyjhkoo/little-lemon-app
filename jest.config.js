    // jest.config.js
    const path = require('path');

    module.exports = {
      // other Jest configurations...
    //   rootDir: path.resolve(__dirname, './LITTLE-LEMON-APP'),
    rootDir: '.',
      testEnvironment: 'jsdom',
      moduleNameMapper: {
        "^@ark-ui/react/(.*)$": [
          "<rootDir>/node_modules/@ark-ui/react/dist/components/$1/index.cjs",
          "<rootDir>/node_modules/@ark-ui/react/dist/components/$1.cjs",
          "<rootDir>/node_modules/@ark-ui/react/dist/providers/$1/index.cjs",
          "<rootDir>/node_modules/@ark-ui/react/dist/providers/$1.cjs",
        ],
        // "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/fileMock.js",
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      //setupFilesAfterEnv: ['Little-Lemon-App/src/setupTests.js'],
    };