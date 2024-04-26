import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import TokenExFrame, { TokenExFramePresentationProps } from "@insite/mobius/TokenExFrame";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import styled, { css } from "styled-components";

interface OwnProps {
    canSaveCard?: boolean;
    /** @deprecated Specify the "TokenEx" value for the `iframe` property instead. */
    useTokenExGateway?: boolean;
    iframe?: "TokenEx" | "Paymetric";
    paymetricFrameRef?: React.Ref<HTMLIFrameElement>;
    isTokenExIframeLoaded?: boolean;
    saveCard: boolean;
    onSaveCardChange: (_: React.SyntheticEvent<Element, Event>, value: boolean) => void;
    cardHolderName: string;
    cardHolderNameRef?: React.Ref<HTMLInputElement>;
    onCardHolderNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cardHolderNameError?: string;
    cardNumber: string;
    cardNumberRef?: React.Ref<HTMLInputElement>;
    onCardNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cardNumberError?: string;
    cardType: string;
    cardTypeRef?: React.Ref<HTMLSelectElement>;
    possibleCardType: string;
    onCardTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    cardTypeError?: string;
    expirationMonth: number;
    expirationMonthRef?: React.Ref<HTMLSelectElement>;
    onExpirationMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    expirationError?: string;
    expirationYear: number;
    expirationYearRef?: React.Ref<HTMLSelectElement>;
    onExpirationYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    securityCode: string;
    securityCodeRef?: React.Ref<HTMLInputElement>;
    onSecurityCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    securityCodeError?: string;
    availableCardTypes: { key: string; value: string }[];
    availableMonths: { key: string; value: number }[];
    availableYears: { key: number; value: number }[];
    extendedStyles?: CreditCardDetailsEntryStyles;
}

export interface CreditCardDetailsEntryStyles {
    creditCardDetailsContainer?: GridContainerProps;
    creditCardDetailsHeadingGridItem?: GridItemProps;
    creditCardDetailsHeading?: TypographyPresentationProps;
    saveCardGridItem?: GridItemProps;
    saveCardCheckboxGroup?: CheckboxGroupComponentProps;
    saveCardCheckbox?: CheckboxPresentationProps;
    cardHolderNameGridItem?: GridItemProps;
    cardHolderNameText?: TextFieldPresentationProps;
    cardNumberGridItem?: GridItemProps;
    cardNumberTokenExFrameWrapper?: InjectableCss;
    cardNumberTokenExFrame?: TokenExFramePresentationProps;
    cardNumberText?: TextFieldPresentationProps;
    cardTypeGridItem?: GridItemProps;
    cardTypeTokenExLabel?: TypographyPresentationProps;
    cardTypeTokenExText?: TypographyPresentationProps;
    cardTypeSelect?: SelectPresentationProps;
    expirationDateGridItem?: GridItemProps;
    expirationDateContainer?: GridContainerProps;
    expirationMonthGridItem?: GridItemProps;
    expirationMonthSelect?: SelectPresentationProps;
    expirationYearGridItem?: GridItemProps;
    expirationYearSelect?: SelectPresentationProps;
    securityCodeGridItem?: GridItemProps;
    securityCodeTokenExFrameWrapper?: InjectableCss;
    securityCodeTokenExFrame?: TokenExFramePresentationProps;
    securityCodeText?: TextFieldPresentationProps;
    securityCodeHelpModal?: ModalPresentationProps;
    securityCodeHelpModalImageWrapper?: InjectableCss;
    securityCodeHelpImage?: LazyImageProps;
    paymetricGridItem?: GridItemProps;
    paymetricIframe?: InjectableCss;
}

export const creditCardDetailsEntryStyles: CreditCardDetailsEntryStyles = {
    creditCardDetailsContainer: { gap: 10 },
    creditCardDetailsHeadingGridItem: { width: 12 },
    creditCardDetailsHeading: { variant: "h5" },
    saveCardGridItem: { width: 12 },
    cardHolderNameGridItem: { width: 12 },
    cardNumberGridItem: { width: 12 },
    cardNumberTokenExFrameWrapper: {
        css: css`
            height: inherit;
        `,
    },
    cardTypeGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    cardTypeTokenExLabel: { weight: 600 },
    expirationDateGridItem: { width: 12 },
    expirationDateContainer: { gap: 10 },
    expirationMonthGridItem: { width: 6 },
    expirationYearGridItem: { width: 6 },
    securityCodeGridItem: { width: 12 },
    securityCodeTokenExFrameWrapper: {
        css: css`
            height: inherit;
        `,
    },
    securityCodeHelpModalImageWrapper: {
        css: css`
            display: flex;
            justify-content: center;
        `,
    },
    paymetricGridItem: {
        width: 12,
    },
    paymetricIframe: {
        css: css`
            width: 100%;
        `,
    },
};

const CardNumberTokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;
const SecurityCodeTokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;
const SecurityCodeImageWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const PaymetricIframe = styled.iframe<InjectableCss>`
    ${({ css }) => css}
`;

const CreditCardDetailsEntry = ({
    useTokenExGateway,
    iframe,
    paymetricFrameRef,
    isTokenExIframeLoaded,
    extendedStyles,
    canSaveCard,
    saveCard,
    onSaveCardChange,
    cardHolderName,
    cardHolderNameRef,
    onCardHolderNameChange,
    cardHolderNameError,
    cardNumberError,
    cardNumber,
    cardNumberRef,
    onCardNumberChange,
    possibleCardType,
    onCardTypeChange,
    cardTypeError,
    cardType,
    cardTypeRef,
    availableCardTypes,
    expirationMonth,
    expirationMonthRef,
    onExpirationMonthChange,
    expirationError,
    availableMonths,
    expirationYear,
    expirationYearRef,
    onExpirationYearChange,
    availableYears,
    securityCodeError,
    securityCode,
    securityCodeRef,
    onSecurityCodeChange,
}: OwnProps) => {
    const [isSecurityCodeModalOpen, setIsSecurityCodeModalOpen] = useState(false);
    const [styles] = React.useState(() => mergeToNew(creditCardDetailsEntryStyles, extendedStyles));

    const handleSecurityCodeHelpLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setIsSecurityCodeModalOpen(true);
    };

    const handleSecurityCodeModalClose = (_: React.SyntheticEvent<Element, Event>) => setIsSecurityCodeModalOpen(false);

    const securityCodeLabel = translate("Locate my card's security code");
    const securityCodeHint = <Link onClick={handleSecurityCodeHelpLinkClick}>{securityCodeLabel}</Link>;

    const resolvedShouldUseTokenEx = iframe === "TokenEx" || useTokenExGateway;

    return (
        <GridContainer {...styles.creditCardDetailsContainer}>
            <GridItem {...styles.creditCardDetailsHeadingGridItem}>
                <Typography {...styles.creditCardDetailsHeading} as="h2">
                    {translate("Credit Card Details")}
                </Typography>
            </GridItem>
            {canSaveCard && (
                <GridItem {...styles.saveCardGridItem}>
                    <CheckboxGroup {...styles.saveCardCheckboxGroup}>
                        <Checkbox {...styles.saveCardCheckbox} checked={saveCard} onChange={onSaveCardChange}>
                            {translate("Save card information")}
                        </Checkbox>
                    </CheckboxGroup>
                </GridItem>
            )}
            {iframe === "Paymetric" ? (
                <GridItem {...styles.paymetricGridItem}>
                    <PaymetricIframe id="paymetricIframe" ref={paymetricFrameRef} {...styles.paymetricIframe} />
                </GridItem>
            ) : (
                <>
                    <GridItem {...styles.cardHolderNameGridItem}>
                        <TextField
                            {...styles.cardHolderNameText}
                            label={translate("Name on Card")}
                            value={cardHolderName}
                            onChange={onCardHolderNameChange}
                            required
                            maxLength={30}
                            error={cardHolderNameError}
                            data-test-selector="checkoutReviewAndSubmit_cardHolderName"
                            ref={cardHolderNameRef}
                        />
                    </GridItem>
                    <GridItem {...styles.cardNumberGridItem}>
                        {resolvedShouldUseTokenEx ? (
                            <TokenExFrame
                                {...styles.cardNumberTokenExFrame}
                                label={translate("Card Number")}
                                tokenExIFrameContainer={
                                    <CardNumberTokenExFrameWrapper
                                        {...styles.cardNumberTokenExFrameWrapper}
                                        id="tokenExCardNumber"
                                    />
                                }
                                disabled={!isTokenExIframeLoaded}
                                required
                                error={cardNumberError}
                                data-test-selector="checkoutReviewAndSubmit_cardNumber"
                            />
                        ) : (
                            <TextField
                                {...styles.cardNumberText}
                                label={translate("Card Number")}
                                value={cardNumber}
                                onChange={onCardNumberChange}
                                required
                                maxLength={16}
                                error={cardNumberError}
                                data-test-selector="checkoutReviewAndSubmit_cardNumber"
                                ref={cardNumberRef}
                            />
                        )}
                    </GridItem>
                    <GridItem {...styles.cardTypeGridItem}>
                        {resolvedShouldUseTokenEx ? (
                            <>
                                <Typography {...styles.cardTypeTokenExLabel} id="cardTypeTokenEx">
                                    {translate("Card Type")}
                                </Typography>
                                <TokenExCardTypeDisplay
                                    {...styles.cardTypeTokenExText}
                                    possibleCardType={possibleCardType}
                                    aria-labelledby="cardTypeTokenEx"
                                />
                            </>
                        ) : (
                            <Select
                                {...styles.cardTypeSelect}
                                label={translate("Card Type")}
                                value={cardType}
                                onChange={onCardTypeChange}
                                required
                                error={cardTypeError}
                                data-test-selector="checkoutReviewAndSubmit_cardType"
                                ref={cardTypeRef}
                            >
                                <option value="">{translate("Select Card")}</option>
                                {availableCardTypes.map(ct => (
                                    <option key={ct.value} value={ct.value}>
                                        {ct.key}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </GridItem>
                    <GridItem {...styles.expirationDateGridItem}>
                        <GridContainer {...styles.expirationDateContainer}>
                            <GridItem {...styles.expirationMonthGridItem}>
                                <Select
                                    {...styles.expirationMonthSelect}
                                    label={translate("Expiration Month")}
                                    value={expirationMonth}
                                    onChange={onExpirationMonthChange}
                                    required
                                    error={expirationError}
                                    data-test-selector="checkoutReviewAndSubmit_expirationMonth"
                                    ref={expirationMonthRef}
                                >
                                    {availableMonths.map(month => (
                                        <option key={month.value} value={month.value}>
                                            {month.key}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                            <GridItem {...styles.expirationYearGridItem}>
                                <Select
                                    {...styles.expirationYearSelect}
                                    label={translate("Expiration Year")}
                                    value={expirationYear}
                                    onChange={onExpirationYearChange}
                                    required
                                    data-test-selector="checkoutReviewAndSubmit_expirationYear"
                                    ref={expirationYearRef}
                                >
                                    {availableYears.map(year => (
                                        <option key={year.value} value={year.value}>
                                            {year.key}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.securityCodeGridItem}>
                        {resolvedShouldUseTokenEx ? (
                            <TokenExFrame
                                {...styles.securityCodeTokenExFrame}
                                label={translate("Security code")}
                                hint={securityCodeHint}
                                tokenExIFrameContainer={
                                    <SecurityCodeTokenExFrameWrapper
                                        {...styles.securityCodeTokenExFrameWrapper}
                                        id="tokenExSecurityCode"
                                    />
                                }
                                disabled={!isTokenExIframeLoaded}
                                required
                                error={securityCodeError}
                                data-test-selector="checkoutReviewAndSubmit_securityCode"
                            />
                        ) : (
                            <TextField
                                {...styles.securityCodeText}
                                label={translate("Security code")}
                                hint={securityCodeHint}
                                value={securityCode}
                                onChange={onSecurityCodeChange}
                                required
                                minLength={3}
                                maxLength={4}
                                error={securityCodeError}
                                data-test-selector="checkoutReviewAndSubmit_securityCode"
                                ref={securityCodeRef}
                            />
                        )}
                        <Modal
                            headline={securityCodeLabel}
                            isOpen={isSecurityCodeModalOpen}
                            handleClose={handleSecurityCodeModalClose}
                            {...styles.securityCodeHelpModal}
                        >
                            <SecurityCodeImageWrapper {...styles.securityCodeHelpModalImageWrapper}>
                                <LazyImage
                                    src="/images/security_code_sample.jpg"
                                    imgProps={{ width: 660, height: 264 }}
                                    altText={translate("Location of security code on card")}
                                    {...styles.securityCodeHelpImage}
                                />
                            </SecurityCodeImageWrapper>
                        </Modal>
                    </GridItem>
                </>
            )}
        </GridContainer>
    );
};

type TokenExCardTypeDisplayProps = TypographyProps & {
    possibleCardType: string;
};

const TokenExCardTypeDisplay = ({ possibleCardType, ...otherProps }: TokenExCardTypeDisplayProps) => {
    let cardTypeDisplay = "";
    if (possibleCardType === "masterCard") {
        cardTypeDisplay = "Mastercard";
    } else if (possibleCardType === "americanExpress") {
        cardTypeDisplay = "American Express";
    } else if (possibleCardType === "discover") {
        cardTypeDisplay = "Discover";
    } else if (possibleCardType === "visa") {
        cardTypeDisplay = "Visa";
    }
    return <Typography {...otherProps}>{cardTypeDisplay}</Typography>;
};

export default CreditCardDetailsEntry;
