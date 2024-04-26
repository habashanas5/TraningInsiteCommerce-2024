import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import React from "react";

const enum fields {
    title = "title",
    previousSearches = "previousSearches",
}

type Props = WidgetProps & {
    fields: {
        [fields.title]: string;
        [fields.previousSearches]: number;
    };
};

const SearchHistory = ({ fields: { title, previousSearches } }: Props) => {
    const visualization: JSX.Element[] = [];
    for (let value = 0; value < previousSearches; value++) {
        visualization.push(
            <Typography variant="p" key={value}>
                Previous Search {value + 1}
            </Typography>,
        );
    }

    return (
        <>
            <Typography variant="p">{title}</Typography>
            {visualization}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: SearchHistory,
    definition: {
        group: "Mobile",
        icon: "Search",
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "Search History",
                isRequired: true,
                fieldType: "Translatable",
            },
            {
                name: fields.previousSearches,
                displayName: "Number of Previous Searches",
                editorTemplate: "DropDownField",
                defaultValue: 5,
                options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => ({ value })),
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
