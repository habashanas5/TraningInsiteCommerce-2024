import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import { HasOnComplete } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import addToWishList, {
    AddToWishListParameter,
} from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    cartState: getCartState(state, state.pages.orderConfirmation.cartId),
    settingsCollection: getSettingsCollection(state),
    homePageUrl: getHomePageUrl(state),
    wishListSettings: getSettingsCollection(state).wishListSettings,
    enableVat: getSettingsCollection(state).productSettings.enableVat, // ! Check whether this one is necessary, or the other vat variable below
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

export interface OrderConfirmationHeaderStyles {
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    headerGridContainer?: GridContainerProps;
    narrowOverflowMenu?: OverflowMenuProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    continueButton?: ButtonPresentationProps;
    printButton?: ButtonPresentationProps;
    addToListButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    printClickable?: ClickableProps;
    addToListClickable?: ClickableProps;
    continueClickable?: ClickableProps;
    printListModal?: TwoButtonModalStyles;
}

export const headerStyles: OrderConfirmationHeaderStyles = {
    continueButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    printButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    addToListButton: {
        buttonType: "outline",
        variant: "secondary",
        css: css`
            margin-left: 10px;
        `,
    },
    buttonGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [2, 2, 2, 6, 6],
    },
    titleGridItem: {
        width: [10, 10, 10, 6, 6],
    },
    title: {
        variant: "h2",
        as: "p",
        css: css`
            margin: 0;

            @media print {
                font-size: 11px;
            }
        `,
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

type Props = HasHistory &
    WidgetProps &
    ReturnType<typeof mapStateToProps> & {
        setAddToListModalIsOpen: (parameter: {
            productInfos?: Omit<ProductInfo, "productDetailPath">[];
            modalIsOpen: boolean;
        }) => void;
        addToWishList: (parameter: AddToWishListParameter & HasOnComplete) => void;
    };

const styles = headerStyles;
const OrderConfirmationHeader: FC<Props> = props => {
    const { cartState } = props;
    const { history } = props;
    const { homePageUrl } = props;

    const toasterContext = React.useContext(ToasterContext);

    const printOrOpenPrintAllModal = () => {
        openPrintDialog();
    };

    if (!cartState.value) {
        return null;
    }

    const continueClickHandler = () => {
        history.push(homePageUrl);
    };

    const addToListHandler = () => {
        if (!props.wishListSettings || !props?.cartState?.value?.cartLines) {
            return;
        }

        const productInfos = props?.cartState?.value?.cartLines.map(productInfo => ({
            productId: productInfo.productId,
            qtyOrdered: productInfo.qtyOrdered,
            unitOfMeasure: productInfo.unitOfMeasure,
        })) as Omit<ProductInfo, "productDetailPath">[];

        if (!props.wishListSettings.allowMultipleWishLists) {
            props.addToWishList({
                productInfos,
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        props.setAddToListModalIsOpen({ modalIsOpen: true, productInfos });
    };

    const printLabel = translate("Print");
    const continueLabel = translate("Continue Shopping");
    const addToListLabel = translate("Add to List");

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>{siteMessage("OrderConfirmation_Success")}</Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu position="end" {...styles.narrowOverflowMenu}>
                        <Clickable {...styles.printClickable} onClick={printOrOpenPrintAllModal}>
                            {printLabel}
                        </Clickable>
                        <Clickable {...styles.addToListClickable} onClick={addToListHandler}>
                            {addToListLabel}
                        </Clickable>
                        <Clickable {...styles.continueClickable} onClick={continueClickHandler}>
                            {continueLabel}
                        </Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <Button {...styles.printButton} onClick={printOrOpenPrintAllModal}>
                        {printLabel}
                    </Button>
                    <Button {...styles.addToListButton} onClick={addToListHandler}>
                        {addToListLabel}
                    </Button>
                    <Button {...styles.continueButton} onClick={continueClickHandler}>
                        {continueLabel}
                    </Button>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(OrderConfirmationHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [OrderConfirmationPageContext],
        group: "Order Confirmation",
    },
};

export default widgetModule;
