import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import deletePaymentProfile from "@insite/client-framework/Store/Data/PaymentProfiles/Handlers/DeletePaymentProfile";
import updatePaymentProfile from "@insite/client-framework/Store/Data/PaymentProfiles/Handlers/UpdatePaymentProfile";
import updateEditModal from "@insite/client-framework/Store/Pages/SavedPayments/Handlers/UpdateEditModal";
import translate from "@insite/client-framework/Translate";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { PaymentProfilesContext, SavedPaymentsPageContext } from "@insite/content-library/Pages/SavedPaymentsPage";
import Accordion from "@insite/mobius/Accordion";
import { ManagedAccordionSection } from "@insite/mobius/AccordionSection";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectProps } from "@insite/mobius/Select";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import sortBy from "lodash/sortBy";
import * as React from "react";
import { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    updateEditModal,
    updatePaymentProfile,
    deletePaymentProfile,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SavedPaymentsCardListStyles {
    headerContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleText?: TypographyProps;
    sortByGridItem?: GridItemProps;
    sortBySelect?: SelectProps;
    cardHeaderWrapper?: InjectableCss;
    cardTypeImage?: LazyImageProps;
    descriptionText?: TypographyPresentationProps;
    cardInfoContainer?: GridContainerProps;
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
    useAsDefaultGridItem?: GridItemProps;
    useAsDefaultButton?: ButtonPresentationProps;
    editLinkGridItem?: GridItemProps;
    editLink?: LinkPresentationProps;
    deleteLinkGridItem?: GridItemProps;
    deleteLink?: LinkPresentationProps;
    deleteCardModal?: TwoButtonModalStyles;
}

export const cardListStyles: SavedPaymentsCardListStyles = {
    headerContainer: { gap: 20 },
    titleGridItem: { width: [12, 12, 5, 5, 5] },
    titleText: {
        variant: "h3",
        as: "h2",
        css: css`
            margin-bottom: 0;
        `,
    },
    sortByGridItem: { width: [12, 12, 7, 7, 7] },
    sortBySelect: {
        labelPosition: "left",
        labelProps: {
            css: css`
                width: auto;
            `,
        },
        cssOverrides: {
            formField: css`
                margin-bottom: 1rem;
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(theme, [
                        css`
                            justify-content: flex-start;
                        `,
                        css`
                            justify-content: flex-start;
                        `,
                        css`
                            justify-content: flex-end;
                        `,
                        css`
                            justify-content: flex-end;
                        `,
                        css`
                            justify-content: flex-end;
                        `,
                    ])}
            `,
        },
    },
    cardHeaderWrapper: {
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
            margin: 5px 10px;
            font-size: 15px;
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
    useAsDefaultGridItem: {
        width: 12,
        css: css`
            justify-content: center;
            margin-bottom: 20px;
        `,
    },
    useAsDefaultButton: {
        variant: "secondary",
        css: css`
            width: 100%;
            padding: 0 15px;
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

const styles = cardListStyles;

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

const SavedPaymentsCardList: React.FC<Props> = ({ updateEditModal, updatePaymentProfile, deletePaymentProfile }) => {
    const [sortByProperty, setSortByProperty] = React.useState("maskedCardNumber");
    const sortByChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortByProperty(event.target.value);
    };

    const toasterContext = React.useContext(ToasterContext);
    const useAsDefaultClickHandler = (paymentProfile: AccountPaymentProfileModel) => {
        const paymentProfileToUpdate = { ...paymentProfile, isDefault: true };
        updatePaymentProfile({
            paymentProfile: paymentProfileToUpdate,
            onSuccess: () => {
                toasterContext.addToast({ body: translate("Default Card Updated"), messageType: "success" });
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

    const editClickHandler = (paymentProfile: AccountPaymentProfileModel) => {
        updateEditModal({ paymentProfile, modalIsOpen: true });
    };

    const [deleteCardModalIsOpen, setDeleteCardModalIsOpen] = React.useState(false);
    const [paymentProfileToDelete, setPaymentProfileToDelete] = React.useState<AccountPaymentProfileModel | null>(null);
    const deleteCancelHandler = () => {
        setDeleteCardModalIsOpen(false);
    };

    const deleteSubmitHandler = () => {
        if (!paymentProfileToDelete) {
            return;
        }

        deletePaymentProfile({
            paymentProfileId: paymentProfileToDelete.id,
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

    const deleteClickHandler = (paymentProfile: AccountPaymentProfileModel) => {
        setPaymentProfileToDelete(paymentProfile);
        setDeleteCardModalIsOpen(true);
    };

    const paymentProfilesDataView = useContext(PaymentProfilesContext);

    if (!paymentProfilesDataView.value) {
        return null;
    }

    const sortedAndFilteredSavedPayments = sortBy(
        paymentProfilesDataView.value.filter(o => !o.isDefault),
        sortByProperty,
    );
    if (sortedAndFilteredSavedPayments.length === 0) {
        return null;
    }

    return (
        <>
            <GridContainer {...styles.headerContainer} data-test-selector="cardListHeader">
                <GridItem {...styles.titleGridItem}>
                    <Typography {...styles.titleText} id="listTitle">
                        {translate("Saved Cards")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.sortByGridItem}>
                    <Select
                        {...styles.sortBySelect}
                        label={translate("Sort by")}
                        value={sortByProperty}
                        onChange={sortByChangeHandler}
                        data-test-selector="sortBy"
                    >
                        <option value="maskedCardNumber">{translate("Card Number")}</option>
                        <option value="description">{translate("Card Nickname")}</option>
                        <option value="cardType">{translate("Card Type")}</option>
                    </Select>
                </GridItem>
            </GridContainer>
            <Accordion headingLevel={4} aria-labelledby="listTitle" data-test-selector="cardList">
                {sortedAndFilteredSavedPayments.map((savedPayment, index) => (
                    <ManagedAccordionSection
                        key={savedPayment.id.toString()}
                        initialExpanded={index === 0}
                        title={
                            <StyledWrapper
                                {...styles.cardHeaderWrapper}
                                data-test-selector={`cardHeader-${savedPayment.id}`}
                            >
                                <LazyImage
                                    {...styles.cardTypeImage}
                                    src={`/images/card-types/${getImageName(savedPayment.cardType)}.png`}
                                    altText=""
                                />
                                <Typography {...styles.descriptionText}>
                                    {savedPayment.description && <>{savedPayment.description}&nbsp;&mdash;&nbsp;</>}
                                    {`${savedPayment.cardType} ${translate(
                                        "ending in",
                                    )} ${savedPayment.maskedCardNumber.substring(
                                        savedPayment.maskedCardNumber.length - 4,
                                    )}`}
                                </Typography>
                            </StyledWrapper>
                        }
                    >
                        <GridContainer {...styles.cardInfoContainer} data-test-selector={`cardBody-${savedPayment.id}`}>
                            <GridItem {...styles.leftColumnGridItem}>
                                <Typography {...styles.nameOnCardLabelText} id="nameOnCard">
                                    {translate("Name on Card")}
                                </Typography>
                                <Typography {...styles.nameOnCardText} aria-labelledby="nameOnCard">
                                    {savedPayment.cardHolderName}
                                </Typography>
                                <Typography {...styles.expirationLabelText} id="expiration">
                                    {translate("Expiration")}
                                </Typography>
                                <Typography {...styles.expirationText} aria-labelledby="expiration">
                                    {savedPayment.expirationDate}
                                </Typography>
                            </GridItem>
                            <GridItem {...styles.centerColumnGridItem}>
                                <Typography {...styles.billingAddressLabelText} id="billingAddress">
                                    {translate("Billing Address")}
                                </Typography>
                                <Typography {...styles.billingAddressText} aria-labelledby="billingAddress">
                                    {[
                                        savedPayment.address1,
                                        savedPayment.address2,
                                        savedPayment.address3,
                                        savedPayment.address4,
                                    ]
                                        .filter(o => !!o)
                                        .join(", ")}
                                    <br />
                                    {savedPayment.city}, {savedPayment.state}
                                    <br />
                                    {savedPayment.postalCode}
                                    <br />
                                    {savedPayment.country}
                                </Typography>
                            </GridItem>
                            <GridItem {...styles.rightColumnGridItem}>
                                <GridContainer {...styles.linksContainer}>
                                    <GridItem {...styles.useAsDefaultGridItem}>
                                        <Button
                                            {...styles.useAsDefaultButton}
                                            onClick={() => useAsDefaultClickHandler(savedPayment)}
                                            data-test-selector="useAsDefaultButton"
                                        >
                                            {translate("Use as Default")}
                                        </Button>
                                    </GridItem>
                                    <GridItem {...styles.editLinkGridItem}>
                                        <Link
                                            {...styles.editLink}
                                            onClick={() => editClickHandler(savedPayment)}
                                            data-test-selector="editButton"
                                        >
                                            {translate("Edit")}
                                        </Link>
                                    </GridItem>
                                    <GridItem {...styles.deleteLinkGridItem}>
                                        <Link
                                            {...styles.deleteLink}
                                            onClick={() => deleteClickHandler(savedPayment)}
                                            data-test-selector="deleteButton"
                                        >
                                            {translate("Delete")}
                                        </Link>
                                    </GridItem>
                                </GridContainer>
                            </GridItem>
                        </GridContainer>
                    </ManagedAccordionSection>
                ))}
            </Accordion>
            <TwoButtonModal
                {...styles.deleteCardModal}
                modalIsOpen={deleteCardModalIsOpen}
                headlineText={translate("Delete Card")}
                messageText={translate("Are you sure you want to delete this card?")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                onCancel={deleteCancelHandler}
                onSubmit={deleteSubmitHandler}
                submitTestSelector="submitDeleteCardButton"
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(SavedPaymentsCardList),
    definition: {
        displayName: "Card List",
        group: "Saved Payments",
        allowedContexts: [SavedPaymentsPageContext],
    },
};

export default widgetModule;
