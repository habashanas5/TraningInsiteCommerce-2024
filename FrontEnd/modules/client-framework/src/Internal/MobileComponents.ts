import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";

const widgets = require.context("./Widgets", true, /\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);

const pages = require.context("./Pages", true, /\.tsx$/);
const onHotPageReplace = addPagesFromContext(pages);

if (module.hot) {
    module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context("./Widgets", true, /\.tsx$/)));
    module.hot.accept(pages.id, () => onHotPageReplace(require.context("./Pages", true, /\.tsx$/)));
}
