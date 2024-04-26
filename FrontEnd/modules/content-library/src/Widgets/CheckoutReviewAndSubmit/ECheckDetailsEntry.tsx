import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import logger from "@insite/client-framework/Logger";
import { TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import translate from "@insite/client-framework/Translate";
import {
    IFrame,
    TokenEx as TokenExType,
    TokenExIframeConfig,
    TokenExIframeStyles,
} from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitPaymentDetails";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import TokenExFrame, { TokenExFramePresentationProps } from "@insite/mobius/TokenExFrame";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react";
import styled, { css } from "styled-components";

interface OwnProps {
    iframe?: "TokenEx";
    paymentMethod: string;
    onAccountHolderNameChange: (value: string) => void;
    onAccountNumberChange: (value: string) => void;
    onRoutingNumberChange: (value: string) => void;
    tokenExFrameStyleConfig: TokenExIframeStyles;
    extendedStyles?: ECheckDetailsEntryStyles;
    showFormErrors?: boolean;
    updateShowFormErrors: (value: boolean) => void;
    updateIsECheckTokenized: (value: boolean) => void;
    setAccountNumberIFrame: (value: IFrame) => void;
    tokenExConfig?: TokenExConfig;
}

export interface Validatable {
    validateAccountHolderNameChange: (value: string) => boolean;
    validateAccountNumberChange: (value: string) => boolean;
    validateRoutingNumberChange: (value: string) => boolean;
}

export interface ECheckDetailsEntryStyles {
    eCheckDetailsContainer?: GridContainerProps;
    eCheckDetailsHeadingGridItem?: GridItemProps;
    eCheckDetailsHeading?: TypographyPresentationProps;
    accountHolderNameGridItem?: GridItemProps;
    accountHolderNameText?: TextFieldPresentationProps;
    accountNumberGridItem?: GridItemProps;
    accountNumberTokenExFrameWrapper?: InjectableCss;
    accountNumberTokenExFrame?: TokenExFramePresentationProps;
    accountNumberText?: TextFieldPresentationProps;
    routingNumberGridItem?: GridItemProps;
    routingNumberTokenExFrameWrapper?: InjectableCss;
    routingNumberTokenExFrame?: TokenExFramePresentationProps;
    routingNumberText?: TextFieldPresentationProps;
}

export const eCheckDetailsEntryStyles: ECheckDetailsEntryStyles = {
    eCheckDetailsContainer: { gap: 10 },
    eCheckDetailsHeadingGridItem: { width: 12 },
    eCheckDetailsHeading: { variant: "h5" },
    accountHolderNameGridItem: { width: 12 },
    accountNumberGridItem: { width: 12 },
    accountNumberTokenExFrameWrapper: {
        css: css`
            height: inherit;
        `,
    },
    routingNumberGridItem: { width: 12 },
    routingNumberTokenExFrameWrapper: {
        css: css`
            height: inherit;
        `,
    },
};

const AccountNumberTokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;
const RoutingNumberTokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;
declare const TokenEx: TokenExType;
let tokenExAccountNumberIframe: IFrame | undefined;
let tokenExRoutingNumberIframe: IFrame | undefined;

const ECheckDetailsEntry = (
    {
        iframe,
        paymentMethod,
        extendedStyles,
        onAccountHolderNameChange,
        onAccountNumberChange,
        onRoutingNumberChange,
        tokenExFrameStyleConfig,
        showFormErrors,
        updateShowFormErrors,
        updateIsECheckTokenized,
        setAccountNumberIFrame,
        tokenExConfig,
    }: OwnProps,
    ref: Ref<Validatable>,
) => {
    const [styles] = React.useState(() => mergeToNew(eCheckDetailsEntryStyles, extendedStyles));

    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [routingNumber, setRoutingNumber] = useState("");
    const [routingNumberError, setRoutingNumberError] = useState("");
    const [accountNumberError, setAccountNumberError] = useState("");
    const [accountHolderNameError, setAccountHolderNameError] = useState("");
    const [isRoutingNumberTokenized, setIsRoutingNumberTokenized] = useState(false);
    const [isTokenExRoutingNumberIframeLoaded, setIsTokenExRoutingNumberIframeLoaded] = useState(false);
    const [isAccountNumberTokenized, setIsAccountNumberTokenized] = useState(false);
    const [isTokenExAccountNumberIframeLoaded, setIsTokenExAccountNumberIframeLoaded] = useState(false);

    const resetForm = () => {
        setRoutingNumberError("");
        setAccountNumberError("");
        setAccountHolderNameError("");
        onAccountNumberChange("");
        onRoutingNumberChange("");
        onAccountHolderNameChange("");
        setIsTokenExRoutingNumberIframeLoaded(false);
        setIsTokenExAccountNumberIframeLoaded(false);
    };

    useImperativeHandle(
        ref,
        () => ({
            validateAccountHolderNameChange,
            validateAccountNumberChange,
            validateRoutingNumberChange,
        }),
        [],
    );

    useEffect(() => resetForm(), [paymentMethod]);
    useEffect(() => {
        if (tokenExConfig) {
            setUpECheckAccountNumberTokenExIframe(tokenExConfig);
            setUpECheckRoutingNumberTokenExIframe(tokenExConfig);
        }
    }, [tokenExConfig]);

    useEffect(() => {
        if (isRoutingNumberTokenized && isAccountNumberTokenized) {
            updateIsECheckTokenized(true);
        }
    }, [isRoutingNumberTokenized, isAccountNumberTokenized]);

    const isNonEmptyString = (value: string | undefined) => value !== undefined && value.trim() !== "";

    const validateAccountHolderNameChange = (accountHolderName: string) => {
        const accountHolderNameValid = isNonEmptyString(accountHolderName);
        setAccountHolderNameError(!accountHolderNameValid ? translate("Account holder name is required.") : "");
        return accountHolderNameValid;
    };

    const validateAccountNumberChange = (accountNumber: string) => {
        if (iframe !== undefined) {
            return true;
        }

        const accountNumberValidNumberRequiredValid = isNonEmptyString(accountNumber);
        if (!accountNumberValidNumberRequiredValid) {
            setAccountNumberError(translate("Account Number is required."));
            return false;
        }

        const accountNumberValidNumberValid = /[a-zA-Z0-9]*/.test(accountNumber);
        if (!accountNumberValidNumberValid) {
            setAccountNumberError(translate("Account Number is invalid."));
            return false;
        }

        setAccountNumberError("");
        return true;
    };

    const validateRoutingNumberChange = (routingNumber: string) => {
        if (iframe !== undefined) {
            return true;
        }

        const routingNumberRequiredValid = isNonEmptyString(routingNumber);
        if (!routingNumberRequiredValid) {
            setRoutingNumberError(translate("Routing Number is required."));
            return false;
        }

        const routingNumberValid = /[a-zA-Z0-9]*/.test(routingNumber);
        if (!routingNumberValid) {
            setRoutingNumberError(translate("Routing Number is invalid."));
            return false;
        }

        setRoutingNumberError("");
        return true;
    };

    const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountNumber(event.currentTarget.value);
        onAccountNumberChange(event.currentTarget.value);
        validateAccountNumberChange(event.currentTarget.value);
    };

    const handleRoutingNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoutingNumber(event.currentTarget.value);
        onRoutingNumberChange(event.currentTarget.value);
        validateRoutingNumberChange(event.currentTarget.value);
    };

    const handleAccountHolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAccountHolderName(event.currentTarget.value);
        onAccountHolderNameChange(event.currentTarget.value);
        validateAccountHolderNameChange(event.currentTarget.value);
    };

    const setUpECheckAccountNumberTokenExIframe = (config: TokenExConfig) => {
        if (tokenExAccountNumberIframe) {
            tokenExAccountNumberIframe.remove();
        }

        const iframeConfig: TokenExIframeConfig = {
            authenticationKey: config.authenticationKey,
            inputType: "text",
            origin: config.origin,
            pci: false,
            styles: tokenExFrameStyleConfig,
            timestamp: config.timestamp,
            tokenExID: config.tokenExId,
            tokenScheme: config.tokenScheme,
        };

        tokenExAccountNumberIframe = new TokenEx.Iframe("tokenExAccountNumber", iframeConfig);
        tokenExAccountNumberIframe.on("load", _ => {
            setIsTokenExAccountNumberIframeLoaded(true);
        });
        tokenExAccountNumberIframe.on("tokenize", data => {
            onAccountNumberChange(data.token);
            setIsAccountNumberTokenized(true);
            tokenExRoutingNumberIframe?.tokenize();
        });
        tokenExAccountNumberIframe.on("validate", data => {
            if (data.isValid) {
                setAccountNumberError("");
            } else {
                updateShowFormErrors(true);
                if (data.validator === "required") {
                    setAccountNumberError(translate("Account Number is required."));
                }
                if (data.validator === "format") {
                    setAccountNumberError(translate("Account Number is invalid."));
                }
            }

            tokenExRoutingNumberIframe?.validate();
        });
        tokenExAccountNumberIframe.on("error", data => {
            logger.error(data);
            setUpECheckAccountNumberTokenExIframe(config);
        });

        tokenExAccountNumberIframe.load();
        setAccountNumberIFrame(tokenExAccountNumberIframe);
    };

    const setUpECheckRoutingNumberTokenExIframe = (config: TokenExConfig) => {
        if (tokenExRoutingNumberIframe) {
            tokenExRoutingNumberIframe.remove();
        }

        const iframeConfig: TokenExIframeConfig = {
            authenticationKey: config.authenticationKey,
            inputType: "text",
            origin: config.origin,
            pci: false,
            styles: tokenExFrameStyleConfig,
            timestamp: config.timestamp,
            tokenExID: config.tokenExId,
            tokenScheme: config.tokenScheme,
        };

        tokenExRoutingNumberIframe = new TokenEx.Iframe("tokenExRoutingNumber", iframeConfig);
        tokenExRoutingNumberIframe.on("load", _ => {
            setIsTokenExRoutingNumberIframeLoaded(true);
        });
        tokenExRoutingNumberIframe.on("tokenize", data => {
            onRoutingNumberChange(data.token);
            setIsRoutingNumberTokenized(true);
        });
        tokenExRoutingNumberIframe.on("validate", data => {
            if (data.isValid) {
                setRoutingNumberError("");
            } else {
                updateShowFormErrors(true);
                if (data.validator === "required") {
                    setRoutingNumberError(translate("Routing Number is required."));
                }
                if (data.validator === "format") {
                    setRoutingNumberError(translate("Routing Number is invalid."));
                }
            }
        });
        tokenExRoutingNumberIframe.on("error", data => {
            logger.error(data);
            setUpECheckRoutingNumberTokenExIframe(config);
        });

        tokenExRoutingNumberIframe.load();
    };

    return (
        <GridContainer {...styles.eCheckDetailsContainer}>
            <GridItem {...styles.eCheckDetailsHeadingGridItem}>
                <Typography {...styles.eCheckDetailsHeading} as="h2">
                    {translate("eCheck Details")}
                </Typography>
            </GridItem>
            <GridItem {...styles.accountHolderNameGridItem}>
                <TextField
                    {...styles.accountHolderNameText}
                    label={translate("Account Holder Name")}
                    value={accountHolderName}
                    onChange={handleAccountHolderNameChange}
                    required
                    maxLength={30}
                    error={accountHolderNameError}
                    data-test-selector="checkoutReviewAndSubmit_accountHolderName"
                />
            </GridItem>
            <GridItem {...styles.accountNumberGridItem}>
                {iframe === "TokenEx" ? (
                    <TokenExFrame
                        {...styles.accountNumberTokenExFrame}
                        label={translate("eCheck Account Number")}
                        tokenExIFrameContainer={
                            <AccountNumberTokenExFrameWrapper
                                {...styles.accountNumberTokenExFrameWrapper}
                                id="tokenExAccountNumber"
                            />
                        }
                        disabled={!isTokenExAccountNumberIframeLoaded}
                        required
                        error={showFormErrors && accountNumberError}
                        data-test-selector="checkoutReviewAndSubmit_accountNumber"
                    />
                ) : (
                    <TextField
                        {...styles.accountNumberText}
                        label={translate("eCheck Account Number")}
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                        required
                        maxLength={16}
                        error={showFormErrors && accountNumberError}
                        data-test-selector="checkoutReviewAndSubmit_accountNumber"
                    />
                )}
            </GridItem>
            <GridItem {...styles.routingNumberGridItem}>
                {iframe === "TokenEx" ? (
                    <TokenExFrame
                        {...styles.routingNumberTokenExFrame}
                        label={translate("eCheck Routing Number")}
                        tokenExIFrameContainer={
                            <RoutingNumberTokenExFrameWrapper
                                {...styles.routingNumberTokenExFrameWrapper}
                                id="tokenExRoutingNumber"
                            />
                        }
                        disabled={!isTokenExRoutingNumberIframeLoaded}
                        required
                        error={showFormErrors && routingNumberError}
                        data-test-selector="checkoutReviewAndSubmit_routingNumber"
                    />
                ) : (
                    <TextField
                        {...styles.routingNumberText}
                        label={translate("eCheck Routing Number")}
                        value={routingNumber}
                        onChange={handleRoutingNumberChange}
                        required
                        maxLength={9}
                        error={showFormErrors && routingNumberError}
                        data-test-selector="checkoutReviewAndSubmit_routingNumber"
                    />
                )}
            </GridItem>
        </GridContainer>
    );
};

export default forwardRef(ECheckDetailsEntry);
