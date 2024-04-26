import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import parse from "html-react-parser";
import * as React from "react";
import { useContext } from "react";

export interface OrderDetailsShipmentPackagesStyles {
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    shipmentDateHeader?: DataTableHeaderProps;
    carrierHeader?: DataTableHeaderProps;
    shipViaHeader?: DataTableHeaderProps;
    trackingNumberHeader?: DataTableHeaderProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    shipmentDateCell?: DataTableCellProps;
    carrierCell?: DataTableCellProps;
    shipViaCell?: DataTableCellProps;
    trackingNumberCell?: DataTableCellProps;
}

export const shipmentPackagesStyles: OrderDetailsShipmentPackagesStyles = {};

const styles = shipmentPackagesStyles;

const OrderDetailsShipmentPackages: React.FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    if (!order.shipmentPackages || order.shipmentPackages.length === 0) {
        return null;
    }

    return (
        <DataTable {...styles.dataTable}>
            <DataTableHead {...styles.dataTableHead}>
                <DataTableHeader {...styles.shipmentDateHeader}>{translate("Ship Date")}</DataTableHeader>
                <DataTableHeader {...styles.carrierHeader}>{translate("Carrier")}</DataTableHeader>
                <DataTableHeader {...styles.shipViaHeader}>{translate("Service")}</DataTableHeader>
                <DataTableHeader {...styles.trackingNumberHeader}>{translate("Tracking #")}</DataTableHeader>
            </DataTableHead>
            <DataTableBody {...styles.dataTableBody}>
                {order.shipmentPackages.map(shipmentPackage => (
                    <DataTableRow {...styles.dataTableRow} key={shipmentPackage.id}>
                        <DataTableCell {...styles.shipmentDateCell}>
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
            </DataTableBody>
        </DataTable>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsShipmentPackages,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
    },
};

export default widgetModule;
