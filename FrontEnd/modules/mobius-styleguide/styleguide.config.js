const path = require("path");
const parser = require("react-docgen-typescript");
const sections = require("./config/sections");

const resolveSection = sectionComponents =>
    sectionComponents.map(componentPath =>
        require.resolve(`../../modules/mobius/src/${componentPath}/${componentPath}.tsx`),
    );

module.exports = {
    assetsDir: "static",
    propsParser: parser.withDefaultConfig({
        propFilter: prop => prop.parent && !prop.parent.fileName.includes("node_modules"),
    }).parse,
    exampleMode: "collapse",
    ignore: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "**/*.d.ts"],
    sections: [
        {
            name: "Theme",
            components: resolveSection(sections.theme),
        },
        {
            name: "Resources",
            sections: [
                {
                    name: "Colors",
                    content: "docs/colors.md",
                },
                {
                    name: "Icons",
                    content: "docs/icons.md",
                },
                {
                    name: "Helper Functions",
                    content: "docs/helpers.md",
                },
                {
                    name: "Responsive",
                    content: "docs/responsive.md",
                },
            ],
        },
        {
            name: "Foundations",
            components: resolveSection(sections.foundations),
            description:
                "Foundations are the basic building blocks of this design system. They provide a basic set of configurable options to be used by components and widgets.",
        },
        {
            name: "Components",
            components: resolveSection(sections.components),
        },
        {
            name: "Utilities",
            components: resolveSection(sections.utilities),
        },
    ],
    styleguideComponents: {
        ComponentsListRenderer: path.join(__dirname, "styleguide-components/ComponentsListRenderer"),
        HeadingRenderer: path.join(__dirname, "styleguide-components/HeadingRenderer"),
        Logo: path.join(__dirname, "styleguide-components/Logo"),
        ParaRenderer: path.join(__dirname, "styleguide-components/ParaRenderer"),
        PropsRenderer: path.join(__dirname, "styleguide-components/PropsRenderer"),
        ReactComponent: path.join(__dirname, "styleguide-components/ReactComponent"),
        ReactComponentRenderer: path.join(__dirname, "styleguide-components/ReactComponentRenderer"),
        SectionHeadingRenderer: path.join(__dirname, "styleguide-components/SectionHeadingRenderer"),
        StyleGuideRenderer: path.join(__dirname, "styleguide-components/StyleGuideRenderer"),
        TableOfContentsRenderer: path.join(__dirname, "styleguide-components/TableOfContentsRenderer"),
        Wrapper: require.resolve("../../modules/mobius/src/ThemeProvider/ThemeProvider.tsx"),
    },
    template: {
        title: "Insite Mobius Style Guide",
        head: {
            links: [
                {
                    rel: "shortcut icon",
                    type: "image/x-icon",
                    href: "mobius.ico",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "192x192",
                    href: "android-icon-192x192.png",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "96x96",
                    href: "android-icon-96x96.png",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "32x32",
                    href: "favicon-32x32.png",
                },
                {
                    rel: "icon",
                    type: "image/png",
                    sizes: "16x16",
                    href: "favicon-16x16.png",
                },
            ],
        },
    },
    theme: {
        color: {
            base: "#4a4a4a",
            link: "#275AA8",
            linkHover: "#333",
            sidebarBackground: "#f4f4f4",
            sidebarLink: "#4a4a4a",
            codeBackground: "#263238",
            codeBase: "#fff",
            codeComment: "#81d0dc",
            codePunctuation: "rgba(233, 237, 237, 1)",
            codeProperty: "#82B1FF",
            codeDeleted: "#905",
            codeString: "#FFCB6B",
            codeOperator: "rgba(233, 237, 237, 1)",
            codeKeyword: "#C3E88D",
            codeFunction: "rgba(255, 83, 112, 1)",
            codeAttribute: "#FFCB6B",
            codeAttr: "#FFCB6B",
        },
        fontFamily: {
            base: ["Roboto Condensed", "sans-serif"],
        },
        fontSize: {
            base: 18,
            h3: 28,
            h4: 24,
        },
        sidebarWidth: 270,
        maxWidth: 1240,
    },
    styles: {
        Code: {
            code: {
                background: "rgba(120, 188, 33, 0.2)",
                color: "#3a5c10",
                display: "inline-block",
                padding: "1px 5px",
                borderRadius: "2px",
            },
        },
        Blockquote: {
            blockquote: {
                fontSize: "15px",
                color: "#888888",
            },
        },
    },
    usageMode: "expand",
    webpackConfig: {
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                },
            ],
            noParse: /\.(css|scss)/,
        },
        resolve: {
            extensions: [".js", "jsx", ".ts", ".tsx", ".json"],
        },
    },
};
