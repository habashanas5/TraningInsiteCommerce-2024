import { ReactNode } from "react";

export interface LayoutSectionRenderingContext {
    isInShell: boolean;
}

/** Allows injecting html into the body or head elements of the site. This will only be called during the initial server side render. */
type LayoutSectionInjector = (renderingContext: LayoutSectionRenderingContext) => ReactNode;
export default LayoutSectionInjector;
