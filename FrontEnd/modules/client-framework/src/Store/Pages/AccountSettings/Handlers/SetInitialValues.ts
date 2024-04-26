import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getBillTos, getShipTos } from "@insite/client-framework/Services/CustomersService";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import { BillToModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<
    {},
    {
        defaultBillTo?: BillToModel;
        defaultShipTo?: ShipToModel;
        showSelectDefaultCustomer: boolean;
        useDefaultCustomer: boolean;
        hasMultipleBillTos: boolean;
    }
>;

export const FindDefaultBillTo: HandlerType = async props => {
    const billToCollection = await getBillTos({});
    const billTos = billToCollection.billTos!;

    if (billTos.length === 1) {
        props.defaultBillTo = billTos[0];
    } else {
        const defaultBillTos = billTos.filter(o => o.isDefault);

        if (defaultBillTos.length === 1) {
            props.defaultBillTo = defaultBillTos[0];
        }
    }
};

export const FindDefaultShipTo: HandlerType = async props => {
    if (!props.defaultBillTo) {
        return;
    }

    const shipToCollection = await getShipTos({
        billToId: props.defaultBillTo.id,
        exclude: ["oneTime"],
    });
    const shipTos = shipToCollection.shipTos!;
    if (shipTos.length === 1) {
        props.defaultShipTo = shipTos[0];
    } else {
        const defaultShipTos = shipTos.filter(o => o.isDefault);
        if (defaultShipTos.length === 1) {
            props.defaultShipTo = defaultShipTos[0];
        }
    }
};

export const DetermineValues: HandlerType = props => {
    props.showSelectDefaultCustomer = true;
    props.useDefaultCustomer = false;
    if (props.defaultShipTo && props.defaultBillTo) {
        if (!props.defaultBillTo.isDefault && !props.defaultShipTo.isDefault) {
            props.showSelectDefaultCustomer = false;
        } else if (props.defaultBillTo.isDefault && props.defaultShipTo.isDefault) {
            props.useDefaultCustomer = true;
        }
    }
};

export const DispatchSetInitialValues: HandlerType = props => {
    const account = getCurrentAccountState(props.getState()).value;
    if (!account) {
        throw new Error(
            "There was no current account and we were trying to set initial values for the account settings page.",
        );
    }

    props.dispatch({
        type: "Pages/AccountSettings/SetInitialValues",
        defaultBillToId: props.defaultBillTo?.id,
        defaultShipToId: props.defaultShipTo?.id,
        showSelectDefaultCustomer: props.showSelectDefaultCustomer,
        useDefaultCustomer: props.useDefaultCustomer,
        account,
    });
};

export const chain = [FindDefaultBillTo, FindDefaultShipTo, DetermineValues, DispatchSetInitialValues];

const setInitialValues = createHandlerChainRunnerOptionalParameter(chain, {}, "SetInitialValues");
export default setInitialValues;
