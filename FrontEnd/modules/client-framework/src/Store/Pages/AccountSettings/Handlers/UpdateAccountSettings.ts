import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<
    {
        isSubscribed?: boolean;
        billToId?: string;
        shipToId?: string;
        useDefaultCustomer?: boolean;
        email?: string;
        fulfillmentMethod?: string;
        defaultWarehouse?: WarehouseModel;
    },
    {
        emailErrorMessage?: string;
    }
>;

const emailRegexp = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

export const ValidateEmail: HandlerType = props => {
    const {
        parameter: { email },
    } = props;
    if (typeof email === "undefined") {
        return;
    }

    const requiredFieldMessage = siteMessage("Field_Required", translate("Email Address"));
    const emailFieldMessage = siteMessage("Field_Invalid", translate("Email Address"));

    const errorMessage = email === "" ? requiredFieldMessage : emailRegexp.test(email) ? "" : emailFieldMessage;
    props.emailErrorMessage = errorMessage as string;
};

export const DispatchUpdateAccountSettings: HandlerType = props => {
    props.dispatch({
        ...props.parameter,
        emailErrorMessage: props.emailErrorMessage,
        type: "Pages/AccountSettings/UpdateAccountSettings",
    });
};

export const chain = [ValidateEmail, DispatchUpdateAccountSettings];

const updateAccountSettings = createHandlerChainRunner(chain, "UpdateAccountSettings");
export default updateAccountSettings;
