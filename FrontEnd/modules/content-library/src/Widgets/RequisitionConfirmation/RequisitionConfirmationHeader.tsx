import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getHomePageUrl } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RequisitionConfirmationPageContext } from "@insite/content-library/Pages/RequisitionConfirmationPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    homePageUrl: getHomePageUrl(state),
});

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps>;

export interface RequisitionConfirmationHeaderStyles {
    headerGridContainer?: GridContainerProps;
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    titleText?: TypographyPresentationProps;
    titleGridItem?: GridItemProps;
    continueButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    continueClickable?: ClickableProps;
    messageGridItem?: GridItemProps;
    messageText?: TypographyPresentationProps;
}

export const requisitionConfirmationHeaderStyles: RequisitionConfirmationHeaderStyles = {
    headerGridContainer: {
        gap: 10,
        css: css`
            margin-bottom: 10px;
        `,
    },
    continueButton: {
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
    messageGridItem: {
        width: 12,
    },
};

const styles = requisitionConfirmationHeaderStyles;

const RequisitionConfirmationHeader = ({ history, homePageUrl }: Props) => {
    const continueClickHandler = () => {
        history.push(homePageUrl);
    };

    const continueLabel = translate("Continue Shopping");

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.titleText} as="h1">
                    {translate("Requisition Confirmation")}
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu {...styles.narrowOverflowMenu}>
                        <Clickable {...styles.continueClickable} onClick={continueClickHandler}>
                            {continueLabel}
                        </Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <Button {...styles.continueButton} onClick={continueClickHandler} data-test-selector="continueBtn">
                        {continueLabel}
                    </Button>
                </Hidden>
            </GridItem>
            <GridItem {...styles.messageGridItem}>
                <Typography {...styles.messageText}>{siteMessage("Requisition_Submitted")}</Typography>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(RequisitionConfirmationHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RequisitionConfirmationPageContext],
        group: "Requisition Confirmation",
    },
};

export default widgetModule;
