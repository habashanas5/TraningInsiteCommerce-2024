import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";

import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getBudgetCalendarsDataView } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsSelectors";
import { getBudgetsDataView, getBudgetYears } from "@insite/client-framework/Store/Data/Budgets/BudgetsSelectors";
import loadReviews from "@insite/client-framework/Store/Data/Budgets/Handlers/LoadReviews";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { BudgetEnforcementLevel } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import {
    isSearchUserSelectDisabled,
    isShipToAddressSelectDisabled,
} from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementSelectors";
import updateLoadParameter from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/UpdateLoadParameter";
import translate from "@insite/client-framework/Translate";
import { AccountModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BudgetManagementPageContext } from "@insite/content-library/Pages/BudgetManagementPage";
import EnforcementLevelDisplay, {
    EnforcementLevelDisplayStyles,
} from "@insite/content-library/Widgets/Budget/EnforcementLevelDisplay";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import DollarSign from "@insite/mobius/Icons/DollarSign";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Select, { SelectProps } from "@insite/mobius/Select";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface State {
    budgetYears: number[];
}

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state),
    shipTosDataView: getCurrentShipTosDataView(state),
    budgetDataView: getBudgetsDataView(state, state.pages.budgetManagement.getBudgetParameter),
    billToState: getCurrentBillToState(state),
    budgetCalendarsDataView: getBudgetCalendarsDataView(state),
    getBudgetParameter: state.pages.budgetManagement.getBudgetParameter,
    displayedWidgetName: state.pages.budgetManagement.displayedWidgetName,
    isSearchUserSelectDisabled: isSearchUserSelectDisabled(state),
    isShipToAddressSelectDisabled: isShipToAddressSelectDisabled(state),
    language: state.context.session.language,
});

const mapDispatchToProps = {
    loadReviews,
    updateLoadParameter,
};

type Props = ReturnType<typeof mapStateToProps> & WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface ReviewBudgetStyles {
    filterWrapper?: InjectableCss;
    notConfiguredMessageWrapper?: InjectableCss;
    wrapper?: InjectableCss;
    titleText?: TypographyProps;
    select?: SelectProps;
    enforcementLevelDisplayStyles?: EnforcementLevelDisplayStyles;
    dataTable?: DataTableProps;
    periodHeader?: DataTableHeaderProps;
    startDateHeader?: DataTableHeaderProps;
    currentFiscalYearBudgetHeader?: DataTableHeaderProps;
    currentFiscalYearActualHeader?: DataTableHeaderProps;
    currentFiscalYearVarianceHeader?: DataTableHeaderProps;
    lastFiscalYearActualHeader?: DataTableHeaderProps;
    lastFiscalYearVarianceHeader?: DataTableHeaderProps;
    periodCells?: DataTableCellBaseProps;
    startDateCells?: DataTableCellBaseProps;
    currentFiscalYearBudgetCells?: DataTableCellBaseProps;
    currentFiscalYearActualCells?: DataTableCellBaseProps;
    currentFiscalYearVarianceCells?: DataTableCellBaseProps;
    lastFiscalYearActualCells?: DataTableCellBaseProps;
    lastFiscalYearVarianceCells?: DataTableCellBaseProps;
    noResultsText?: TypographyProps;
    notConfiguredMessageText?: TypographyProps;
    notConfiguredMessageIcon?: IconPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    tableContainer?: InjectableCss;
}

export const reviewBudgetStyles: ReviewBudgetStyles = {
    filterWrapper: {
        css: css`
            margin: 25px 0 15px 0;
        `,
    },
    notConfiguredMessageWrapper: {
        css: css`
            text-align: center;
            margin-top: 85px;
        `,
    },
    wrapper: {
        css: css`
            display: inline-block;
            margin: 0 30px 15px 0;
        `,
    },
    notConfiguredMessageIcon: {
        size: 45,
        color: "text.link",
        css: css`
            margin-bottom: 15px;
        `,
    },
    noResultsText: {
        as: "h3",
        variant: "h6",
        css: css`
            display: block;
            margin: auto;
        `,
    },
    titleText: {
        as: "h2",
        variant: "h4",
    },
    notConfiguredMessageText: {
        variant: "h4",
    },
    centeringWrapper: {
        css: css`
            height: 150px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    tableContainer: {
        css: css`
            overflow: auto;
        `,
    },
};

const styles = reviewBudgetStyles;

class ReviewBudget extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        const budgetYears = getBudgetYears(5);
        this.state = {
            budgetYears,
        };
        this.props.updateLoadParameter({ fiscalYear: budgetYears[0], fullGrid: true });
    }

    getAccounts = () => {
        return this.props.accountsDataView.value || [];
    };

    getShipTos = () => {
        return this.props.shipTosDataView.value
            ? this.props.shipTosDataView.value.filter(o => o.customerSequence !== "-1")
            : [];
    };

    handleBudgetYearChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const param = { fiscalYear: Number(event.currentTarget.value), fullGrid: true };
        this.props.updateLoadParameter(param);
    };

    handleChange = (event: React.FormEvent<HTMLSelectElement>, selectorType: string) => {
        const param = {
            userProfileId: selectorType === "user" ? event.currentTarget.value : "",
            shipToId: selectorType === "shipTo" ? event.currentTarget.value : "",
            fullGrid: true,
            fiscalYear: this.props.getBudgetParameter.fiscalYear,
        };

        this.props.updateLoadParameter(param);
    };

    render() {
        if (this.props.displayedWidgetName !== "ReviewBudget") {
            return null;
        }

        const { budgetCalendarsDataView, billToState, budgetDataView, getBudgetParameter } = this.props;

        if (!budgetDataView.isLoading && !budgetDataView.value) {
            this.props.loadReviews(getBudgetParameter);
        }

        const accounts = this.getAccounts();
        const shipTos = this.getShipTos();
        const enforcementLevel = !billToState?.isLoading ? billToState.value?.budgetEnforcementLevel || "" : "";
        const rows =
            budgetDataView?.value?.budgetLineCollection?.map(budgetLine => {
                return {
                    period: budgetLine.period,
                    startDate: budgetLine.startDate
                        ? getLocalizedDateTime({
                              dateTime: new Date(budgetLine.startDate),
                              language: this.props.language,
                          })
                        : "",
                    currentFiscalYearBudgetDisplay: budgetLine.currentFiscalYearBudgetDisplay,
                    currentFiscalYearActualDisplay: budgetLine.currentFiscalYearActualDisplay,
                    currentFiscalYearVarianceDisplay: budgetLine.currentFiscalYearVarianceDisplay,
                    lastFiscalYearActualDisplay: budgetLine.lastFiscalYearActualDisplay,
                    lastFiscalYearVarianceDisplay: budgetLine.lastFiscalYearVarianceDisplay,
                };
            }) || [];

        return (
            <>
                <Typography {...styles.titleText}>{translate("Review Budgets")}</Typography>
                {!budgetCalendarsDataView.isLoading && budgetCalendarsDataView.value?.length === 0 ? (
                    <StyledWrapper {...styles.notConfiguredMessageWrapper}>
                        <Icon {...styles.notConfiguredMessageIcon} src={DollarSign} />
                        <Typography {...styles.notConfiguredMessageText}>
                            {translate("Budget Not Configured")}
                        </Typography>
                    </StyledWrapper>
                ) : (
                    <>
                        <EnforcementLevelDisplay
                            enforcementLevel={
                                BudgetEnforcementLevel[enforcementLevel as keyof typeof BudgetEnforcementLevel]
                            }
                            extendedStyles={styles.enforcementLevelDisplayStyles}
                        ></EnforcementLevelDisplay>
                        <StyledWrapper {...styles.filterWrapper}>
                            <StyledWrapper {...styles.wrapper}>
                                <Select
                                    label={translate("Select Budget Year")}
                                    {...styles.select}
                                    value={getBudgetParameter.fiscalYear}
                                    onChange={this.handleBudgetYearChange}
                                    data-test-selector="reviewBudgetYearSelector"
                                >
                                    {this.state.budgetYears.map((budgetYear: number) => (
                                        <option key={budgetYear} value={budgetYear}>
                                            {budgetYear}
                                        </option>
                                    ))}
                                </Select>
                            </StyledWrapper>
                            <StyledWrapper {...styles.wrapper}>
                                <Select
                                    label={translate("Search User")}
                                    {...styles.select}
                                    value={getBudgetParameter.userProfileId}
                                    disabled={this.props.isSearchUserSelectDisabled}
                                    onChange={(event: React.FormEvent<HTMLSelectElement>) =>
                                        this.handleChange(event, "user")
                                    }
                                    data-test-selector="reviewBudgetUserSelector"
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
                                    {...styles.select}
                                    value={getBudgetParameter.shipToId}
                                    disabled={this.props.isShipToAddressSelectDisabled}
                                    onChange={(event: React.FormEvent<HTMLSelectElement>) =>
                                        this.handleChange(event, "shipTo")
                                    }
                                    data-test-selector="shipToSelector"
                                >
                                    <option value="">{translate("Select Ship To")}</option>
                                    {shipTos.map((shipTo: ShipToModel) => (
                                        <option key={shipTo.id.toString()} value={shipTo.id.toString()}>
                                            {shipTo.label}
                                        </option>
                                    ))}
                                </Select>
                            </StyledWrapper>
                        </StyledWrapper>
                        {budgetDataView.isLoading && (
                            <StyledWrapper {...styles.centeringWrapper}>
                                <LoadingSpinner {...styles.spinner} />
                            </StyledWrapper>
                        )}
                        {!budgetDataView.isLoading && rows.length === 0 && (
                            <StyledWrapper {...styles.centeringWrapper}>
                                <Typography {...styles.noResultsText}>
                                    {siteMessage("Budget_CreateBudgetForLevel")}
                                </Typography>
                            </StyledWrapper>
                        )}
                        {!budgetDataView.isLoading && rows.length > 0 && (
                            <StyledWrapper {...styles.tableContainer}>
                                <DataTable {...styles.dataTable}>
                                    <DataTableHead>
                                        <DataTableHeader {...styles.periodHeader}>
                                            {translate("Period")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.startDateHeader}>
                                            {translate("Start Date")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.currentFiscalYearBudgetHeader}>
                                            {translate("Budget")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.currentFiscalYearActualHeader}>
                                            {translate("Current Fiscal Year")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.currentFiscalYearVarianceHeader}>
                                            {translate("Variance")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.lastFiscalYearActualHeader}>
                                            {translate("Last Fiscal Year")}
                                        </DataTableHeader>
                                        <DataTableHeader {...styles.lastFiscalYearVarianceHeader}>
                                            {translate("Variance")}
                                        </DataTableHeader>
                                    </DataTableHead>
                                    <DataTableBody>
                                        {rows.map(
                                            ({
                                                period,
                                                startDate,
                                                currentFiscalYearBudgetDisplay,
                                                currentFiscalYearActualDisplay,
                                                currentFiscalYearVarianceDisplay,
                                                lastFiscalYearActualDisplay,
                                                lastFiscalYearVarianceDisplay,
                                            }) => (
                                                <DataTableRow key={period} data-test-selector="reviewBudgetPeriodRow">
                                                    <DataTableCell {...styles.periodCells}>{period}</DataTableCell>
                                                    <DataTableCell {...styles.startDateCells}>
                                                        {startDate}
                                                    </DataTableCell>
                                                    <DataTableCell
                                                        {...styles.currentFiscalYearBudgetCells}
                                                        data-test-selector={`budgetAmount_${period - 1}`}
                                                    >
                                                        {currentFiscalYearBudgetDisplay}
                                                    </DataTableCell>
                                                    <DataTableCell {...styles.currentFiscalYearActualCells}>
                                                        {currentFiscalYearActualDisplay}
                                                    </DataTableCell>
                                                    <DataTableCell {...styles.currentFiscalYearVarianceCells}>
                                                        {currentFiscalYearVarianceDisplay}
                                                    </DataTableCell>
                                                    <DataTableCell {...styles.lastFiscalYearActualCells}>
                                                        {lastFiscalYearActualDisplay}
                                                    </DataTableCell>
                                                    <DataTableCell {...styles.lastFiscalYearVarianceCells}>
                                                        {lastFiscalYearVarianceDisplay}
                                                    </DataTableCell>
                                                </DataTableRow>
                                            ),
                                        )}
                                    </DataTableBody>
                                </DataTable>
                            </StyledWrapper>
                        )}
                    </>
                )}
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ReviewBudget),
    definition: {
        group: "BudgetManagement",
        allowedContexts: [BudgetManagementPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
