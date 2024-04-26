import { getProp } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import styled from "styled-components";

export const OrderedList = styled.ol<InjectableCss>`
    padding: 0 0 0 40px;
    margin: 1rem 0;
    ol,
    ul {
        margin: 0;
    }
    ${getProp("theme.lists.defaultProps.css")}
    ${getProp("theme.lists.orderedListProps.css")}
    ${injectCss}
`;

export default OrderedList;
