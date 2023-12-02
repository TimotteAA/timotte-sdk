module.exports = {
    root: true,
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    extends: ['@timotte/eslint-config/base-ts.js'],
};
