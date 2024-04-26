import useAppSelector from "@insite/client-framework/Common/Hooks/useAppSelector";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getCategoryDepthLoaded as actualGetCategoryDepthLoaded,
    getCategoryState,
} from "@insite/client-framework/Store/Data/Categories/CategoriesSelectors";
import loadCategory from "@insite/client-framework/Store/Data/Categories/Handlers/LoadCategory";
import { HasLinksState } from "@insite/client-framework/Store/Links/LinksState";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import { useDispatch } from "react-redux";

export const getHomePageUrl = (state: HasLinksState) => {
    return getPageLinkByPageType(state, "HomePage")?.url ?? "/";
};

export const getPageLinkByNodeId = (state: HasLinksState, nodeId: string) => {
    const path = state.links.nodeIdToPageLinkPath[nodeId];
    if (!path) {
        return;
    }

    let result = state.links.pageLinks[path[0]];
    for (let index = 1; index < path.length; index = index + 1) {
        if (result.children) {
            result = result.children[path[index]];
        }
    }

    return result;
};

export const getPageLinkByPageType = (state: HasLinksState, pageType: string) => {
    const nodeId = state.links?.pageTypesToNodeId[pageType];
    if (!nodeId) {
        return;
    }

    return getPageLinkByNodeId(state, nodeId);
};

/**
 * @deprecated Use the `useGetLink` hook instead to ensure category links get loaded.
 */
export const getLink = (state: ApplicationState, { type, value }: LinkFieldValue) => {
    const category = type === "Category" ? getCategoryState(state, value).value : null;
    switch (type) {
        case "Page":
            return getPageLinkByNodeId(state, value);
        case "Category":
            return {
                url: category?.path,
                title: category?.shortDescription,
            };
        case "Url":
            return {
                url: value,
                title: value,
            };
    }
};

export const useGetLinks = <T>(list: T[], linkSelector: (item: T) => LinkFieldValue) => {
    const linkFields = list.map(linkSelector);

    const links = useAppSelector(state =>
        linkFields.map(o => {
            const link = getLink(state, o);
            return !link ? { url: undefined, title: undefined } : link;
        }),
    );

    const categoryStates = useAppSelector(state =>
        linkFields.map(linkField => {
            if (linkField.type !== "Category") {
                return;
            }

            return getCategoryState(state, linkField.value);
        }),
    );

    const dispatch = useDispatch();

    for (let x = 0; x < links.length; x++) {
        const linkField = linkFields[x];
        const link = links[x];
        const categoryState = categoryStates[x];

        if (
            linkField.type === "Category" &&
            linkField.value &&
            !link.url &&
            !categoryState?.isLoading &&
            !categoryState?.errorStatusCode
        ) {
            dispatch(loadCategory({ id: linkField.value }));
        }
    }

    return links;
};

export const useGetLink = (linkField: LinkFieldValue) => {
    return useGetLinks([linkField], o => o)[0];
};

export interface LinkModel {
    fields: {
        openInNewWindow: boolean;
        overriddenTitle: string;
        destination: LinkFieldValue;
    };
}

/**
 * @deprecated Use the `useGetLinks` hook instead to ensure category links get loaded. Mapping can be done calling component
 */
export function mapLinks<L extends LinkModel, R = {}>(
    state: ApplicationState,
    links?: L[],
    optionalReturnFunction?: (widgetLink: L, stateLink?: ReturnType<typeof getLink>) => R,
) {
    if (!links || links.length < 1) {
        return [];
    }
    return links.map(widgetLink => {
        const stateLink = getLink(state, widgetLink.fields.destination);
        const optionalReturnValues =
            typeof optionalReturnFunction === "function" ? optionalReturnFunction(widgetLink, stateLink) : {};
        return {
            url: stateLink?.url,
            title: stateLink?.title,
            ...optionalReturnValues,
        } as ReturnType<typeof getLink> & R;
    });
}

/**
 * @deprecated Use getCategoryState instead
 */
export function getCategoryLink(state: HasLinksState, categoryId: string) {
    return getCategoryState(state as ApplicationState, categoryId).value;
}

/**
 * @deprecated Use @insite/client-framework/Store/Data/Categories/CategoriesSelectors/getCategoryDepthLoaded instead
 */
export function getCategoryDepthLoaded(state: HasLinksState, categoryId: string) {
    return actualGetCategoryDepthLoaded(state as ApplicationState, categoryId);
}
