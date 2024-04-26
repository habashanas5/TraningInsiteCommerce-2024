import LayoutSectionInjector, {
    LayoutSectionRenderingContext,
} from "@insite/client-framework/Types/LayoutSectionInjector";
import React from "react";

const HeadStart: LayoutSectionInjector = ({ isInShell }: LayoutSectionRenderingContext) => {
    // the return value can be customized based on how the site is being rendered, in this case we only change the background color when not inside the CMS shell
    if (isInShell) {
        return null;
    }

    return <style>{"body { background-color: #ddd !important; }"}</style>;
};

export default HeadStart;
