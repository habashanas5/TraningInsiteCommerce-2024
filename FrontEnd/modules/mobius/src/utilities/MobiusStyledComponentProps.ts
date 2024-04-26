import { ExtendedTheme } from "@insite/mobius/ThemeProvider";
import React from "react";
import { StyledComponentProps } from "styled-components";

type AsTypes = keyof JSX.IntrinsicElements | React.ComponentType<any>;

type ExtendSCProps<
    // Generic Types as in `MobiusStyledComponentProps`
    C extends keyof JSX.IntrinsicElements,
    O extends object = {},
    A extends keyof any = never,
> = Omit<
    StyledComponentProps<
        C,
        ExtendedTheme,
        O &
            /** It is a known issue that typing only accepts intrinsic attributes that are associated with the value passed
             * to the component type as `C`, and not the attributes associated with the value passed to the component type
             * as `as` or as `forwardedAs`. */
            Omit<JSX.IntrinsicElements[C], "ref"> & {
                as?: AsTypes;
                forwardedAs?: AsTypes;
                "data-test-selector"?: string;
                htmlFor?: string;
            },
        A
    >,
    "ref"
>;

type MobiusStyledComponentProps<
    // The Component from which props are derived;
    C extends keyof JSX.IntrinsicElements,
    // Other props of the component itself;
    O extends object = {},
    // Optional: If the styled component uses .attrs, the props that are made optional by that use.
    A extends keyof any = never,
> = ExtendSCProps<C, O, A>;

export type MobiusStyledComponentPropsWithRef<
    // The Component from which props are derived;
    C extends keyof JSX.IntrinsicElements,
    // Definition of the ref object to be added to the props object.
    R extends object,
    // Other props of the component itself;
    O extends object = {},
    // Optional: If the styled component uses .attrs, the props that are made optional by that use.
    A extends keyof any = never,
> = Omit<ExtendSCProps<C, O, A>, "ref"> & R;

export default MobiusStyledComponentProps;
