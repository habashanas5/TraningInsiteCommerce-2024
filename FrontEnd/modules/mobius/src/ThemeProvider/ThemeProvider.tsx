import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GlobalStyle, { ChildGlobals } from "@insite/mobius/GlobalStyle";
import * as React from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";

export interface ExtendedTheme extends BaseTheme {
    [key: string]: any;
}

export interface ThemeProviderProps {
    children?: React.ReactNode;
    /** Determines whether the global styles will be created for the site based on this theme. */
    createGlobalStyle?: boolean;
    /** Determines whether children will be provided text styles based on this theme. */
    createChildGlobals?: boolean;
    theme: ExtendedTheme;
    /** Function to localize UI strings. */
    translate: (text: string) => string;
}

type ThemeProviderPropsCompleted = Omit<ThemeProviderProps, "translate"> &
    Required<Pick<ThemeProviderProps, "translate">>;

/**
 * Exposes a theme object to its child components, and creates global CSS rules based on the theme.
 */
const ThemeProvider: React.FC<ThemeProviderPropsCompleted> = ({
    children,
    theme,
    createChildGlobals,
    createGlobalStyle,
    translate = (text: string) => text,
}) => {
    theme!.translate = translate;
    return (
        <SCThemeProvider theme={theme}>
            <>
                {createGlobalStyle && <GlobalStyle />}
                {createChildGlobals && <ChildGlobals data-id="childGlobals">{children}</ChildGlobals>}
                {!createChildGlobals && children}
            </>
        </SCThemeProvider>
    );
};

ThemeProvider.defaultProps = {
    createGlobalStyle: false,
    createChildGlobals: true,
    theme: baseTheme,
};

export default ThemeProvider;
