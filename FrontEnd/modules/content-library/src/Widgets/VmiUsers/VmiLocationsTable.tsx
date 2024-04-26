import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    getVmiLocationsDataView,
    isVmiAdmin,
} from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import VmiLocationDetailTypeLink from "@insite/content-library/Components/VmiLocationDetailTypeLink";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    getVmiLocationsParameter: GetVmiLocationsApiParameter;
    selectedVmiLocations: SafeDictionary<boolean>;
    updateSearchFields: (parameter: GetVmiLocationsApiParameter) => void;
    toggleLocations: (ids: string[]) => void;
    extendedStyles?: VmiLocationsTableStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        parameter: ownProps.getVmiLocationsParameter,
        vmiLocationsDataView: getVmiLocationsDataView(state, ownProps.getVmiLocationsParameter),
        showAddToCartConfirmationDialog: settings.productSettings.showAddToCartConfirmationDialog,
        selectedIds: ownProps.selectedVmiLocations,
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
        billToId: session.billToId,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasToasterContext & HasHistory;

export interface VmiLocationsTableStyles {
    container?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;

    checkboxHeader?: DataTableHeaderProps;
    nameHeader?: DataTableHeaderProps;
    customerHeader?: DataTableHeaderProps;

    tableBody?: DataTableBodyProps;
    checkboxCells?: DataTableCellProps;
    nameCells?: DataTableCellProps;
    customerCells?: DataTableCellProps;

    dataTable?: DataTableProps;
    tableHead?: DataTableHeadProps;
    locationCheckbox?: CheckboxPresentationProps;
}

export const vmiLocationsTableStyles: VmiLocationsTableStyles = {
    container: {
        css: css`
            overflow: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        variant: "h4",
    },
    customerHeader: {
        tight: true,
    },
    checkboxHeader: {
        tight: true,
    },
    customerCells: {
        typographyProps: {
            ellipsis: true,
        },
    },
};

class VmiLocationsTable extends React.Component<Props> {
    private readonly styles: VmiLocationsTableStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(vmiLocationsTableStyles, props.extendedStyles);
    }

    headerClick(sortField: string) {
        const sort = this.props.parameter.sort === sortField ? `${sortField} DESC` : sortField;
        this.props.updateSearchFields({ sort, page: 1 });
    }

    sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (this.props.parameter.sort === sortField) {
            sorted = "ascending";
        } else if (this.props.parameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    locationChangeHandler = (value: boolean, id?: string) => {
        const { vmiLocationsDataView, selectedIds, toggleLocations } = this.props;
        if (id) {
            toggleLocations([id]);
        } else {
            const ids = [];
            if (!vmiLocationsDataView.value) {
                return;
            }
            for (const row of vmiLocationsDataView.value) {
                if ((value && !selectedIds[row.id]) || (!value && selectedIds[row.id])) {
                    ids.push(row.id);
                }
            }

            toggleLocations(ids);
        }
    };

    render() {
        const styles = this.styles;
        const { vmiLocationsDataView, isVmiAdmin, selectedIds, parameter, updateSearchFields } = this.props;
        if (vmiLocationsDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        if (!vmiLocationsDataView.value) {
            return null;
        }

        if (vmiLocationsDataView.value.length === 0) {
            if (parameter.page && parameter.page > 1) {
                updateSearchFields({ page: parameter.page - 1 });
                return null;
            }

            return (
                <StyledWrapper {...styles.noResultsContainer}>
                    <Typography as="p" {...styles.noResultsText}>
                        {translate("No locations found")}
                    </Typography>
                </StyledWrapper>
            );
        }

        const rows = vmiLocationsDataView.value;

        return (
            <StyledWrapper {...styles.container}>
                <DataTable {...styles.dataTable}>
                    <DataTableHead {...styles.tableHead}>
                        {isVmiAdmin && (
                            <DataTableHeader {...styles.checkboxHeader}>
                                <Checkbox
                                    {...styles.locationCheckbox}
                                    checked={rows && rows.length > 0 && rows.every(o => selectedIds[o.id])}
                                    onChange={(e, value) => this.locationChangeHandler(value)}
                                />
                            </DataTableHeader>
                        )}
                        <DataTableHeader
                            {...styles.nameHeader}
                            title={translate("Locations Name")}
                            sorted={this.sorted("name")}
                            onSortClick={() => this.headerClick("name")}
                        >
                            {translate("Locations Name")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.customerHeader}
                            sorted={this.sorted("customer.customerSequence")}
                            onSortClick={() => this.headerClick("customer.customerSequence")}
                        >
                            {translate("Address")}
                        </DataTableHeader>
                    </DataTableHead>
                    <DataTableBody {...styles.tableBody}>
                        {rows.map(({ id, name, customerLabel }) => (
                            <DataTableRow key={id}>
                                {isVmiAdmin && (
                                    <DataTableCell {...styles.checkboxCells}>
                                        <Checkbox
                                            {...styles.locationCheckbox}
                                            checked={selectedIds[id]}
                                            onChange={(e, value) => this.locationChangeHandler(value, id)}
                                        />
                                    </DataTableCell>
                                )}
                                <DataTableCell {...styles.nameCells}>
                                    <VmiLocationDetailTypeLink title={name} id={id} />
                                </DataTableCell>
                                <DataTableCell {...styles.customerCells}>{customerLabel}</DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
        );
    }
}

export default connect(mapStateToProps)(withToaster(withHistory(VmiLocationsTable)));
