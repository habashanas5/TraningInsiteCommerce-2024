import "@example/Store/Reducers";
import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Configuration"; // Importing nothing to trigger the side effects, which in this case adds custom reducers.
import { setPreStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";

// load all widgets. Without this they won't be included in the bundle
const widgets = require.context("./Widgets", true, /\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);
if (module.hot) {
    module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context("./Widgets", true, /\.tsx$/)));
}

// load all pages. Without this they won't be included in the bundle
const pages = require.context("./Pages", true, /\.tsx$/);
const onHotPageReplace = addPagesFromContext(pages);
if (module.hot) {
    module.hot.accept(pages.id, () => onHotPageReplace(require.context("./Pages", true, /\.tsx$/)));
}

// load all widget extensions. They could be loaded individually instead
const widgetExtensions = require.context("./WidgetExtensions", true);
widgetExtensions.keys().forEach(key => widgetExtensions(key));

// add some post styleguide customizations. These can't be overridden by the style guide
setPreStyleGuideTheme({
    breakpoints: {
        keys: ["xs", "sm", "md", "lg", "xl"],
        values: [0, 576, 768, 992, 1200],
        maxWidths: [540, 540, 720, 960, 1140],
    },
    colors: {
        primary: {
            main: "#FEC84D",
        },
    },
    button: {
        primary: {
            shape: "rectangle",
            typographyProps: {
                color: "black",
            },
        },
        secondary: {
            shape: "rectangle",
        },
        tertiary: {
            shape: "rectangle",
        },
    },
    focus: {
        color: "#FEC84D", // no blue borders on link focus
    },
    link: {
        defaultProps: {
            color: "#D5A027",
        },
    },
    typography: {
        fontFamilyImportUrl: "https://fonts.googleapis.com/css?family=Proxima+Nova:300,400,600,700,800&display=swap",
        body: {
            fontFamily: "'Proxima Nova', 'Roboto', 'Lato', sans-serif",
        },
        headerPrimary: {
            fontFamily: "'Proxima Nova', 'Roboto', 'Lato', sans-serif",
        },
        headerSecondary: {
            fontFamily: "'Proxima Nova', 'Roboto', 'Lato', sans-serif",
        },
        headerTertiary: {
            fontFamily: "'Proxima Nova', 'Roboto', 'Lato', sans-serif",
        },
    },
});
