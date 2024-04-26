import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import TokenExFrame, { TokenExFramePresentationProps } from "@insite/mobius/TokenExFrame";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import styled, { css } from "styled-components";

interface OwnProps {
    /** @deprecated Specify the "TokenEx" value for the `iframe` property instead. */
    useTokenExGateway?: boolean;
    iframe?: "TokenEx" | "Paymetric";
    isTokenExIframeLoaded?: boolean;
    securityCode: string;
    onSecurityCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    securityCodeError?: string;
    extendedStyles?: SavedPaymentProfileEntryStyles;
}

export interface SavedPaymentProfileEntryStyles {
    text?: TextFieldPresentationProps;
    tokenExFrameWrapper?: InjectableCss;
    tokenExFrame?: TokenExFramePresentationProps;
    securityCodeHelpModal?: ModalPresentationProps;
    securityCodeHelpModalImageWrapper?: InjectableCss;
    securityCodeHelpImage?: LazyImageProps;
}

export const savedPaymentProfileEntryStyles: SavedPaymentProfileEntryStyles = {
    tokenExFrameWrapper: {
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
};

const TokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;
const SecurityCodeImageWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const SavedPaymentProfileEntry = ({
    useTokenExGateway,
    iframe,
    isTokenExIframeLoaded,
    securityCode,
    onSecurityCodeChange,
    securityCodeError,
    extendedStyles,
}: OwnProps) => {
    const [styles] = useState(() => mergeToNew(savedPaymentProfileEntryStyles, extendedStyles));
    const [isSecurityCodeModalOpen, setIsSecurityCodeModalOpen] = useState(false);

    if (iframe === "Paymetric") {
        return null;
    }

    const handleSecurityCodeHelpLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setIsSecurityCodeModalOpen(true);
    };

    const handleSecurityCodeModalClose = (_: React.SyntheticEvent<Element, Event>) => setIsSecurityCodeModalOpen(false);

    const securityCodeHelpLabel = translate("Locate my card's security code");
    const securityCodeHint = <Link onClick={handleSecurityCodeHelpLinkClick}>{securityCodeHelpLabel}</Link>;

    const resolvedShouldUseTokenEx = iframe === "TokenEx" || useTokenExGateway;

    return (
        <>
            {resolvedShouldUseTokenEx ? (
                <TokenExFrame
                    {...styles.tokenExFrame}
                    label={translate("Security code")}
                    hint={securityCodeHint}
                    tokenExIFrameContainer={
                        <TokenExFrameWrapper {...styles.tokenExFrameWrapper} id="ppTokenExSecurityCode" />
                    }
                    disabled={!isTokenExIframeLoaded}
                    required
                    error={securityCodeError}
                    data-test-selector="checkoutReviewAndSubmit_securityCode"
                />
            ) : (
                <TextField
                    {...styles.text}
                    label={translate("Security code")}
                    hint={securityCodeHint}
                    value={securityCode}
                    onChange={onSecurityCodeChange}
                    required
                    minLength={3}
                    maxLength={4}
                    error={securityCodeError}
                    data-test-selector="checkoutReviewAndSubmit_securityCode"
                />
            )}
            <Modal
                headline={securityCodeHelpLabel}
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
        </>
    );
};

export default SavedPaymentProfileEntry;
