import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getVmiBins } from "@insite/client-framework/Services/VmiBinsService";
import { getVmiBinsDataView } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import translate from "@insite/client-framework/Translate";

type HandlerType = Handler<{
    ids: SafeDictionary<boolean>;
}>;

export const DispatchBeginExportVmiProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/BeginExportVmiProducts",
    });
};

export const ExportData: HandlerType = async props => {
    const { unparse } = await import(/* webpackChunkName: "papaparse" */ "papaparse");

    const data = [];
    const state = props.getState();
    if (Object.keys(props.parameter.ids).length) {
        const vmiBinsDataView = getVmiBinsDataView(state, state.pages.vmiLocationDetails.getVmiBinsParameter);
        if (vmiBinsDataView.value) {
            for (const row of vmiBinsDataView.value) {
                if (props.parameter.ids[row.id]) {
                    data.push([
                        row.product.shortDescription,
                        row.product.erpNumber,
                        row.binNumber,
                        row.minimumQty,
                        row.maximumQty,
                    ]);
                }
            }
        }
    } else {
        const result = await getVmiBins({
            ...state.pages.vmiLocationDetails.getVmiBinsParameter,
            page: 1,
            pageSize: 9999,
            expand: ["product"],
        });
        if (result.vmiBins) {
            for (const row of result.vmiBins) {
                data.push([
                    row.product.shortDescription,
                    row.product.erpNumber,
                    row.binNumber,
                    row.minimumQty,
                    row.maximumQty,
                ]);
            }
        }
    }

    const documentData = {
        fields: [
            translate("Product Name"),
            translate("Part #"),
            translate("Bin #"),
            translate("Min"),
            translate("Max"),
        ],
        data,
    };

    const csv = unparse(documentData);
    const csvBlob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });

    const fileName = `products_table.csv`;
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(csvBlob, fileName);
    } else {
        const downloadLink = document.createElement("a");
        downloadLink.href = window.URL.createObjectURL(csvBlob);
        downloadLink.setAttribute("download", fileName);
        downloadLink.click();
    }
};

export const DispatchCompleteExportVmiProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/CompleteExportVmiProducts",
    });
};

export const chain = [DispatchBeginExportVmiProducts, ExportData, DispatchCompleteExportVmiProducts];

const exportVmiProducts = createHandlerChainRunner(chain, "ExportVmiProducts");
export default exportVmiProducts;
