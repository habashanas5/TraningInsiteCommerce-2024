const createStyledComponentsTransformer = require("typescript-plugin-styled-components").default;

const styledComponentsTransformer = createStyledComponentsTransformer({ minify: true });

module.exports = () => ({ before: [styledComponentsTransformer] });
