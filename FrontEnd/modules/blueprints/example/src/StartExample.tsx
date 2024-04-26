// import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Configuration";

// Load all custom widgets so they are included in the bundle and enable hot module reloading for them. Do not do this for the ./Overrides folder
// const widgets = require.context("./Widgets", true, /\.tsx$/);
// const onHotWidgetReplace = addWidgetsFromContext(widgets);
// if (module.hot) {
//     module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context("./Widgets", true, /\.tsx$/)));
// }

// Load all custom pages so they are included in the bundle and enable hot module reloading for them. Do not do this for the ./Overrides folder
// const pages = require.context("./Pages", true, /\.tsx$/);
// const onHotPageReplace = addPagesFromContext(pages);
// if (module.hot) {
//     module.hot.accept(pages.id, () => onHotPageReplace(require.context("./Pages", true, /\.tsx$/)));
// }

// Load all handlers so they are included in the bundle.
// const handlers = require.context("./Handlers", true);
// handlers.keys().forEach(key => handlers(key));

// Load all the extensions to the base widgets. This includes style extensions.
// const widgetExtensions = require.context("./WidgetExtensions", true);
// widgetExtensions.keys().forEach(key => widgetExtensions(key));
