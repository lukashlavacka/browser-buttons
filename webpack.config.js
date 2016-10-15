module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: "./dist/browser-buttons.js",
        libraryTarget: "var",
        library: "browserButtons"
    }
};
