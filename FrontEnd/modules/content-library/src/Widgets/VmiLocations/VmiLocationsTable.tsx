import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import {
    defaultVmiLocationGetShipTosApiParameter,
    GetShipTosApiParameter,
} from "@insite/client-framework/Services/CustomersService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import {
    isVmiAdmin,
    VmiLocationsDataViewContext,
} from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import selectVmiLocations from "@insite/client-framework/Store/Pages/VmiLocations/Handlers/SelectVmiLocations";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiLocations/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import VmiLocationDetailTypeLink from "@insite/content-library/Components/VmiLocationDetailTypeLink";
import { LocationsPageContext } from "@insite/content-library/Pages/VmiLocationsPage";
import AddVmiLocationModal from "@insite/content-library/Widgets/VmiLocations/AddVmiLocationModal";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import Link from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        parameter: state.pages.vmiLocations.getVmiLocationsParameter,
        showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
        selectedIds: state.pages.vmiLocations.selectedVmiLocations,
        isRemoving: state.data.vmiLocations.isRemoving,
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
        billToId: session.billToId,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
    selectVmiLocations,
};

type Props = ReturnType<typeof mapStateToProps> &
    WidgetProps &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface VmiLocationsTableStyles {
    container?: InjectableCss;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;

    checkboxHeader?: DataTableHeaderProps;
    nameHeader?: DataTableHeaderProps;
    customerHeader?: DataTableHeaderProps;
    actionsHeader?: DataTableHeaderProps;

    checkboxCells?: DataTableCellProps;
    nameCells?: DataTableCellProps;
    customerCells?: DataTableCellProps;
    actionsCells?: DataTableCellProps;

    dataTable?: DataTableProps;
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
    actionsHeader: {
        tight: true,
    },
    nameCells: {
        css: css`
            max-width: 330px;
            a {
                text-overflow: ellipsis;
                overflow: hidden;
                display: block;
            }
        `,
    },
    customerCells: {
        css: css`
            max-width: 650px;
            span {
                text-overflow: ellipsis;
                display: block;
            }
        `,
        typographyProps: {
            ellipsis: true,
        },
    },
};

const styles = vmiLocationsTableStyles;

class VmiLocationsTable extends React.Component<
    Props,
    { isAddLocationModalOpen: boolean; shipTosParameter: GetShipTosApiParameter; locationId?: string }
> {
    static contextType = VmiLocationsDataViewContext;
    context!: React.ContextType<typeof VmiLocationsDataViewContext>;

    state = {
        isAddLocationModalOpen: false,
        locationId: undefined,
        shipTosParameter: defaultVmiLocationGetShipTosApiParameter(this.props.billToId),
    };

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
        if (id) {
            this.props.selectVmiLocations({ ids: [id] });
        } else {
            let ids = [];
            if (value) {
                const vmiLocationsDataView = this.context;
                if (!vmiLocationsDataView.value) {
                    return;
                }
                for (const row of vmiLocationsDataView.value) {
                    if (!this.props.selectedIds[row.id]) {
                        ids.push(row.id);
                    }
                }
            } else {
                ids = Object.keys(this.props.selectedIds);
            }

            this.props.selectVmiLocations({ ids });
        }
    };

    addLocationClickHandler = (id: string) => {
        this.setState({ isAddLocationModalOpen: true, locationId: id });
    };

    onSuccessAddLocationModal = () => {
        this.setState({ isAddLocationModalOpen: false });
    };

    onCloseAddLocationModal = () => {
        this.setState({ isAddLocationModalOpen: false });
    };

    setShipTosParameter = (parameter: GetShipTosApiParameter) => {
        this.setState({ shipTosParameter: parameter });
    };

    render() {
        const vmiLocationsDataView = this.context;

        if (vmiLocationsDataView.isLoading || this.props.isRemoving) {
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
            if (this.props.parameter.page && this.props.parameter.page > 1) {
                this.props.updateSearchFields({ page: this.props.parameter.page - 1 });
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
            <>
                <StyledWrapper {...styles.container}>
                    <DataTable {...styles.dataTable}>
                        <DataTableHead>
                            {this.props.isVmiAdmin && (
                                <DataTableHeader {...styles.checkboxHeader}>
                                    <Checkbox
                                        {...styles.locationCheckbox}
                                        checked={Object.keys(this.props.selectedIds).length === rows.length}
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
                            <DataTableHeader {...styles.actionsHeader} title={translate("Actions")}>
                                {translate("Actions")}
                            </DataTableHeader>
                        </DataTableHead>
                        <DataTableBody>
                            {rows.map(({ id, name, customerLabel }) => (
                                <DataTableRow key={id}>
                                    {this.props.isVmiAdmin && (
                                        <DataTableCell {...styles.checkboxCells}>
                                            <Checkbox
                                                {...styles.locationCheckbox}
                                                checked={this.props.selectedIds[id]}
                                                onChange={(e, value) => this.locationChangeHandler(value, id)}
                                            />
                                        </DataTableCell>
                                    )}
                                    <DataTableCell {...styles.nameCells}>
                                        <VmiLocationDetailTypeLink title={name} id={id} />
                                    </DataTableCell>
                                    <DataTableCell {...styles.customerCells}>{customerLabel}</DataTableCell>
                                    <DataTableCell {...styles.actionsCells}>
                                        <Link onClick={() => this.addLocationClickHandler(id)}>
                                            {translate("Edit")}
                                        </Link>
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>
                </StyledWrapper>
                <AddVmiLocationModal
                    isOpen={this.state.isAddLocationModalOpen}
                    editLocationId={this.state.locationId}
                    onSuccess={this.onSuccessAddLocationModal}
                    onClose={this.onCloseAddLocationModal}
                    shipTosParameter={this.state.shipTosParameter}
                    setShipTosParameter={this.setShipTosParameter}
                />
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(withHistory(VmiLocationsTable))),
    definition: {
        group: "VMI Locations",
        displayName: "Search Results Table",
        allowedContexts: [LocationsPageContext],
    },
};

export default widgetModule;
