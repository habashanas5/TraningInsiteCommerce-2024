import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

export interface SearchFieldWrapperStyles {
    wrapper?: InjectableCss;
}

export const searchFieldWrapperStyles: SearchFieldWrapperStyles = {
    wrapper: {
        css: css`
            padding: 10px;
            width: 100%;
        `,
    },
};

const SearchFieldWrapper: React.FC<{ extendedStyles?: SearchFieldWrapperStyles }> = ({ children, extendedStyles }) => {
    const styles = mergeToNew(searchFieldWrapperStyles.wrapper, extendedStyles);
    return <StyledWrapper {...styles}>{children}</StyledWrapper>;
};

export default SearchFieldWrapper;
