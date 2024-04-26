import { addPagesFromContext, addWidgetsFromContext } from "@insite/client-framework/Components/ContentItemStore";

const widgets = IS_PRODUCTION
    ? require.context("../../content-library/src/Widgets", true, /(Header|Basic|Common|Footer)\/.+?\.tsx$/)
    : require.context("../../content-library/src/Widgets", true, /\/.+?\.tsx$/);
const onHotWidgetReplace = addWidgetsFromContext(widgets);

const pages = require.context("../../content-library/src/Pages", true, /\.tsx$/);
const onHotPageReplace = addPagesFromContext(pages);

if (module.hot) {
    module.hot.accept(widgets.id, () =>
        onHotWidgetReplace(require.context("../../content-library/src/Widgets", true, /\/.+?\.tsx$/)),
    );
    module.hot.accept(pages.id, () =>
        onHotPageReplace(require.context("../../content-library/src/Pages", true, /\.tsx$/)),
    );
}
