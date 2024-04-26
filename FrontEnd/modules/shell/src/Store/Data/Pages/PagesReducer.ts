import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { UpdateFieldParameter } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { initialState, reducer } from "@insite/client-framework/Store/Data/Pages/PagesReducer";
import { PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import {
    createContextualIds,
    getContextualId,
    prepareFields,
} from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import PageProps, { ItemProps } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Draft } from "immer";

const newReducer = {
    ...reducer,
    "Data/Pages/MoveWidgetTo": (
        draft: Draft<PagesState>,
        action: {
            id: string;
            parentId: string;
            zoneName: string;
            index: number;
            pageId: string;
        },
    ) => {
        const widget = draft.widgetsById[action.id];
        const oldParentId = widget.parentId;
        const oldZone = widget.zone;

        widget.parentId = action.parentId;
        widget.zone = action.zoneName;

        draft.widgetsById[action.id] = widget;

        const pageContent = draft.widgetIdsByPageIdParentIdAndZone[action.pageId];
        const oldLocation = pageContent[oldParentId][oldZone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);

        if (typeof pageContent[widget.parentId] === "undefined") {
            pageContent[widget.parentId] = {};
        }

        if (typeof pageContent[widget.parentId][widget.zone] === "undefined") {
            pageContent[widget.parentId][widget.zone] = [];
        }

        pageContent[widget.parentId][widget.zone].splice(action.index, 0, widget.id);

        draft.draggingWidgetId = undefined;
    },

    "Data/Pages/AddWidget": (
        draft: Draft<PagesState>,
        action: {
            widget: WidgetProps;
            index: number;
            pageId: string;
        },
    ) => {
        const { widget, index, pageId } = action;
        const { id, parentId, zone } = widget;
        const { widgetsById } = draft;
        widgetsById[widget.id] = widget;

        const widgetIdsByPageId = draft.widgetIdsByPageId;
        if (!widgetIdsByPageId[pageId]) {
            widgetIdsByPageId[pageId] = [];
        }

        widgetIdsByPageId[pageId].push(id);

        const pageContent = draft.widgetIdsByPageIdParentIdAndZone[pageId];

        if (typeof pageContent[parentId] === "undefined") {
            pageContent[parentId] = {};
        }

        if (typeof pageContent[parentId][zone] === "undefined") {
            pageContent[parentId][zone] = [];
        }

        pageContent[parentId][zone].splice(index, 0, id);
    },

    "Data/Pages/UpdateField": (draft: Draft<PagesState>, action: UpdateFieldParameter) => {
        const {
            fieldName,
            id,
            value,
            fieldType,
            language,
            defaultLanguageId,
            personaId,
            defaultPersonaId,
            deviceType,
        } = action;
        const { id: languageId } = language;

        const contentItemModel = draft.byId[id] || draft.widgetsById[id];

        let { generalFields, translatableFields, contextualFields } = contentItemModel;
        if (!translatableFields) {
            translatableFields = contentItemModel.translatableFields = {};
        }
        if (!contextualFields) {
            contextualFields = contentItemModel.contextualFields = {};
        }
        if (!generalFields) {
            generalFields = contentItemModel.generalFields = {};
        }

        if (fieldType === "Translatable") {
            let translatableField = translatableFields[fieldName];
            if (!translatableField) {
                translatableField = translatableFields[fieldName] = {};
            }
            if (!translatableField[languageId]) {
                translatableField[languageId] = {};
            }

            translatableField[languageId] = value;
            if (contextualFields[action.fieldName]) {
                delete contextualFields[action.fieldName];
            }
            if (generalFields[action.fieldName]) {
                delete generalFields[action.fieldName];
            }
        } else if (fieldType === "Contextual") {
            let contextualField = contextualFields[fieldName];
            if (!contextualField) {
                contextualField = contextualFields[fieldName] = {};
            }

            const contextualId = getContextualId(
                language.id,
                language.hasDeviceSpecificContent ? deviceType : "Desktop",
                language.hasPersonaSpecificContent ? personaId : defaultPersonaId,
            );
            if (!contextualField[contextualId]) {
                contextualField[contextualId] = {};
            }

            contextualField[contextualId] = value;

            if (translatableFields[action.fieldName]) {
                delete translatableFields[action.fieldName];
            }
            if (generalFields[action.fieldName]) {
                delete generalFields[action.fieldName];
            }
        } else {
            generalFields[action.fieldName] = action.value;
            if (translatableFields[action.fieldName]) {
                delete translatableFields[action.fieldName];
            }
            if (contextualFields[action.fieldName]) {
                delete contextualFields[action.fieldName];
            }
        }

        const contextualIds = createContextualIds(
            languageId,
            defaultLanguageId,
            deviceType,
            [personaId],
            defaultPersonaId,
        );

        prepareFields(contentItemModel, languageId, defaultLanguageId, contextualIds);
    },

    "Data/Pages/RemoveWidget": (draft: Draft<PagesState>, action: { id: string; pageId: string }) => {
        const widget = draft.widgetsById[action.id];
        delete draft.widgetsById[action.id];

        const oldLocation = draft.widgetIdsByPageIdParentIdAndZone[action.pageId][widget.parentId][widget.zone];
        const oldIndex = oldLocation.indexOf(widget.id);
        oldLocation.splice(oldIndex, 1);
    },

    "Data/Pages/ReplaceItem": (draft: Draft<PagesState>, action: { item: ItemProps }) => {
        if (draft.byId[action.item.id]) {
            draft.byId[action.item.id] = action.item as PageProps;
        } else {
            draft.widgetsById[action.item.id] = action.item as WidgetProps;
        }
    },
};

export default createTypedReducerWithImmer(initialState, newReducer);
