import { Dictionary } from "@insite/client-framework/Common/Types";
import * as WebCrawler from "@insite/client-framework/Common/WebCrawler";
import AsyncComponent from "@insite/client-framework/Components/AsyncComponent";
import MissingComponent from "@insite/client-framework/Components/MissingComponent";
import logger from "@insite/client-framework/Logger";
import { nullPage } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { PageDefinition, WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import PageModule from "@insite/client-framework/Types/PageModule";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import * as React from "react";

type RequireContext = __WebpackModuleApi.RequireContext;

export interface FoundModule<T extends WidgetModule | PageModule> {
    /** The default export is expected to be the component itself. */
    readonly default?: T;
}

const widgetComponents: Dictionary<React.ComponentType<HasFields>> = {};
const widgetDefinitions: Dictionary<WidgetDefinition> = {};
const pageComponents: Dictionary<React.ComponentType<HasFields>> = {};
/**
 * @deprecated Use DefinitionLoader.getPageDefinitions instead.
 */
export const pageDefinitions: Dictionary<PageDefinition> = {};

export function registerPageModule(module: FoundModule<PageModule>, type: string) {
    pageComponents[type] = module.default!.component;
    pageDefinitions[type] = module.default!.definition;
}

function loadPages(foundItems: RequireContext) {
    loadItems(foundItems, "Page", registerPageModule);
}

export function registerWidgetModule(module: FoundModule<WidgetModule>, type: string) {
    widgetComponents[type] = module.default!.component;
    widgetDefinitions[type] = module.default!.definition;
}

function loadWidgets(foundItems: RequireContext) {
    loadItems(foundItems, "Widget", registerWidgetModule);
}

function loadItems<T extends FoundModule<PageModule | WidgetModule>>(
    foundItems: RequireContext,
    itemType: string,
    action: (module: T, type: string) => void,
) {
    for (const foundItemKey of foundItems.keys()) {
        const type = foundItemKey.replace("./", "").replace(".tsx", "");
        const module = foundItems<T>(foundItemKey);

        if (!module.default) {
            continue;
        }

        if (!module.default.component && module.default.definition) {
            logger.error(
                `The ${itemType} at '${foundItemKey}' did not properly export a ${itemType}Module. It is missing a component property.`,
            );
            continue;
        }

        if (module.default.component && !module.default.definition) {
            logger.error(
                `The ${itemType} at '${foundItemKey}' did not properly export a ${itemType}Module. It is missing a definition property.`,
            );
            continue;
        }

        action(module, type);
    }
}

/**
 * Provides a source for widgets.
 * The returned function can be called during hot replacement events to reload the items.
 * @param widgets Context (via `require.context`) for widgets to add.
 * @returns A function to reload widgets that have changed while otherwise preserving state of the view.
 * @example
 * const widgets = require.context('./Widgets', true, /\.tsx$/);
 * const onHotWidgetReplace = addWidgetsFromContext(widgets);
 *
 * if (module.hot) {
 *     module.hot.accept(widgets.id, () => onHotWidgetReplace(require.context('./Widgets', true, /\.tsx$/)));
 * }
 */
export function addWidgetsFromContext(widgets: RequireContext) {
    loadWidgets(widgets);

    const onHotWidgetReplace = (replacements: RequireContext) => {
        loadWidgets(replacements);

        for (const update of widgetForceUpdates) {
            update();
        }
    };

    return onHotWidgetReplace;
}

/**
 * Provides a source for widgets.
 * The returned function can be called during hot replacement events to reload the items.
 * @param pages Context (via `require.context`) for pages to add.
 * @returns A function to reload pages that have changed while otherwise preserving state of the view.
 * @example
 * const pages = require.context('./Pages', true, /\.tsx$/);
 * const onHotPageReplace = addPagesFromContext(pages);
 *
 * if (module.hot) {
 *     module.hot.accept(pages.id, () => onHotPageReplace(require.context('./Pages', true, /\.tsx$/)));
 * }
 */
export function addPagesFromContext(pages: RequireContext) {
    loadPages(pages);

    const onHotPageReplace = (replacements: RequireContext) => {
        loadPages(replacements);

        for (const update of pageForceUpdates) {
            update();
        }
    };

    return onHotPageReplace;
}

export function createPageElement(type: string, props: HasFields) {
    if (type === nullPage.type) {
        return null;
    }

    if (!pageComponents[type]) {
        return React.createElement(MissingComponent, { type, isWidget: false });
    }

    return React.createElement(pageComponents[type], props);
}

export function createWidgetElement(type: string, props: HasFields) {
    if (!widgetComponents[type]) {
        return React.createElement(AsyncComponent, { type, isWidget: true, ...props });
    }

    return React.createElement(widgetComponents[type], props);
}

const widgetForceUpdates: (() => void)[] = [];

export function registerWidgetUpdate(forceUpdate: () => void) {
    widgetForceUpdates.push(forceUpdate);
}

export function unregisterWidgetUpdate(forceUpdate: () => void) {
    const index = widgetForceUpdates.indexOf(forceUpdate);
    if (index >= 0) {
        widgetForceUpdates.splice(index, 1);
    }
}

const pageForceUpdates: (() => void)[] = [];

export function registerPageUpdate(forceUpdate: () => void) {
    pageForceUpdates.push(forceUpdate);
}

export function unregisterPageUpdate(forceUpdate: () => void) {
    const index = pageForceUpdates.indexOf(forceUpdate);
    if (index >= 0) {
        pageForceUpdates.splice(index, 1);
    }
}

export function getTheWidgetDefinitions(): Dictionary<WidgetDefinition> {
    return widgetDefinitions;
}

/**
 * @deprecated Use DefinitionLoader.getPageDefinitions instead.
 */
export function getThePageDefinitions(): Dictionary<PageDefinition> {
    return pageDefinitions;
}

/**
 * @deprecated Use Webcrawler.setIsWebCrawler instead.
 */
export function setIsWebCrawler(value: boolean) {
    WebCrawler.setIsWebCrawler(value);
}

/**
 * @deprecated Use Webcrawler.getIsWebCrawler instead.
 */
export function getIsWebCrawler() {
    return WebCrawler.getIsWebCrawler();
}

/**
 * @deprecated Use Webcrawler.checkIsWebCrawler instead.
 */
export function checkIsWebCrawler(userAgent: string): boolean {
    return WebCrawler.checkIsWebCrawler(userAgent);
}
