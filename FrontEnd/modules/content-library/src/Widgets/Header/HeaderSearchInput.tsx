import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import React from "react";

export interface HeaderSearchInputStyles {
    searchInputStyles?: SearchInputStyles;
}

export const searchInputStyles: HeaderSearchInputStyles = {};

export const HeaderSearchInput: React.FC<WidgetProps> = ({ id }) => {
    const styles = useMergeStyles("headerSearchInput", searchInputStyles);

    return <SearchInput id={id} extendedStyles={styles.searchInputStyles} />;
};

const widgetModule: WidgetModule = {
    component: HeaderSearchInput,
    definition: {
        group: "Header",
        displayName: "Search Input",
        allowedContexts: ["Header"],
    },
};

export default widgetModule;
