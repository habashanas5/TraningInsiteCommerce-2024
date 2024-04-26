import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import {
    getBudgetsDataView,
    getBudgetYears,
    getYearEnd,
} from "@insite/client-framework/Store/Data/Budgets/BudgetsSelectors";
import loadReviews from "@insite/client-framework/Store/Data/Budgets/Handlers/LoadReviews";
import updateBudget from "@insite/client-framework/Store/Data/Budgets/Handlers/UpdateBudget";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { BudgetEnforcementLevel } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import {
    isSearchUserSelectDisabled,
    isShipToAddressSelectDisabled,
} from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementSelectors";
import setDisplayedWidgetName from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetDisplayedWidgetName";
import updateLoadMaintenanceInfoParameter from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/UpdateLoadMaintenanceInfoParameter";
import updateMaintenanceInfo from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/UpdateMaintenanceInfo";
import translate from "@insite/client-framework/Translate";
import { AccountModel, BudgetModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BudgetManagementPageContext } from "@insite/content-library/Pages/BudgetManagementPage";
import EnforcementLevelDisplay, {
    EnforcementLevelDisplayStyles,
} from "@insite/content-library/Widgets/Budget/EnforcementLevelDisplay";
import Button, { ButtonProps } from "@insite/mobius/Button";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Select, { SelectProps } from "@insite/mobius/Select";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import cloneDeep from "lodash/cloneDeep";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    displayedWidgetName: state.pages.budgetManagement.displayedWidgetName,
    accountsDataView: getAccountsDataView(state),
    shipTosDataView: getCurrentShipTosDataView(state),
    budgetDataView: getBudgetsDataView(state, state.pages.budgetManagement.getMaintenanceInfoParameter),
    billToState: getCurrentBillToState(state),
    getMaintenanceInfoParameter: state.pages.budgetManagement.getMaintenanceInfoParameter,
    maintenanceInfo: state.pages.budgetManagement.maintenanceInfo,
    budgetYear: state.pages.budgetManagement.getMaintenanceInfoParameter.fiscalYear,
    maintenanceUserId: state.pages.budgetManagement.getMaintenanceInfoParameter.userProfileId,
    maintenanceShipToId: state.pages.budgetManagement.getMaintenanceInfoParameter.shipToId,
    budgetYears: getBudgetYears(5),
    isSearchUserSelectDisabled: isSearchUserSelectDisabled(state),
    isShipToAddressSelectDisabled: isShipToAddressSelectDisabled(state),
});

const mapDispatchToProps = {
    setDisplayedWidgetName,
    updateLoadMaintenanceInfoParameter,
    loadReviews,
    updateBudget,
    updateMaintenanceInfo,
};

type Props = ReturnType<typeof mapStateToProps> & WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface AssignBudgetsStyles {
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonProps;
    saveButton?: ButtonProps;
    enforcementLevelGridItem?: GridItemProps;
    enforcementLevelDisplayStyles?: EnforcementLevelDisplayStyles;
    budgetYearGridItem?: GridItemProps;
    wrapper?: InjectableCss;
    budgetYearSelect?: SelectProps;
    createBudgetGridItem?: GridItemProps;
    createBudgetText?: TypographyPresentationProps;
    assignBudgetInstructionsGridItem?: GridItemProps;
    assignBudgetInstructionsText?: TypographyPresentationProps;
    filterGridItem?: GridItemProps;
    searchUserWrapper?: InjectableCss;
    searchUserSelect?: SelectProps;
    shipToAddressSelect?: SelectProps;
    tableGridItem?: GridItemProps;
    dataTable?: DataTableProps;
    periodHeader?: DataTableHeaderProps;
    endDateHeader?: DataTableHeaderProps;
    budgetAmountHeader?: DataTableHeaderProps;
    periodCells?: DataTableCellBaseProps;
    endDateCells?: DataTableCellBaseProps;
    budgetAmountCells?: DataTableCellBaseProps;
    currencySymbol?: TypographyPresentationProps;
    budgetAmountTextField?: TextFieldProps;
    buttonsHidden?: HiddenProps;
}

export const assignBudgetsStyles: AssignBudgetsStyles = {
    gridContainer: {
        gap: 0,
    },
    titleGridItem: {
        width: [12, 12, 8, 8, 8],
        css: css`
            padding: 15px;
        `,
    },
    titleText: {
        variant: "h4",
        css: css`
            margin: 0;
        `,
    },
    buttonsGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            padding: 15px;
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
    cancelButton: {
        variant: "tertiary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            width: 50%;
                        `,
                        null,
                        null,
                        null,
                    ],
                    "max",
                )}
        `,
    },
    saveButton: {
        css: css`
            margin-left: 10px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        width: 50%;
                    `,
                    css`
                        width: 50%;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    enforcementLevelGridItem: {
        width: 12,
        css: css`
            padding: 15px;
        `,
    },
    enforcementLevelDisplayStyles: {
        labelText: {
            css: css`
                margin-bottom: 0;
            `,
        },
    },
    budgetYearGridItem: {
        width: 12,
        css: css`
            padding: 15px 15px 0 15px;
        `,
    },
    wrapper: {
        css: css`
            display: inline-block;
            margin-right: 30px;
            margin-bottom: 15px;
        `,
    },
    assignBudgetInstructionsGridItem: {
        width: 12,
        css: css`
            padding: 15px;
        `,
    },
    createBudgetGridItem: {
        width: 12,
        css: css`
            padding: 15px;
        `,
    },
    filterGridItem: {
        width: 12,
        css: css`
            display: block;
            padding: 15px 15px 0 15px;
        `,
    },
    searchUserWrapper: {
        css: css`
            display: inline-block;
            margin-right: 30px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        margin-bottom: 30px;
                    `,
                    css`
                        margin-bottom: 30px;
                    `,
                    css`
                        margin-bottom: 30px;
                    `,
                    css`
                        margin-bottom: 30px;
                    `,
                    null,
                ])}
        `,
    },
    tableGridItem: {
        width: [12, 12, 12, 12, 6],
        css: css`
            padding: 15px;
        `,
    },
    currencySymbol: {
        css: css`
            margin-right: 5px;
        `,
    },
    budgetAmountTextField: {
        cssOverrides: {
            formInputWrapper: css`
                width: 150px;
            `,
            inputSelect: css`
                padding-right: 10px;
                &:focus {
                    padding-right: 10px;
                }
            `,
        },
    },
    buttonsHidden: {
        css: css`
            display: flex;
            flex-basis: 100%;
        `,
    },
};

const styles = assignBudgetsStyles;

function getEndDate(index: number, maintenanceInfo: BudgetModel) {
    const review = maintenanceInfo.budgetLineCollection![index + 1];
    if (review) {
        const date = new Date(review.startDate);
        date.setDate(date.getDate() - 1);
        return date;
    }

    return getYearEnd(maintenanceInfo.fiscalYear, maintenanceInfo.fiscalYearEndDate!);
}

const AssignBudgets = ({
    billToState,
    maintenanceUserId,
    maintenanceShipToId,
    accountsDataView,
    shipTosDataView,
    budgetDataView,
    setDisplayedWidgetName,
    displayedWidgetName,
    budgetYear,
    isSearchUserSelectDisabled,
    isShipToAddressSelectDisabled,
    updateBudget,
    budgetYears,
    loadReviews,
    updateLoadMaintenanceInfoParameter,
    getMaintenanceInfoParameter,
    updateMaintenanceInfo,
    maintenanceInfo,
}: Props) => {
    if (displayedWidgetName !== "AssignBudgets" || billToState.isLoading || !billToState.value) {
        return null;
    }

    const toasterContext = useContext(ToasterContext);

    if (!budgetDataView.isLoading && !budgetDataView.value) {
        loadReviews(getMaintenanceInfoParameter);
    }

    if (!maintenanceInfo && budgetDataView.value) {
        updateMaintenanceInfo({ value: budgetDataView.value });
    }

    const handleChange = (event: React.FormEvent<HTMLSelectElement>, selectorType: string) => {
        updateLoadMaintenanceInfoParameter({
            userProfileId: selectorType === "user" ? event.currentTarget.value : "",
            shipToId: selectorType === "shipTo" ? event.currentTarget.value : "",
            fiscalYear: getMaintenanceInfoParameter.fiscalYear,
        });
    };

    const handleCancelButtonClick = () => {
        updateMaintenanceInfo({ value: undefined });
        setDisplayedWidgetName({ value: "ReviewBudget" });
    };

    const handleSaveButtonClick = () => {
        updateBudget({
            updateBudgetApiParameter: { budget: maintenanceInfo! },
            onSuccess: onSaveSuccess,
            onComplete(resultProps) {
                if (resultProps.apiResult) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const onSaveSuccess = () => {
        updateMaintenanceInfo({ value: undefined });
        setDisplayedWidgetName({ value: "ReviewBudget" });
        toasterContext.addToast({ body: translate("Your changes were saved successfully."), messageType: "success" });
    };

    const handleBudgetYearChange = (event: React.FormEvent<HTMLSelectElement>) => {
        updateLoadMaintenanceInfoParameter({ fiscalYear: Number(event.currentTarget.value) });
    };

    const handleBudgetAmountChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value === "" ? undefined : Number(event.currentTarget.value);
        if (maintenanceInfo) {
            const currentBudget = cloneDeep(maintenanceInfo);
            currentBudget.budgetLineCollection![index].currentFiscalYearBudget = value;
            updateMaintenanceInfo({ value: currentBudget });
        }
    };

    const handleBudgetOnBlur = () => {
        if (maintenanceInfo) {
            const currentBudget = cloneDeep(maintenanceInfo);
            currentBudget.budgetLineCollection?.map(budgetLine => {
                if (!budgetLine.currentFiscalYearBudget) {
                    budgetLine.currentFiscalYearBudget = 0;
                }
            });
            updateMaintenanceInfo({ value: currentBudget });
        }
    };

    const accounts = accountsDataView.value || [];
    const shipTos = shipTosDataView.value ? shipTosDataView.value.filter(o => o.customerSequence !== "-1") : [];
    const tableRows =
        maintenanceInfo?.budgetLineCollection?.map((budgetLine, index) => {
            return {
                period: budgetLine.period,
                endDate: getEndDate(index, budgetDataView?.value!).toLocaleDateString() || "",
                budgetAmount: budgetLine.currentFiscalYearBudget,
            };
        }) || [];
    const [searchUserWrapperStyles] = useState(() => mergeToNew(styles.wrapper, styles.searchUserWrapper));
    const enforcementLevel = billToState.value.budgetEnforcementLevel as keyof typeof BudgetEnforcementLevel;

    return (
        <>
            <GridContainer {...styles.gridContainer}>
                <GridItem {...styles.titleGridItem}>
                    <Typography as="h2" {...styles.titleText}>
                        {translate("Assign Budgets")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    <Button {...styles.cancelButton} onClick={handleCancelButtonClick}>
                        {translate("Cancel")}
                    </Button>
                    <Button
                        {...styles.saveButton}
                        disabled={!maintenanceInfo?.fiscalYear}
                        onClick={handleSaveButtonClick}
                        data-test-selector="saveAssignedBudgetsButton"
                    >
                        {translate("Save")}
                    </Button>
                </GridItem>
                <GridItem {...styles.enforcementLevelGridItem}>
                    <EnforcementLevelDisplay
                        enforcementLevel={BudgetEnforcementLevel[enforcementLevel]}
                        extendedStyles={styles.enforcementLevelDisplayStyles}
                    ></EnforcementLevelDisplay>
                </GridItem>
                <GridItem {...styles.budgetYearGridItem}>
                    <StyledWrapper {...styles.wrapper}>
                        <Select
                            label={translate("Select Budget Year")}
                            {...styles.budgetYearSelect}
                            value={budgetYear}
                            onChange={handleBudgetYearChange}
                            data-test-selector="assignBudgetYearSelector"
                        >
                            {budgetYears.map((budgetYear: number) => (
                                <option key={budgetYear} value={budgetYear}>
                                    {budgetYear}
                                </option>
                            ))}
                        </Select>
                    </StyledWrapper>
                </GridItem>
                {!maintenanceInfo?.fiscalYear && !budgetDataView.isLoading && (
                    <GridItem {...styles.createBudgetGridItem}>
                        <Typography {...styles.createBudgetText}>
                            {siteMessage("Budget_CreateBudgetForLevel")}
                        </Typography>
                    </GridItem>
                )}
                {maintenanceInfo?.fiscalYear && (
                    <>
                        <GridItem {...styles.assignBudgetInstructionsGridItem}>
                            <Typography {...styles.assignBudgetInstructionsText}>
                                {siteMessage("Budgets_AssignBudgetsInstructions")}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.filterGridItem}>
                            <StyledWrapper {...searchUserWrapperStyles}>
                                <Select
                                    label={translate("Search User")}
                                    {...styles.searchUserSelect}
                                    value={maintenanceUserId}
                                    disabled={isSearchUserSelectDisabled}
                                    onChange={(event: React.FormEvent<HTMLSelectElement>) =>
                                        handleChange(event, "user")
                                    }
                                    data-test-selector="assignBudgetUserSelector"
                                >
                                    <option value="">{translate("Select User")}</option>
                                    {accounts.map((account: AccountModel) => (
                                        <option key={account.id} value={account.id}>
                                            {account.userName}
                                        </option>
                                    ))}
                                </Select>
                            </StyledWrapper>
                            <StyledWrapper {...styles.wrapper}>
                                <Select
                                    label={translate("Select Ship To Address")}
                                    {...styles.shipToAddressSelect}
                                    value={maintenanceShipToId}
                                    disabled={isShipToAddressSelectDisabled}
                                    onChange={(event: React.FormEvent<HTMLSelectElement>) =>
                                        handleChange(event, "shipTo")
                                    }
                                >
                                    <option value="">{translate("Select Ship To")}</option>
                                    {shipTos.map((shipTo: ShipToModel) => (
                                        <option key={shipTo.id.toString()} value={shipTo.id.toString()}>
                                            {shipTo.label}
                                        </option>
                                    ))}
                                </Select>
                            </StyledWrapper>
                        </GridItem>
                        <GridItem {...styles.tableGridItem}>
                            {!budgetDataView.isLoading && tableRows.length > 0 && (
                                <DataTable {...styles.dataTable}>
                                    <DataTableHead>
                                        <DataTableHeader {...styles.periodHeader}>
                                            {translate("Period")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.endDateHeader}>
                                            {translate("End Date")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.budgetAmountHeader}>
                                            {translate("Budget Amount")}
                                        </DataTableHeader>
                                    </DataTableHead>
                                    <DataTableBody>
                                        {tableRows.map(({ period, endDate, budgetAmount }, index) => (
                                            <DataTableRow key={period} data-test-selector="assignBudgetsPeriodRow">
                                                <DataTableCell {...styles.periodCells}>{period}</DataTableCell>
                                                <DataTableCell {...styles.endDateCells}>{endDate}</DataTableCell>
                                                <DataTableCell {...styles.budgetAmountCells}>
                                                    <Typography {...styles.currencySymbol}>
                                                        {billToState.value.customerCurrencySymbol}
                                                    </Typography>
                                                    <TextField
                                                        type="number"
                                                        defaultValue="0"
                                                        value={budgetAmount}
                                                        {...styles.budgetAmountTextField}
                                                        data-test-selector={`budgetAmountField_${index}`}
                                                        onChange={event => handleBudgetAmountChange(index, event)}
                                                        onBlur={handleBudgetOnBlur}
                                                    />
                                                </DataTableCell>
                                            </DataTableRow>
                                        ))}
                                    </DataTableBody>
                                </DataTable>
                            )}
                        </GridItem>
                    </>
                )}
                <GridItem {...styles.buttonsGridItem}>
                    <Hidden {...styles.buttonsHidden} above="sm">
                        <Button {...styles.cancelButton} onClick={handleCancelButtonClick}>
                            {translate("Cancel")}
                        </Button>
                        <Button
                            {...styles.saveButton}
                            disabled={!maintenanceInfo?.fiscalYear}
                            onClick={handleSaveButtonClick}
                        >
                            {translate("Save")}
                        </Button>
                    </Hidden>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AssignBudgets),
    definition: {
        group: "BudgetManagement",
        allowedContexts: [BudgetManagementPageContext],
    },
};

export default widgetModule;
