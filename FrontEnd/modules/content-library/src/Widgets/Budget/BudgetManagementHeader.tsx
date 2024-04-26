import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setDisplayedWidgetName from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetDisplayedWidgetName";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BudgetManagementPageContext } from "@insite/content-library/Pages/BudgetManagementPage";
import Button, { ButtonProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import { IconPresentationProps } from "@insite/mobius/Icon";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    displayedWidgetName: state.pages.budgetManagement.displayedWidgetName,
});

const mapDispatchToProps = {
    setDisplayedWidgetName,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface BudgetManagementHeaderStyles {
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    overflowMenuConfigureItemHidden?: HiddenProps;
    actionOverflowIcon?: IconPresentationProps;
    actionButtonsHidden?: HiddenProps;
    titleText?: TypographyProps;
    costCodesButton?: ButtonProps;
    assignBudgetsButton?: ButtonProps;
    configureBudgetsButton?: ButtonProps;
    overflowMenu?: OverflowMenuPresentationProps;
    overflowMenuClickables?: ClickableProps;
}

export const headerStyles: BudgetManagementHeaderStyles = {
    titleGridItem: {
        width: [11, 9, 7, 5, 6],
    },
    buttonsGridItem: {
        width: [1, 3, 5, 7, 6],
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    actionButtonsHidden: {
        css: css`
            display: inline-block;
        `,
    },
    titleText: {
        variant: "h2",
        as: "h2",
    },
    costCodesButton: {
        variant: "tertiary",
        css: css`
            white-space: nowrap;
        `,
    },
    assignBudgetsButton: {
        variant: "tertiary",
        css: css`
            white-space: nowrap;
            margin-left: 10px;
        `,
    },
    configureBudgetsButton: {
        css: css`
            white-space: nowrap;
            margin-left: 10px;
        `,
    },
};

const styles = headerStyles;

const BudgetManagementHeader: React.FunctionComponent<Props> = props => {
    const clickCostCodesHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        props.setDisplayedWidgetName({ value: "CostCodes" });
    };

    const clickAssignBudgetsHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        props.setDisplayedWidgetName({ value: "AssignBudgets" });
    };

    const clickConfigureBudgetsHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        props.setDisplayedWidgetName({ value: "ConfigureBudget" });
    };

    return (
        <>
            {props.displayedWidgetName === "ReviewBudget" && (
                <GridContainer {...styles.gridContainer}>
                    <GridItem {...styles.titleGridItem}>
                        <Typography {...styles.titleText}>{translate("Budget Management")}</Typography>
                    </GridItem>
                    <GridItem {...styles.buttonsGridItem}>
                        <Hidden {...styles.actionButtonsHidden} below="lg">
                            <Button
                                {...styles.costCodesButton}
                                onClick={clickCostCodesHandler}
                                data-test-selector="costCodesButton"
                            >
                                {translate("Cost Codes")}
                            </Button>
                            <Button
                                {...styles.assignBudgetsButton}
                                onClick={clickAssignBudgetsHandler}
                                data-test-selector="assignBudgetsButton"
                            >
                                {translate("Assign Budgets")}
                            </Button>
                        </Hidden>
                        <Hidden {...styles.actionButtonsHidden} below="md">
                            <Button
                                {...styles.configureBudgetsButton}
                                onClick={clickConfigureBudgetsHandler}
                                data-test-selector="configureBudgetsButton"
                            >
                                {translate("Configure Budgets")}
                            </Button>
                        </Hidden>
                        <Hidden {...styles.actionButtonsHidden} above="md">
                            <OverflowMenu position="end" {...styles.overflowMenu}>
                                <Hidden {...styles.overflowMenuConfigureItemHidden} above="sm">
                                    <Clickable
                                        {...styles.overflowMenuClickables}
                                        onClick={clickConfigureBudgetsHandler}
                                    >
                                        {translate("Configure Budgets")}
                                    </Clickable>
                                </Hidden>
                                <Clickable {...styles.overflowMenuClickables} onClick={clickAssignBudgetsHandler}>
                                    {translate("Assign Budgets")}
                                </Clickable>
                                <Clickable {...styles.overflowMenuClickables} onClick={clickCostCodesHandler}>
                                    {translate("Cost Codes")}
                                </Clickable>
                            </OverflowMenu>
                        </Hidden>
                    </GridItem>
                </GridContainer>
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(BudgetManagementHeader),
    definition: {
        group: "BudgetManagement",
        displayName: "Header",
        allowedContexts: [BudgetManagementPageContext],
    },
};

export default widgetModule;
