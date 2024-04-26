import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import { getBillTosDataView } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import loadQuotes from "@insite/client-framework/Store/Data/Quotes/Handlers/LoadQuotes";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import clearSearch from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/ClearSearch";
import updateSearchFields from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
import Button, { ButtonProps } from "@insite/mobius/Button";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Select, { SelectProps } from "@insite/mobius/Select";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface State {
    quoteNumber: string;
    status: string;
}

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    filtersOpen: state.pages.rfqMyQuotes.filtersOpen,
    billTosDataView: getBillTosDataView(state, {}),
    accountsDataView: getAccountsDataView(state),
    quotesDataView: getQuotesDataView(state, state.pages.rfqMyQuotes.getQuotesParameter),
    getQuotesParameter: state.pages.rfqMyQuotes.getQuotesParameter,
});

const mapDispatchToProps = {
    loadBillTos,
    loadAccounts,
    updateSearchFields,
    loadQuotes,
    clearSearch,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqMyQuotesFilterStyles {
    container?: GridContainerProps;
    heading?: TypographyProps;
    headingItem?: GridItemProps;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    expireFromGridItem?: GridItemProps;
    expireFromDate?: DatePickerPresentationProps;
    expireToGridItem?: GridItemProps;
    expireToDate?: DatePickerPresentationProps;
    customerGridItem?: GridItemProps;
    customerSelect?: SelectProps;
    quoteNumberGridItem?: GridItemProps;
    quoteNumberText?: TextFieldProps;
    /**
     * @deprecated Was moved to RfqMyQuotesHeader widget. Use rfqMyQuotesHeaderStyles.statusFilterGridItem property.
     */
    statusGridItem?: GridItemProps;
    /**
     * @deprecated Was moved to RfqMyQuotesHeader widget. Use rfqMyQuotesHeaderStyles.statusSelect property.
     */
    statusSelect?: SelectProps;
    userGridItem?: GridItemProps;
    userSelect?: SelectProps;
    salesRepGridItem?: GridItemProps;
    salesRepSelect?: SelectProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonProps;
}

export const rfqMyQuotesFilterStyles: RfqMyQuotesFilterStyles = {
    container: {
        css: css`
            padding-bottom: 15px;
        `,
    },
    headingItem: {
        width: 12,
        css: css`
            padding-bottom: 0;
        `,
    },
    heading: {
        variant: "h5",
        as: "h2",
        css: css`
            margin: 0;
        `,
    },
    fromGridItem: { width: [6, 6, 3, 3, 2] },
    fromDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    toGridItem: { width: [6, 6, 3, 3, 2] },
    toDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    expireFromGridItem: { width: [6, 6, 3, 3, 2] },
    expireFromDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    expireToGridItem: { width: [6, 6, 3, 3, 2] },
    expireToDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    customerGridItem: { width: [12, 12, 6, 6, 4] },
    quoteNumberGridItem: { width: [12, 12, 6, 6, 4] },
    userGridItem: { width: [12, 12, 6, 6, 4] },
    salesRepGridItem: { width: [12, 12, 6, 6, 4] },
    appliedFiltersContainer: { css: horizontalStyles },
    buttonsItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    clearFiltersButton: {
        variant: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
};

const styles = rfqMyQuotesFilterStyles;

const tzOffset = new Date().getTimezoneOffset() * 60000;

class RfqMyQuotesFilter extends Component<Props, State> {
    updateTimeoutId: number | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            quoteNumber: "",
            status: "",
        };
    }

    componentDidMount() {
        if (!this.props.billTosDataView.value) {
            this.props.loadBillTos();
        }
        if (!this.props.accountsDataView.value) {
            this.props.loadAccounts();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.getQuotesParameter !== this.props.getQuotesParameter) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                quoteNumber: this.props.getQuotesParameter.quoteNumber || "",
                status:
                    this.props.getQuotesParameter.statuses && this.props.getQuotesParameter.statuses.length > 0
                        ? this.props.getQuotesParameter.statuses[0]
                        : "",
            });
        }
    }

    updateParameterAfterTimeout = () => {
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            this.props.updateSearchFields({
                quoteNumber: this.state.quoteNumber,
            });
        }, 250);
    };

    customerChangeHandler = (customerId: string) => {
        this.props.updateSearchFields({ customerId: customerId || "" });
    };

    userChangeHandler = (userId: string) => {
        this.props.updateSearchFields({ userId: userId || "" });
    };

    salesRepChangeHandler = (salesRepNumber: string) => {
        this.props.updateSearchFields({ salesRepNumber: salesRepNumber || "" });
    };

    quoteNumberChangeHandler = (quoteNumber: string) => {
        this.setState({
            quoteNumber,
        });

        this.updateParameterAfterTimeout();
    };

    convertDateToString = (date?: Date) => {
        return date ? new Date(date.getTime() - tzOffset).toISOString().split("T")[0] : "";
    };

    convertStringToDate = (dateStr?: string) => {
        return dateStr ? new Date(new Date(dateStr).getTime() + tzOffset) : undefined;
    };

    fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ fromDate: this.convertDateToString(selectedDay) });
    };

    toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ toDate: this.convertDateToString(selectedDay) });
    };

    expireFromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ expireFromDate: this.convertDateToString(selectedDay) });
    };

    expireToDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ expireToDate: this.convertDateToString(selectedDay) });
    };

    clearFiltersClickHandler = () => {
        this.props.clearSearch();
    };

    getCustomerLabel = (customerId: string) => {
        if (!this.props.billTosDataView.value) {
            return "";
        }

        const customer = this.props.billTosDataView.value.find(o => o.id === customerId);
        if (!customer) {
            return "";
        }

        return `${customer.customerNumber} - ${customer.customerName}`;
    };

    getUserLabel = (userId: string) => {
        if (!this.props.accountsDataView.value) {
            return "";
        }

        return this.props.accountsDataView.value.find(o => o.id === userId)?.userName || "";
    };

    getSalesRepLabel = (salesRepNumber: string) => {
        if (!this.props.quotesDataView.value || !this.props.quotesDataView.salespersonList) {
            return "";
        }

        return this.props.quotesDataView.salespersonList.find(o => o.salespersonNumber === salesRepNumber)?.name || "";
    };

    render() {
        if (!this.props.filtersOpen) {
            return (
                <StyledWrapper {...styles.appliedFiltersContainer}>
                    {this.props.getQuotesParameter.fromDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.fromDateChangeHandler({});
                            }}
                            data-test-selector="rfqMyQuotes_fromDateButton"
                        >
                            {translate("Requested From: {0}", this.props.getQuotesParameter.fromDate)}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.toDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.toDateChangeHandler({});
                            }}
                        >
                            {translate("Requested To: {0}", this.props.getQuotesParameter.toDate)}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.expireFromDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.expireFromDateChangeHandler({});
                            }}
                            data-test-selector="rfqMyQuotes_fromDateButton"
                        >
                            {translate("Expires From: {0}", this.props.getQuotesParameter.expireFromDate)}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.expireToDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.expireToDateChangeHandler({});
                            }}
                        >
                            {translate("Expires To: {0}", this.props.getQuotesParameter.expireToDate)}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.customerId && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.customerChangeHandler("");
                            }}
                        >
                            {translate(
                                "Customer: {0}",
                                this.getCustomerLabel(this.props.getQuotesParameter.customerId),
                            )}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.quoteNumber && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.quoteNumberChangeHandler("");
                            }}
                        >
                            {translate("Quote #: {0}", this.props.getQuotesParameter.quoteNumber)}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.userId && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.userChangeHandler("");
                            }}
                        >
                            {translate("User: {0}", this.getUserLabel(this.props.getQuotesParameter.userId))}
                        </Tag>
                    )}
                    {this.props.getQuotesParameter.salesRepNumber && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.salesRepChangeHandler("");
                            }}
                        >
                            {translate(
                                "Sales Rep: {0}",
                                this.getSalesRepLabel(this.props.getQuotesParameter.salesRepNumber),
                            )}
                        </Tag>
                    )}
                </StyledWrapper>
            );
        }

        const billToOptions = this.props.billTosDataView.value || [];
        const userOptions = this.props.accountsDataView.value || [];
        const salesRepOptions = this.props.quotesDataView.value ? this.props.quotesDataView.salespersonList || [] : [];
        const fromDate = this.convertStringToDate(this.props.getQuotesParameter.fromDate);
        const toDate = this.convertStringToDate(this.props.getQuotesParameter.toDate);
        const expireFromDate = this.convertStringToDate(this.props.getQuotesParameter.expireFromDate);
        const expireToDate = this.convertStringToDate(this.props.getQuotesParameter.expireToDate);

        return (
            <GridContainer {...styles.container} data-test-selector="rfqMyQuotes_filter">
                <GridItem {...styles.headingItem}>
                    <Typography {...styles.heading}>{translate("Filter")}</Typography>
                </GridItem>
                <GridItem {...styles.fromGridItem} data-test-selector="rfqMyQuotes_fromDateFilter">
                    <DatePicker
                        {...styles.fromDate}
                        label={translate("Requested From")}
                        selectedDay={fromDate}
                        onDayChange={this.fromDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            maxDate: toDate,
                            ...styles.fromDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.toGridItem} data-test-selector="rfqMyQuotes_toDateFilter">
                    <DatePicker
                        {...styles.toDate}
                        label={translate("Requested To")}
                        selectedDay={toDate}
                        onDayChange={this.toDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            minDate: fromDate,
                            ...styles.toDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.expireFromGridItem} data-test-selector="rfqMyQuotes_expireFromDateFilter">
                    <DatePicker
                        {...styles.expireFromDate}
                        label={translate("Expires From")}
                        selectedDay={expireFromDate}
                        onDayChange={this.expireFromDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            maxDate: expireToDate,
                            ...styles.expireFromDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.expireToGridItem} data-test-selector="rfqMyQuotes_expireToDateFilter">
                    <DatePicker
                        {...styles.expireToDate}
                        label={translate("Expires To")}
                        selectedDay={expireToDate}
                        onDayChange={this.expireToDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            minDate: expireFromDate,
                            ...styles.expireToDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.customerGridItem}>
                    <Select
                        {...styles.customerSelect}
                        label={translate("Customer")}
                        value={this.props.getQuotesParameter.customerId || ""}
                        onChange={event => this.customerChangeHandler(event.target.value)}
                    >
                        <option value="">{translate("Select")}</option>
                        {billToOptions.map(billTo => (
                            <option key={billTo.id} value={billTo.id}>
                                {billTo.label}
                            </option>
                        ))}
                    </Select>
                </GridItem>
                <GridItem {...styles.quoteNumberGridItem}>
                    <TextField
                        {...styles.quoteNumberText}
                        value={this.state.quoteNumber}
                        label={translate("Quote #")}
                        onChange={event => this.quoteNumberChangeHandler(event.target.value)}
                        data-test-selector="rfqMyQuotes_quoteNumberFilter"
                    />
                </GridItem>
                {this.props.session.isSalesPerson && (
                    <>
                        <GridItem {...styles.salesRepGridItem}>
                            <Select
                                {...styles.salesRepSelect}
                                label={translate("Sales Rep")}
                                value={this.props.getQuotesParameter.salesRepNumber || ""}
                                onChange={event => this.salesRepChangeHandler(event.target.value)}
                            >
                                <option value="">{translate("Select")}</option>
                                {salesRepOptions.map(salesRep => (
                                    <option key={salesRep.salespersonNumber} value={salesRep.salespersonNumber}>
                                        {salesRep.name}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>
                        <GridItem {...styles.userGridItem}>
                            <Select
                                {...styles.userSelect}
                                label={translate("User")}
                                value={this.props.getQuotesParameter.userId || ""}
                                onChange={event => this.userChangeHandler(event.target.value)}
                            >
                                <option value="">{translate("Select")}</option>
                                {userOptions.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.userName}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>
                    </>
                )}
                <GridItem {...styles.buttonsItem}>
                    <Button
                        {...styles.clearFiltersButton}
                        onClick={this.clearFiltersClickHandler}
                        data-test-selector="rfqMyQuotes_clearFiltersButton"
                    >
                        {translate("Clear Filters")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqMyQuotesFilter),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Search Results Filter",
        allowedContexts: [RfqMyQuotesPageContext],
    },
};

export default widgetModule;
