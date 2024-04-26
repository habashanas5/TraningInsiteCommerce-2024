import { SafeDictionary } from "@insite/client-framework/Common/Types";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import styled, { StyledComponent } from "styled-components";

// This should work but doesn't in TypeScript 3.7.1-rc
// <T extends keyof JSX.IntrinsicElements>(element: T) => styled[element]<InjectableCss>` ${injectCss} `;
const createStyledWrapper = <T extends keyof JSX.IntrinsicElements>(
    element: T,
): StyledComponent<T, any, InjectableCss, never> => (styled as any)[element]<InjectableCss>` ${injectCss} `;

/** A styled `div` element that allows for render-time style customization. */
const StyledWrapper = createStyledWrapper("div");

const wrapperCache: SafeDictionary<StyledComponent<any, any, InjectableCss, never>> = {
    div: StyledWrapper,
};

/**
 * Provides a styled wrapper component for the indicated element.
 * A cache is used so that each element's component is internally created just once.
 */
export const getStyledWrapper = <T extends keyof JSX.IntrinsicElements>(element: T) => {
    const cached = wrapperCache[element];
    if (!cached) {
        const created = (wrapperCache[element] = createStyledWrapper(element));
        return created;
    }

    return cached as StyledComponent<T, any, InjectableCss, never>;
};

export default StyledWrapper;
