import { ExternalProviderLinkModel } from "@insite/client-framework/Services/IdentityService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadExternalProviders from "@insite/client-framework/Store/Pages/SignIn/Handlers/LoadExternalProviders";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SignInPageContext } from "@insite/content-library/Pages/SignInPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    externalProviders: state.pages.signIn.externalProviders,
});

const mapDispatchToProps = {
    loadExternalProviders,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface SignInExternalProvidersStyles {
    divider?: InjectableCss;
    titleText?: TypographyPresentationProps;
    providerButton?: ButtonPresentationProps;
}

export const signInExternalProvidersStyles: SignInExternalProvidersStyles = {
    divider: {
        css: css`
            margin: 30px 0 20px 0;
        `,
    },
    titleText: {
        weight: "bold",
    },
    providerButton: {
        css: css`
            margin: 20px 20px 0 0;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            width: 100%;
                        `,
                    ],
                    "max",
                )}
        `,
    },
};

const styles = signInExternalProvidersStyles;

const SignInExternalProviders = ({ externalProviders, loadExternalProviders }: Props) => {
    useEffect(() => {
        if (!externalProviders) {
            loadExternalProviders();
        }
    }, [externalProviders]);

    const providerButtonClickHandler = (externalProvider: ExternalProviderLinkModel) => {
        if (externalProvider.url) {
            window.location.href = externalProvider.url;
        }
    };

    if (!externalProviders || externalProviders.length === 0) {
        return null;
    }

    return (
        <>
            <Divider />
            <Typography {...styles.titleText} as="h4">
                {translate("Use another service to log in.")}
            </Typography>
            {externalProviders.map(externalProvider => (
                <Button
                    {...styles.providerButton}
                    key={externalProvider.caption}
                    onClick={() => providerButtonClickHandler(externalProvider)}
                >
                    {externalProvider.caption}
                </Button>
            ))}
        </>
    );
};

const Divider = styled.hr`
    ${styles.divider?.css}
`;

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SignInExternalProviders),
    definition: {
        allowedContexts: [SignInPageContext],
        group: "Sign In",
        displayName: "External Providers",
    },
};

export default widgetModule;
