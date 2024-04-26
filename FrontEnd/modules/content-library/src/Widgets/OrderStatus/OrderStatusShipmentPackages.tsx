import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { OrderStatusPageContext } from "@insite/content-library/Pages/OrderStatusPage";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import parse from "html-react-parser";
import React, { FC } from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    order: state.pages.orderStatus.order,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface OrderStatusShipmentPackagesStyles {
    dataTable?: DataTableProps;
    tableHead?: DataTableHeadProps;
    shipmentDateHeader?: DataTableHeaderProps;
    carrierHeader?: DataTableHeaderProps;
    shipViaHeader?: DataTableHeaderProps;
    trackingNumberHeader?: DataTableHeaderProps;
    tableRow?: DataTableRowProps;
    shipDateCell?: DataTableCellBaseProps;
    carrierCell?: DataTableCellBaseProps;
    shipViaCell?: DataTableCellBaseProps;
    trackingNumberCell?: DataTableCellBaseProps;
}

export const orderStatusShipmentPackagesStyles: OrderStatusShipmentPackagesStyles = {};

const styles = orderStatusShipmentPackagesStyles;

const OrderStatusShipmentPackages: FC<Props> = ({ order }) => {
    if (!order || !order.shipmentPackages || order.shipmentPackages.length === 0) {
        return null;
    }

    return (
        <DataTable {...styles.dataTable}>
            <DataTableHead {...styles.tableHead}>
                <DataTableHeader {...styles.shipmentDateHeader}>{translate("Ship Date")}</DataTableHeader>
                <DataTableHeader {...styles.carrierHeader}>{translate("Carrier")}</DataTableHeader>
                <DataTableHeader {...styles.shipViaHeader}>{translate("Service")}</DataTableHeader>
                <DataTableHeader {...styles.trackingNumberHeader}>{translate("Tracking #")}</DataTableHeader>
            </DataTableHead>
            {order.shipmentPackages?.map(shipmentPackage => (
                <DataTableRow key={shipmentPackage.id} {...styles.tableRow}>
                    <DataTableCell {...styles.shipDateCell}>
                        <LocalizedDateTime
                            dateTime={new Date(shipmentPackage.shipmentDate)}
                            options={{ year: "numeric", month: "numeric", day: "numeric" }}
                        />
                    </DataTableCell>
                    <DataTableCell {...styles.carrierCell}>{shipmentPackage.carrier}</DataTableCell>
                    <DataTableCell {...styles.shipViaCell}>{shipmentPackage.shipVia}</DataTableCell>
                    <DataTableCell {...styles.trackingNumberCell}>
                        {parse(shipmentPackage.trackingUrl, parserOptions)}
                    </DataTableCell>
                </DataTableRow>
            ))}
        </DataTable>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderStatusShipmentPackages),
    definition: {
        allowedContexts: [OrderStatusPageContext],
        displayName: "Shipment Packages",
        group: "Order Status",
    },
};

export default widgetModule;
