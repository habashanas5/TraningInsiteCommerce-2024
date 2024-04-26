import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { FlattenInterpolation, FlattenSimpleInterpolation, ThemeProps } from "styled-components";

export type StyledProp<T extends {} = {}> =
    | FlattenSimpleInterpolation
    | FlattenInterpolation<T & ThemeProps<BaseTheme>>;

export default interface InjectableCss<T extends {} = {}> {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<T>;
}
