import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getRequisitionsDataView } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsSelectors";
import addLinesToCart from "@insite/client-framework/Store/Pages/Requisitions/Handlers/AddLinesToCart";
import translate from "@insite/client-framework/Translate";
import { CartLineCollectionModel, CartLineModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RequisitionsPageContext } from "@insite/content-library/Pages/RequisitionsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    requisitionsDataView: getRequisitionsDataView(state, state.pages.requisitions.getRequisitionsParameter),
    selectedRequisitionIds: state.pages.requisitions.selectedRequisitionIds,
    showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
});

const mapDispatchToProps = {
    addLinesToCart,
};

type Props = WidgetProps &
    HasToasterContext &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps>;

export interface RequisitionsHeaderStyles {
    headerGridContainer?: GridContainerProps;
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    titleText?: TypographyPresentationProps;
    titleGridItem?: GridItemProps;
    approveButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    approveClickable?: ClickableProps;
}

export const requisitionsHeaderStyles: RequisitionsHeaderStyles = {
    headerGridContainer: {
        gap: 10,
    },
    approveButton: {
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
    titleText: {
        variant: "h3",
        css: css`
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

const styles = requisitionsHeaderStyles;

const RequisitionsHeader = ({
    requisitionsDataView,
    selectedRequisitionIds,
    showAddToCartConfirmationDialog,
    toaster,
    addLinesToCart,
}: Props) => {
    const approveClickHandler = () => {
        if (!requisitionsDataView.value) {
            return;
        }

        const cartLines: CartLineModel[] = [];
        selectedRequisitionIds.forEach((requisitionId: string) => {
            const requisition = requisitionsDataView.value?.find(o => o.id === requisitionId);
            requisition && cartLines.push(requisition);
        });

        if (cartLines.length === 0) {
            return;
        }

        addLinesToCart({
            apiParameter: {
                cartId: API_URL_CURRENT_FRAGMENT,
                cartLineCollection: { cartLines } as CartLineCollectionModel,
            },
            onSuccess: () => {
                if (showAddToCartConfirmationDialog) {
                    toaster.addToast({ body: siteMessage("Cart_AllProductsAddedToCart"), messageType: "success" });
                }
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

    const approveLabel = translate("Approve Selected");
    const hasSelected = selectedRequisitionIds.some(
        (requisitionId: string) => !!requisitionsDataView.value?.find(o => o.id === requisitionId),
    );

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.titleText} as="h1">
                    {translate("Requisitions")}
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu {...styles.narrowOverflowMenu}>
                        <Clickable {...styles.approveClickable} disabled={!hasSelected} onClick={approveClickHandler}>
                            {approveLabel}
                        </Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <Button {...styles.approveButton} disabled={!hasSelected} onClick={approveClickHandler}>
                        {approveLabel}
                    </Button>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(RequisitionsHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RequisitionsPageContext],
        group: "Requisitions",
    },
};

export default widgetModule;
