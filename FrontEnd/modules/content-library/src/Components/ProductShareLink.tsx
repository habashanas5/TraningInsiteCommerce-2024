import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import shareProduct from "@insite/client-framework/Store/CommonHandlers/ShareProduct";
import validateReCaptcha from "@insite/client-framework/Store/Components/ReCaptcha/Handlers/ValidateReCaptcha";
import translate from "@insite/client-framework/Translate";
import ReCaptcha from "@insite/content-library/Components/ReCaptcha";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    text?: string;
    extendedStyles?: ProductShareLinkStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasProduct;

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
});

const mapDispatchToProps = {
    shareProduct,
    validateReCaptcha: makeHandlerChainAwaitable<{}, boolean>(validateReCaptcha),
};

export interface ProductShareLinkStyles {
    link?: LinkPresentationProps;
    modal?: ModalPresentationProps;
    container?: GridContainerProps;
    recipientNameGridItem?: GridItemProps;
    recipientNameTextField?: TextFieldProps;
    recipientEmailGridItem?: GridItemProps;
    recipientEmailTextField?: TextFieldProps;
    yourNameGridItem?: GridItemProps;
    yourNameTextField?: TextFieldProps;
    yourEmailGridItem?: GridItemProps;
    yourEmailTextField?: TextFieldProps;
    yourMessageGridItem?: GridItemProps;
    yourMessageTextArea?: TextAreaProps;
    reCaptchaGridItem?: GridItemProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    shareButton?: ButtonPresentationProps;
}

export const productShareLinkStyles: ProductShareLinkStyles = {
    modal: {
        size: 600,
        cssOverrides: {
            modalTitle: css`
                padding: 10px 30px;
            `,
            modalContent: css`
                padding: 20px 30px;
            `,
        },
    },
    container: { gap: 10 },
    recipientNameGridItem: {
        width: 6,
        css: css`
            padding-right: 10px;
        `,
    },
    recipientEmailGridItem: {
        width: 6,
        css: css`
            padding-left: 10px;
        `,
    },
    yourNameGridItem: {
        width: 6,
        css: css`
            padding-right: 10px;
        `,
    },
    yourEmailGridItem: {
        width: 6,
        css: css`
            padding-left: 10px;
        `,
    },
    yourMessageGridItem: {
        width: 12,
    },
    yourMessageTextArea: {
        cssOverrides: {
            inputSelect: css`
                resize: none;
            `,
        },
    },
    reCaptchaGridItem: {
        width: 12,
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    shareButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const ProductShareLink = ({
    product,
    productInfo,
    text,
    session,
    shareProduct,
    validateReCaptcha,
    extendedStyles,
}: Props) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(productShareLinkStyles, extendedStyles));
    const isAuthenticated = (session.isAuthenticated || session.rememberMe) && !session.isGuest;
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [recipientName, setRecipientName] = React.useState("");
    const [recipientNameError, setRecipientNameError] = React.useState("");
    const [recipientEmail, setRecipientEmail] = React.useState("");
    const [recipientEmailError, setRecipientEmailError] = React.useState("");
    const initialYourName = isAuthenticated
        ? `${session!.firstName} ${session!.lastName}`.trim() || session!.userName || ""
        : "";
    const [yourName, setYourName] = React.useState(initialYourName);
    const [yourNameError, setYourNameError] = React.useState("");
    const initialYourEmail = isAuthenticated ? session.email || "" : "";
    const [yourEmail, setYourEmail] = React.useState(initialYourEmail);
    const [yourEmailError, setYourEmailError] = React.useState("");
    const [yourMessage, setYourMessage] = React.useState("");
    const [yourMessageError, setYourMessageError] = React.useState("");
    const [inProgress, setInProgress] = React.useState(false);

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const shareLinkClickHandler = () => {
        resetFields();
        setModalIsOpen(true);
    };

    const requiredFieldMessage = translate("This is a required field");
    const emailFieldMessage = translate("Enter a valid email address");
    const checkForErrors = () => {
        const regexp = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

        const localRecipientNameError = !recipientName ? requiredFieldMessage : "";
        setRecipientNameError(localRecipientNameError);
        const localRecipientEmailError = !recipientEmail
            ? requiredFieldMessage
            : regexp.test(recipientEmail)
            ? ""
            : emailFieldMessage;
        setRecipientEmailError(localRecipientEmailError);
        const localYourNameError = !yourName ? requiredFieldMessage : "";
        setYourNameError(localYourNameError);
        const localYourEmailError = !yourEmail ? requiredFieldMessage : regexp.test(yourEmail) ? "" : emailFieldMessage;
        setYourEmailError(localYourEmailError);
        const localYourMessageError = !yourMessage ? requiredFieldMessage : "";
        setYourMessageError(localYourMessageError);

        return !!(
            localRecipientNameError ||
            localRecipientEmailError ||
            localYourNameError ||
            localYourEmailError ||
            localYourMessageError
        );
    };

    const resetFields = () => {
        setRecipientName("");
        setRecipientNameError("");
        setRecipientEmail("");
        setRecipientEmailError("");
        setYourName(initialYourName);
        setYourNameError("");
        setYourEmail(initialYourEmail);
        setYourEmailError("");
        setYourMessage("");
        setYourMessageError("");
        setInProgress(false);
    };

    const recipientNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientName(event.target.value);
        setRecipientNameError(!event.target.value ? requiredFieldMessage : "");
    };
    const recipientEmailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientEmail(event.target.value);
        setRecipientEmailError(!event.target.value ? requiredFieldMessage : "");
    };
    const yourNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setYourName(event.target.value);
        setYourNameError(!event.target.value ? requiredFieldMessage : "");
    };
    const yourEmailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setYourEmail(event.target.value);
        setYourEmailError(!event.target.value ? requiredFieldMessage : "");
    };
    const yourMessageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setYourMessage(event.target.value);
        setYourMessageError(!event.target.value ? requiredFieldMessage : "");
    };

    const shareButtonClickHandler = async () => {
        if (checkForErrors()) {
            return;
        }

        const isReCaptchaValid = await validateReCaptcha({});
        if (!isReCaptchaValid) {
            return;
        }

        setInProgress(true);

        shareProduct({
            product,
            productDetailPath: productInfo.productDetailPath,
            friendsName: recipientName,
            friendsEmailAddress: recipientEmail,
            yourName,
            yourEmailAddress: yourEmail,
            yourMessage,
            onSuccess: () => {
                setModalIsOpen(false);
                toasterContext.addToast({ body: siteMessage("TellAFriend_Success"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    return (
        <>
            <Link {...styles.link} onClick={shareLinkClickHandler} data-test-selector="productShareLink">
                {text || translate("Share")}
            </Link>
            <Modal
                {...styles.modal}
                headline={translate("Share Product")}
                isOpen={modalIsOpen}
                handleClose={modalCloseHandler}
            >
                <GridContainer {...styles.container} data-test-selector="productShareModal">
                    <GridItem {...styles.recipientNameGridItem}>
                        <TextField
                            label={translate("Recipient Name*")}
                            value={recipientName}
                            error={recipientNameError}
                            onChange={recipientNameChangeHandler}
                            data-test-selector="productShareRecipientName"
                            {...styles.recipientNameTextField}
                        />
                    </GridItem>
                    <GridItem {...styles.recipientEmailGridItem}>
                        <TextField
                            label={translate("Recipient Email*")}
                            value={recipientEmail}
                            error={recipientEmailError}
                            onChange={recipientEmailChangeHandler}
                            data-test-selector="productShareRecipientEmail"
                            {...styles.recipientEmailTextField}
                        />
                    </GridItem>
                    <GridItem {...styles.yourNameGridItem}>
                        <TextField
                            label={translate("Your Name*")}
                            value={yourName}
                            error={yourNameError}
                            onChange={yourNameChangeHandler}
                            data-test-selector="productShareYourName"
                            {...styles.yourNameTextField}
                        />
                    </GridItem>
                    <GridItem {...styles.yourEmailGridItem}>
                        <TextField
                            label={translate("Your Email*")}
                            value={yourEmail}
                            error={yourEmailError}
                            onChange={yourEmailChangeHandler}
                            data-test-selector="productShareYourEmail"
                            {...styles.yourEmailTextField}
                        />
                    </GridItem>
                    <GridItem {...styles.yourMessageGridItem}>
                        <TextArea
                            label={translate("Your Message*")}
                            value={yourMessage}
                            error={yourMessageError}
                            onChange={yourMessageChangeHandler}
                            data-test-selector="productShareYourMessage"
                            {...styles.yourMessageTextArea}
                        />
                    </GridItem>
                    <GridItem {...styles.reCaptchaGridItem}>
                        <ReCaptcha location="ShareProduct" />
                    </GridItem>
                </GridContainer>
                <StyledWrapper {...styles.buttonsWrapper}>
                    <Button
                        {...styles.cancelButton}
                        onClick={modalCloseHandler}
                        data-test-selector="productShareCancel"
                    >
                        {translate("Cancel")}
                    </Button>
                    <Button
                        {...styles.shareButton}
                        onClick={shareButtonClickHandler}
                        data-test-selector="productShareSubmit"
                        disabled={inProgress}
                    >
                        {translate("Share")}
                    </Button>
                </StyledWrapper>
            </Modal>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductShareLink));
