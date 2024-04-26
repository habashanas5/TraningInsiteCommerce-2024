import "@example/Store/Reducers";
import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Configuration"; // Importing nothing to trigger the side effects, which in this case adds custom reducers.
import { setPostStyleGuideTheme, setPreStyleGuideTheme } from "@insite/client-framework/ThemeConfiguration";
import { css } from "styled-components";

import ShoppingCart from "@insite/mobius/Icons/ShoppingCart";

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

// load all handlers. They could be loaded individually instead.
const handlers = require.context("./Handlers", true);
handlers.keys().forEach(key => handlers(key));

// load all widget extensions. They could be loaded individually instead
const widgetExtensions = require.context("./WidgetExtensions", true);
widgetExtensions.keys().forEach(key => widgetExtensions(key));

// add some pre styleguide customizations. These can be overridden by the style guid.
setPreStyleGuideTheme({
    colors: {
        secondary: {
            main: "#080",
        },
    },
    typography: {
        h2: {
            weight: 26,
            transform: "lowercase",
        },
    },
    toast: {
        defaultProps: {
            iconSrcByMessage: {
                success: ShoppingCart,
            },
        },
    },
});

// add some post styleguide customizations. These cannot be overridden by the style guid.
setPostStyleGuideTheme({
    colors: {
        primary: {
            main: "#b00",
        },
    },
    typography: {
        h1: {
            weight: 42,
            italic: true,
            size: "84px",
            lineHeight: 1.2,
            transform: "uppercase",
        },
        h2: {
            css: css`
                color: red;
            `,
        },
        p: {
            css: css`
                color: pink;
            `,
        },
    },
    link: { defaultProps: { icon: { iconProps: { color: "secondary", size: 48 } } } },
    button: {
        primary: {
            color: "primary",
            css: css`
                border: 2px solid lime;
            `,
            hoverMode: "lighten",
            sizeVariant: "medium",
        },
    },
    formField: {
        defaultProps: {
            border: "underline",
            backgroundColor: "common.accent",
        },
    },
    dataTable: {
        defaultProps: {
            cssOverrides: {
                table: css`
                    border: 2px solid cyan;
                `,
            },
        },
    },
    breadcrumbs: {
        defaultProps: {
            css: css`
                font-style: italic;
                text-decoration: underline;
            `,
        },
    },
    clickable: {
        defaultProps: {
            css: css`
                background: #ececec;
                border-radius: 3px;
                padding: 5px;
                margin: 4px;
                border: 1px solid #eee;
            `,
        },
    },
    checkbox: {
        groupDefaultProps: {
            css: css`
                background: black;
                color: yellow;
            `,
        },
        defaultProps: {
            css: css`
                background: black;
                color: yellow;
            `,
        },
    },
    zIndex: {
        tabGroup: 1000,
    },
    icon: {
        defaultProps: {
            css: css`
                display: flex;
                justify-content: center;
                color: violet;
                height: 50px;
                width: 50px;
                background: #222;
                border-radius: 3px;
            `,
        },
    },
});
