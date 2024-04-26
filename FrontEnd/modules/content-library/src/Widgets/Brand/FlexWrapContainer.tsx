/* eslint-disable spire/export-styles */
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import styled from "styled-components";

export type FlexWrapContainerProps = {} & InjectableCss;

/**
 * FlexWrapContainer can be used to create a flexible display, that can be used to wrap FlexItem's and consistently control the wrapping of the items.
 */
const FlexWrapContainer = styled.div<FlexWrapContainerProps>`
    overflow: visible;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    ${injectCss}
`;

/** @component */
export default FlexWrapContainer;
