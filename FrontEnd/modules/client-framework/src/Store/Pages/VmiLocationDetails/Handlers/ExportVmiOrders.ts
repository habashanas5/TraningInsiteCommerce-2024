import { SafeDictionary } from "@insite/client-framework/Common/Types";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getCarts } from "@insite/client-framework/Services/CartService";
import { getCartsDataView } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";

type HandlerType = Handler<{
    ids: SafeDictionary<boolean>;
}>;

export const DispatchBeginExportVmiOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/BeginExportVmiOrders",
    });
};

export const ExportData: HandlerType = async props => {
    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");

    const data = [];
    const state = props.getState();
    const language = state.context.session.language;
    if (Object.keys(props.parameter.ids).length) {
        const vmiOrdersDataView = getCartsDataView(state, state.pages.vmiLocationDetails.getVmiOrdersParameter);
        if (vmiOrdersDataView.value) {
            for (const row of vmiOrdersDataView.value) {
                if (props.parameter.ids[row.id]) {
                    data.push([
                        row.orderNumber,
                        row.orderDate &&
                            getLocalizedDateTime({
                                dateTime: new Date(row.orderDate),
                                language,
                            }),
                        row.orderGrandTotalDisplay,
                        row.status,
                    ]);
                }
            }
        }
    } else {
        const apiResult = await getCarts({
            ...state.pages.vmiLocationDetails.getVmiOrdersParameter,
            page: 1,
            pageSize: 9999,
        });
        if (apiResult.successful && apiResult.result?.carts) {
            for (const row of apiResult.result.carts) {
                data.push([
                    row.orderNumber,
                    row.orderDate &&
                        getLocalizedDateTime({
                            dateTime: new Date(row.orderDate),
                            language,
                        }),
                    row.orderGrandTotalDisplay,
                    row.status,
                ]);
            }
        }
    }

    const documentData = {
        fields: [translate("Order #"), translate("Order Date"), translate("Total"), translate("Status")],
        data,
    };

    const csv = unparse(documentData);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `orders_table.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const DispatchCompleteExportVmiOrders: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/CompleteExportVmiOrders",
    });
};

export const chain = [DispatchBeginExportVmiOrders, ExportData, DispatchCompleteExportVmiOrders];

const exportVmiOrders = createHandlerChainRunner(chain, "ExportVmiOrders");
export default exportVmiOrders;
