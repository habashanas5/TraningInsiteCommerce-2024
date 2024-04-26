import { getProp } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import styled from "styled-components";

const ListItem = styled.li<InjectableCss>`
    ${getProp("theme.lists.defaultProps.css")}
    ${getProp("theme.lists.listItemProps.css")}
    ${injectCss}
`;

export default ListItem;
