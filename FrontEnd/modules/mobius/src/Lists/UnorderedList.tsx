import { getProp } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import styled from "styled-components";

export const UnorderedList = styled.ul<InjectableCss>`
    list-style: disc;
    padding: 0 0 0 40px;
    margin: 1rem 0;
    ul,
    ol {
        margin: 0;
    }
    ${getProp("theme.lists.defaultProps.css")}
    ${getProp("theme.lists.unorderedListProps.css")}
    ${injectCss}
`;

export default UnorderedList;
