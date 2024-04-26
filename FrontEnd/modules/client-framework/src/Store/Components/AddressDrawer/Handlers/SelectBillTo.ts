import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    billTo: BillToModel | undefined;
}>;

export const DispatchSelectBillTo: HandlerType = ({ dispatch, parameter: { billTo } }) => {
    dispatch({
        type: "Components/AddressDrawer/SelectBillTo",
        billTo,
    });
};

export const chain = [DispatchSelectBillTo];

const selectBillTo = createHandlerChainRunner(chain, "SelectBillTo");
export default selectBillTo;
