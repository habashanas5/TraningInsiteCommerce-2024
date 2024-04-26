import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadInvoices from "@insite/client-framework/Store/Data/Invoices/Handlers/LoadInvoices";
import loadCurrentShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import clearSearch from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/ClearSearch";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import Button, { ButtonProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Select, { SelectProps } from "@insite/mobius/Select";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showShipTo = "showShipTo",
    showInvoiceNumber = "showInvoiceNumber",
    showOrderNumber = "showOrderNumber",
    showPoNumber = "showPoNumber",
    showDateRange = "showDateRange",
    showStatus = "showStatus",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showShipTo]: boolean;
        [fields.showInvoiceNumber]: boolean;
        [fields.showOrderNumber]: boolean;
        [fields.showPoNumber]: boolean;
        [fields.showDateRange]: boolean;
        [fields.showStatus]: boolean;
    };
}

interface State {
    invoiceNumber: string;
    orderNumber: string;
    poNumber: string;
}

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.invoiceHistory.filtersOpen,
    currentShipTosDataView: getCurrentShipTosDataView(state),
    getInvoicesParameter: state.pages.invoiceHistory.getInvoicesParameter,
});

const mapDispatchToProps = {
    loadCurrentShipTos,
    updateSearchFields,
    loadInvoices,
    clearSearch,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryFilterStyles {
    container?: GridContainerProps;
    heading?: TypographyProps;
    headingItem?: GridItemProps;
    shipToGridItem?: GridItemProps;
    shipToSelect?: SelectProps;
    invoiceNumberGridItem?: GridItemProps;
    invoiceNumberText?: TextFieldProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberText?: TextFieldProps;
    poNumberGridItem?: GridItemProps;
    poNumberText?: TextFieldProps;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    onlyOpenGridItem?: GridItemProps;
    onlyOpenCheckbox?: CheckboxProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonProps;
}

export const filterStyles: InvoiceHistoryFilterStyles = {
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
    shipToGridItem: { width: [12, 12, 6, 6, 4] },
    invoiceNumberGridItem: { width: [12, 12, 3, 3, 3] },
    orderNumberGridItem: { width: [12, 12, 3, 3, 3] },
    poNumberGridItem: { width: [12, 12, 3, 3, 2] },
    fromGridItem: { width: [6, 6, 3, 3, 2] },
    toGridItem: { width: [6, 6, 3, 3, 2] },
    onlyOpenGridItem: {
        width: 12,
        align: "bottom",
        css: css`
            padding-top: 0;
        `,
    },
    onlyOpenCheckbox: {
        typographyProps: {
            css: css`
                font-weight: 600;
            `,
        },
    },
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
    toDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
    fromDate: {
        cssOverrides: {
            formField: css`
                width: 100%;
            `,
        },
    },
};

const styles = filterStyles;
const tzOffset = new Date().getTimezoneOffset() * 60000;
class InvoiceHistoryFilter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            invoiceNumber: this.getValue(props, "invoiceNumber"),
            orderNumber: this.getValue(props, "orderNumber"),
            poNumber: this.getValue(props, "poNumber"),
        };
    }

    updateTimeoutId: number | undefined;

    getValue = (props: Props, key: "orderNumber" | "invoiceNumber" | "poNumber"): string => {
        let value = props.getInvoicesParameter[key] as string;
        if (!value) {
            value = "";
        }
        return value;
    };

    componentDidMount() {
        if (!this.props.currentShipTosDataView.value) {
            this.props.loadCurrentShipTos();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const previousOrderNumber = this.getValue(prevProps, "orderNumber");
        const currentOrderNumber = this.getValue(this.props, "orderNumber");
        const previousInvoiceNumber = this.getValue(prevProps, "invoiceNumber");
        const currentInvoiceNumber = this.getValue(this.props, "invoiceNumber");
        const previousPoNumber = this.getValue(prevProps, "poNumber");
        const currentPoNumber = this.getValue(this.props, "poNumber");

        if (
            (previousOrderNumber !== currentOrderNumber && currentOrderNumber !== this.state.orderNumber) ||
            (previousPoNumber !== currentPoNumber && currentPoNumber !== this.state.poNumber) ||
            (previousInvoiceNumber !== currentInvoiceNumber && currentInvoiceNumber !== this.state.invoiceNumber)
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                invoiceNumber: currentInvoiceNumber,
                orderNumber: currentOrderNumber,
                poNumber: currentOrderNumber,
            });
        }
    }

    updateParameterAfterTimeout = () => {
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            this.props.updateSearchFields({
                invoiceNumber: this.state.invoiceNumber,
                orderNumber: this.state.orderNumber,
                poNumber: this.state.poNumber,
            });
        }, 250);
    };

    shipToChangeHandler = (customerSequence: string) => {
        this.props.updateSearchFields({ customerSequence: customerSequence || "" });
    };

    invoiceNumberChangeHandler = (invoiceNumber: string) => {
        this.setState({
            invoiceNumber,
        });

        this.updateParameterAfterTimeout();
    };

    orderNumberChangeHandler = (orderNumber: string) => {
        this.setState({
            orderNumber,
        });

        this.updateParameterAfterTimeout();
    };

    poNumberChangeHandler = (poNumber: string) => {
        this.setState({
            poNumber,
        });

        this.updateParameterAfterTimeout();
    };

    fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({
            fromDate: selectedDay ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0] : "",
        });
    };

    toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({
            toDate: selectedDay ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0] : "",
        });
    };

    showOpenOnlyChangeHandler = (showOpenOnly: boolean) => {
        this.props.updateSearchFields({ showOpenOnly: showOpenOnly || false });
    };

    clearFiltersClickHandler = () => {
        this.props.clearSearch();
    };

    render() {
        if (!this.props.filtersOpen) {
            return (
                <StyledWrapper {...styles.appliedFiltersContainer}>
                    {this.props.getInvoicesParameter.customerSequence &&
                        this.props.getInvoicesParameter.customerSequence !== "-1" && (
                            <Tag
                                {...styles.appliedFilterTag}
                                onDelete={() => {
                                    this.shipToChangeHandler("-1");
                                }}
                            >
                                {`${translate("Ship To")}: ${this.props.getInvoicesParameter.customerSequence}`}
                            </Tag>
                        )}
                    {this.props.getInvoicesParameter.invoiceNumber && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.invoiceNumberChangeHandler("");
                            }}
                        >
                            {`${translate("Invoice #")}: ${this.props.getInvoicesParameter.invoiceNumber}`}
                        </Tag>
                    )}
                    {this.props.getInvoicesParameter.orderNumber && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.orderNumberChangeHandler("");
                            }}
                        >
                            {`${translate("Order #")}: ${this.props.getInvoicesParameter.orderNumber}`}
                        </Tag>
                    )}
                    {this.props.getInvoicesParameter.poNumber && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.poNumberChangeHandler("");
                            }}
                        >
                            {`${translate("PO #")}: ${this.props.getInvoicesParameter.poNumber}`}
                        </Tag>
                    )}
                    {this.props.getInvoicesParameter.fromDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.fromDateChangeHandler({});
                            }}
                            data-test-selector="invoiceHistory_fromDateButton"
                        >
                            {`${translate("From")}: ${this.props.getInvoicesParameter.fromDate}`}
                        </Tag>
                    )}
                    {this.props.getInvoicesParameter.toDate && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.toDateChangeHandler({});
                            }}
                        >
                            {`${translate("To")}: ${this.props.getInvoicesParameter.toDate}`}
                        </Tag>
                    )}
                    {this.props.getInvoicesParameter.showOpenOnly && (
                        <Tag
                            {...styles.appliedFilterTag}
                            onDelete={() => {
                                this.showOpenOnlyChangeHandler(false);
                            }}
                        >
                            {translate("Only open")}
                        </Tag>
                    )}
                </StyledWrapper>
            );
        }

        const shipToOptions = this.props.currentShipTosDataView.value || [];
        const fromDate = this.props.getInvoicesParameter.fromDate
            ? new Date(this.props.getInvoicesParameter.fromDate.replace(/-/g, "/"))
            : undefined;
        const toDate = this.props.getInvoicesParameter.toDate
            ? new Date(this.props.getInvoicesParameter.toDate.replace(/-/g, "/"))
            : undefined;

        return (
            <GridContainer {...styles.container}>
                <GridItem {...styles.headingItem}>
                    <Typography {...styles.heading}>{translate("Filter")}</Typography>
                </GridItem>
                {this.props.fields.showShipTo && (
                    <GridItem {...styles.shipToGridItem}>
                        <Select
                            {...styles.shipToSelect}
                            label={translate("Ship To")}
                            value={this.props.getInvoicesParameter.customerSequence}
                            onChange={event => this.shipToChangeHandler(event.target.value)}
                            data-test-selector="invoiceHistory_invoiceShipToFilter"
                        >
                            {shipToOptions.map(shipTo => (
                                <option key={shipTo.customerSequence} value={shipTo.customerSequence}>
                                    {shipTo.label}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                )}
                {this.props.fields.showInvoiceNumber && (
                    <GridItem {...styles.invoiceNumberGridItem}>
                        <TextField
                            {...styles.invoiceNumberText}
                            value={this.state.invoiceNumber}
                            label={translate("Invoice #")}
                            onChange={event => this.invoiceNumberChangeHandler(event.target.value)}
                            data-test-selector="invoiceHistory_invoiceNumberFilter"
                        />
                    </GridItem>
                )}
                {this.props.fields.showOrderNumber && (
                    <GridItem {...styles.orderNumberGridItem}>
                        <TextField
                            {...styles.orderNumberText}
                            value={this.state.orderNumber}
                            label={translate("Order #")}
                            onChange={event => this.orderNumberChangeHandler(event.target.value)}
                            data-test-selector="invoiceHistory_erpOrderNumberFilter"
                        />
                    </GridItem>
                )}
                {this.props.fields.showPoNumber && (
                    <GridItem {...styles.poNumberGridItem}>
                        <TextField
                            {...styles.poNumberText}
                            value={this.state.poNumber}
                            label={translate("PO #")}
                            onChange={event => this.poNumberChangeHandler(event.target.value)}
                            data-test-selector="invoiceHistory_poNumberFilter"
                        />
                    </GridItem>
                )}
                {this.props.fields.showDateRange && (
                    <>
                        <GridItem {...styles.fromGridItem} data-test-selector="invoiceHistory_fromDateFilter">
                            <DatePicker
                                {...styles.fromDate}
                                label={translate("From")}
                                selectedDay={fromDate}
                                onDayChange={this.fromDateChangeHandler}
                                dateTimePickerProps={{
                                    clearIcon: null,
                                    maxDate: toDate,
                                    ...styles.fromDate?.dateTimePickerProps,
                                }}
                            />
                        </GridItem>
                        <GridItem {...styles.toGridItem} data-test-selector="invoiceHistory_toDateFilter">
                            <DatePicker
                                {...styles.toDate}
                                label={translate("To")}
                                selectedDay={toDate}
                                onDayChange={this.toDateChangeHandler}
                                dateTimePickerProps={{
                                    clearIcon: null,
                                    minDate: fromDate,
                                    ...styles.toDate?.dateTimePickerProps,
                                }}
                            />
                        </GridItem>
                    </>
                )}
                {this.props.fields.showStatus && (
                    <GridItem {...styles.onlyOpenGridItem}>
                        <Checkbox
                            {...styles.onlyOpenCheckbox}
                            checked={this.props.getInvoicesParameter.showOpenOnly}
                            onChange={(_, value) => {
                                this.showOpenOnlyChangeHandler(value);
                            }}
                            data-test-selector="invoiceHistory_showOpenInvoicesFilter"
                        >
                            {translate("Show only open invoices")}
                        </Checkbox>
                    </GridItem>
                )}
                <GridItem {...styles.buttonsItem}>
                    <Button
                        {...styles.clearFiltersButton}
                        onClick={this.clearFiltersClickHandler}
                        data-test-selector="invoiceHistory_clearFiltersButton"
                    >
                        {translate("Clear Filters")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryFilter),
    definition: {
        group: "Invoice History",
        displayName: "Search Results Filter",
        allowedContexts: [InvoiceHistoryPageContext],
        fieldDefinitions: [
            {
                name: fields.showShipTo,
                displayName: "Ship to Address",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showInvoiceNumber,
                displayName: "Invoice #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.showOrderNumber,
                displayName: "Order #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.showPoNumber,
                displayName: "PO #",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.showDateRange,
                displayName: "Date Range",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.showStatus,
                displayName: "Status",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 6,
            },
        ],
    },
};

export default widgetModule;
