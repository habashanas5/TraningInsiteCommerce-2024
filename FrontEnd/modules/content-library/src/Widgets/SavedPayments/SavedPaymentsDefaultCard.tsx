import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import deletePaymentProfile from "@insite/client-framework/Store/Data/PaymentProfiles/Handlers/DeletePaymentProfile";
import updateEditModal from "@insite/client-framework/Store/Pages/SavedPayments/Handlers/UpdateEditModal";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { PaymentProfilesContext, SavedPaymentsPageContext } from "@insite/content-library/Pages/SavedPaymentsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    updateEditModal,
    deletePaymentProfile,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SavedPaymentsDefaultCardStyles {
    titleText?: TypographyProps;
    mainWrapper?: InjectableCss;
    headerWrapper?: InjectableCss;
    cardTypeImage?: LazyImageProps;
    descriptionText?: TypographyPresentationProps;
    container?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    nameOnCardLabelText?: TypographyPresentationProps;
    nameOnCardText?: TypographyPresentationProps;
    expirationLabelText?: TypographyPresentationProps;
    expirationText?: TypographyPresentationProps;
    centerColumnGridItem?: GridItemProps;
    billingAddressLabelText?: TypographyPresentationProps;
    billingAddressText?: TypographyPresentationProps;
    rightColumnGridItem?: GridItemProps;
    linksContainer?: GridContainerProps;
    editLinkGridItem?: GridItemProps;
    editLink?: LinkPresentationProps;
    deleteLinkGridItem?: GridItemProps;
    deleteLink?: LinkPresentationProps;
    deleteCardModal?: TwoButtonModalStyles;
}

export const defaultCardStyles: SavedPaymentsDefaultCardStyles = {
    titleText: {
        variant: "h3",
        as: "h2",
    },
    mainWrapper: {
        css: css`
            background-color: ${getColor("common.border")};
            padding: 20px;
        `,
    },
    headerWrapper: {
        css: css`
            display: flex;
        `,
    },
    cardTypeImage: {
        imgProps: {
            style: {
                width: "auto",
            },
        },
    },
    descriptionText: {
        css: css`
            margin: 5px 10px 10px;
        `,
    },
    leftColumnGridItem: {
        width: [6, 6, 4, 4, 4],
        css: css`
            flex-direction: column;
        `,
    },
    nameOnCardLabelText: {
        weight: "bold",
        css: css`
            margin-bottom: 4px;
        `,
    },
    nameOnCardText: {
        css: css`
            margin-bottom: 20px;
        `,
    },
    expirationLabelText: {
        weight: "bold",
        css: css`
            margin-bottom: 4px;
        `,
    },
    centerColumnGridItem: {
        width: [6, 6, 4, 4, 4],
        css: css`
            flex-direction: column;
        `,
    },
    billingAddressLabelText: {
        weight: "bold",
        css: css`
            margin-bottom: 4px;
        `,
    },
    billingAddressText: {
        css: css`
            width: 100%;
        `,
    },
    rightColumnGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            flex-direction: column;
            align-items: center;
        `,
    },
    linksContainer: {
        gap: 20,
        css: css`
            width: 100%;
        `,
    },
    editLinkGridItem: {
        width: [6, 6, 12, 12, 12],
        css: css`
            justify-content: center;
            margin-bottom: 20px;
        `,
    },
    deleteLinkGridItem: {
        width: [6, 6, 12, 12, 12],
        css: css`
            justify-content: center;
            margin-bottom: 20px;
        `,
    },
};

const styles = defaultCardStyles;

const getImageName = (cardType: string) => {
    if (cardType.toLowerCase() === "american express") {
        return "amex";
    }
    if (cardType.toLowerCase() === "discover") {
        return "discover";
    }
    if (cardType.toLowerCase() === "mastercard") {
        return "mc";
    }
    if (cardType.toLowerCase() === "visa") {
        return "visa";
    }
    return "";
};

const SavedPaymentsDefaultCard: React.FC<Props> = ({ updateEditModal, deletePaymentProfile }) => {
    const toasterContext = useContext(ToasterContext);
    const [deleteCardModalIsOpen, setDeleteCardModalIsOpen] = React.useState(false);

    const paymentProfilesDataView = useContext(PaymentProfilesContext);

    if (!paymentProfilesDataView.value) {
        return null;
    }

    const defaultCard = paymentProfilesDataView.value.find(o => o.isDefault);
    if (!defaultCard) {
        return null;
    }

    const editClickHandler = () => {
        updateEditModal({ paymentProfile: defaultCard, modalIsOpen: true });
    };

    const deleteCancelHandler = () => {
        setDeleteCardModalIsOpen(false);
    };

    const deleteSubmitHandler = () => {
        deletePaymentProfile({
            paymentProfileId: defaultCard.id,
            onSuccess: () => {
                toasterContext.addToast({ body: translate("Card Deleted"), messageType: "success" });
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

    const deleteClickHandler = () => {
        setDeleteCardModalIsOpen(true);
    };

    return (
        <>
            <Typography {...styles.titleText} id="cardTitle">
                {translate("Default Card")}
            </Typography>
            <StyledWrapper {...styles.mainWrapper} aria-labelledby="cardTitle" data-test-selector="defaultCard">
                <StyledWrapper {...styles.headerWrapper}>
                    <LazyImage
                        {...styles.cardTypeImage}
                        src={`/images/card-types/${getImageName(defaultCard.cardType)}.png`}
                        altText=""
                    />
                    <Typography {...styles.descriptionText}>
                        {defaultCard.description && <>{defaultCard.description}&nbsp;&mdash;&nbsp;</>}
                        {`${defaultCard.cardType} ${translate("ending in")} ${defaultCard.maskedCardNumber.substring(
                            defaultCard.maskedCardNumber.length - 4,
                        )}`}
                    </Typography>
                </StyledWrapper>
                <GridContainer {...styles.container}>
                    <GridItem {...styles.leftColumnGridItem}>
                        <Typography {...styles.nameOnCardLabelText} id="nameOnCard">
                            {translate("Name on Card")}
                        </Typography>
                        <Typography {...styles.nameOnCardText} aria-labelledby="nameOnCard">
                            {defaultCard.cardHolderName}
                        </Typography>
                        <Typography {...styles.expirationLabelText} id="expiration">
                            {translate("Expiration")}
                        </Typography>
                        <Typography {...styles.expirationText} aria-labelledby="expiration">
                            {defaultCard.expirationDate}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.centerColumnGridItem}>
                        <Typography {...styles.billingAddressLabelText} id="billingAddress">
                            {translate("Billing Address")}
                        </Typography>
                        <Typography {...styles.billingAddressText} aria-labelledby="billingAddress">
                            {[defaultCard.address1, defaultCard.address2, defaultCard.address3, defaultCard.address4]
                                .filter(o => !!o)
                                .join(", ")}
                            <br />
                            {defaultCard.city}, {defaultCard.state}
                            <br />
                            {defaultCard.postalCode}
                            <br />
                            {defaultCard.country}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.rightColumnGridItem}>
                        <GridContainer {...styles.linksContainer}>
                            <GridItem {...styles.editLinkGridItem}>
                                <Link {...styles.editLink} onClick={editClickHandler} data-test-selector="editButton">
                                    {translate("Edit")}
                                </Link>
                            </GridItem>
                            <GridItem {...styles.deleteLinkGridItem}>
                                <Link
                                    {...styles.deleteLink}
                                    onClick={deleteClickHandler}
                                    data-test-selector="deleteButton"
                                >
                                    {translate("Delete")}
                                </Link>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </StyledWrapper>
            <TwoButtonModal
                {...styles.deleteCardModal}
                modalIsOpen={deleteCardModalIsOpen}
                headlineText={translate("Delete Card")}
                messageText={translate("Are you sure you want to delete this card?")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                onCancel={deleteCancelHandler}
                onSubmit={deleteSubmitHandler}
                submitTestSelector="submitDeleteDefaultCardButton"
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(SavedPaymentsDefaultCard),
    definition: {
        displayName: "Default Card",
        group: "Saved Payments",
        allowedContexts: [SavedPaymentsPageContext],
    },
};

export default widgetModule;
