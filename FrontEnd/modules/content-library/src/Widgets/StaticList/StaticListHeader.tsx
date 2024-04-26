import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addCartLines from "@insite/client-framework/Store/Data/Carts/Handlers/AddCartLines";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { canAddWishListLineToCart } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductAddedToCartMessage from "@insite/content-library/Components/ProductAddedToCartMessage";
import { StaticListPageContext } from "@insite/content-library/Pages/StaticListPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const wishListState = getWishListState(state, state.pages.staticList.wishListId);
    const wishListLines = wishListState.value?.wishListLineCollection;
    const productInfosByWishListLineId = state.pages.staticList.productInfosByWishListLineId;
    return {
        session: getSession(state),
        wishListState,
        productInfosByWishListLineId,
        myListsDetailsPageUrl: getPageLinkByPageType(state, "MyListsDetailsPage")?.url,
        showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
        signInUrl: getPageLinkByPageType(state, "SignInPage")?.url,
        location: getLocation(state),
        canAddAllToCart: wishListLines?.every(o => canAddWishListLineToCart(o, productInfosByWishListLineId)) || false,
    };
};

const mapDispatchToProps = {
    addToWishList,
    addCartLines,
    loadCurrentCart,
};

type Props = WidgetProps &
    HasHistory &
    HasToasterContext &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps>;

export interface StaticListHeaderStyles {
    container?: GridContainerProps;
    infoGridItem?: GridItemProps;
    nameText?: TypographyPresentationProps;
    sharedByText?: TypographyPresentationProps;
    saveListGridItem?: GridItemProps;
    saveListButton?: ButtonPresentationProps;
    addListToCartGridItem?: GridItemProps;
    addListToCartButton?: ButtonPresentationProps;
    saveListModal?: ModalPresentationProps;
    signInMessageText?: TypographyPresentationProps;
    descriptionText?: TypographyPresentationProps;
    listNameTextField?: TextFieldPresentationProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    saveButton?: ButtonPresentationProps;
}

export const staticListHeaderStyles: StaticListHeaderStyles = {
    container: {
        gap: 10,
        css: css`
            padding-bottom: 10px;
            & > div {
                justify-content: space-between;
            }
        `,
    },
    infoGridItem: {
        width: [12, 12, 6, 7, 8],
        css: css`
            flex-direction: column;
        `,
    },
    nameText: {
        variant: "h1",
    },
    saveListGridItem: {
        width: [12, 12, 3, 2, 2],
        css: css`
            justify-content: flex-end;
        `,
    },
    saveListButton: {
        variant: "secondary",
        css: css`
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
    addListToCartGridItem: {
        width: [12, 12, 3, 3, 2],
    },
    addListToCartButton: {
        css: css`
            width: 100%;
        `,
    },
    saveListModal: {
        sizeVariant: "small",
    },
    listNameTextField: {
        cssOverrides: {
            formField: css`
                margin-top: 20px;
            `,
        },
    },
    buttonsWrapper: {
        css: css`
            margin-top: 20px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    saveButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const styles = staticListHeaderStyles;

const StaticListHeader = ({
    session,
    wishListState,
    productInfosByWishListLineId,
    myListsDetailsPageUrl,
    showAddToCartConfirmationDialog,
    signInUrl,
    location,
    canAddAllToCart,
    history,
    toaster,
    addToWishList,
    addCartLines,
    loadCurrentCart,
}: Props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const saveListClickHandler = () => {
        setModalIsOpen(true);
    };

    const [listName, setListName] = useState("");
    const [listNameError, setListNameError] = useState("");
    const listNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setListName(e.currentTarget.value);
        setListNameError("");
    };

    const saveListButtonClickHandler = () => {
        const wishListLines = wishListState.value?.wishListLineCollection;
        if (!wishListLines || wishListLines.length === 0) {
            return;
        }

        const productInfos = wishListLines.map(o => productInfosByWishListLineId[o.id]!);
        addToWishList({
            newListName: listName,
            productInfos,
            onSuccess: ({ id }) => {
                setModalIsOpen(false);
                if (myListsDetailsPageUrl) {
                    history.push(`${myListsDetailsPageUrl}?id=${id}`);
                }
            },
            onError: errorMessage => {
                setListNameError(errorMessage);
            },
            onComplete(resultProps) {
                if (resultProps.result?.wishList) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.result.wishList);
                } else if (resultProps.result?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(resultProps.result.errorMessage);
                }
            },
        });
    };

    const addListToCartClickHandler = () => {
        const wishListLines = wishListState.value?.wishListLineCollection;
        if (!wishListLines || wishListLines.length === 0) {
            return;
        }

        const productInfos = wishListLines.map(o => productInfosByWishListLineId[o.id]!);
        addCartLines({
            productInfos,
            onSuccess: (cartLinesCollection: CartLineCollectionModel) => {
                loadCurrentCart({ shouldLoadFullCart: true });
                if (showAddToCartConfirmationDialog) {
                    const isQtyAdjusted =
                        cartLinesCollection.cartLines?.some(cartLine => cartLine.isQtyAdjusted) ?? false;

                    toaster.addToast({
                        body: <ProductAddedToCartMessage isQtyAdjusted={isQtyAdjusted} multipleProducts={true} />,
                        messageType: "success",
                    });
                }
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.cartLines) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.apiResult);
                }
            },
        });
    };

    if (wishListState.isLoading || !wishListState.value) {
        return null;
    }

    const wishList = wishListState.value;
    const isAuthenticated = session && (session.isAuthenticated || session.rememberMe) && !session.isGuest;
    const allQtysIsValid = wishList.wishListLineCollection?.every(
        o => !!productInfosByWishListLineId[o.id] && productInfosByWishListLineId[o.id]!.qtyOrdered > 0,
    );

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.infoGridItem}>
                    <Typography {...styles.nameText} as="h1">
                        {wishList.name}
                    </Typography>
                    <Typography {...styles.sharedByText}>
                        {`${translate("Shared by")} ${wishList.sharedByDisplayName}`}
                    </Typography>
                </GridItem>
                <GridItem {...styles.saveListGridItem}>
                    <Button {...styles.saveListButton} onClick={saveListClickHandler}>
                        {translate("Save List")}
                    </Button>
                </GridItem>
                {canAddAllToCart && (
                    <GridItem {...styles.addListToCartGridItem}>
                        <Button
                            {...styles.addListToCartButton}
                            disabled={!allQtysIsValid}
                            onClick={addListToCartClickHandler}
                        >
                            {translate("Add List to Cart")}
                        </Button>
                    </GridItem>
                )}
            </GridContainer>
            <Modal
                {...styles.saveListModal}
                headline={isAuthenticated ? translate("Save List") : translate("Please Sign In")}
                isOpen={modalIsOpen}
                handleClose={modalCloseHandler}
            >
                {!isAuthenticated && (
                    <Typography {...styles.signInMessageText}>
                        {siteMessage(
                            "Lists_SignIn_Required_To_Save_List_In_Spire",
                            `${signInUrl}?returnUrl=${encodeURIComponent(location.pathname + location.search)}`,
                        )}
                    </Typography>
                )}
                {isAuthenticated && (
                    <>
                        <Typography {...styles.descriptionText}>
                            {translate("Enter a name for the new list.")}
                        </Typography>
                        <TextField
                            {...styles.listNameTextField}
                            label={translate("New List Name")}
                            labelPosition="left"
                            value={listName}
                            error={listNameError}
                            onChange={listNameChangeHandler}
                        />
                        <StyledWrapper {...styles.buttonsWrapper}>
                            <Button {...styles.cancelButton} onClick={modalCloseHandler}>
                                {translate("Cancel")}
                            </Button>
                            <Button {...styles.saveButton} onClick={saveListButtonClickHandler}>
                                {translate("Save List")}
                            </Button>
                        </StyledWrapper>
                    </>
                )}
            </Modal>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(withToaster(StaticListHeader))),
    definition: {
        group: "Static List",
        displayName: "Page Header",
        allowedContexts: [StaticListPageContext],
    },
};

export default widgetModule;
