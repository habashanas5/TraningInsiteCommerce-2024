import validateEmail from "@insite/client-framework/Common/Utilities/validateEmail";
import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getCurrentEditingUser } from "@insite/client-framework/Store/Pages/UserSetup/UserSetupSelectors";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        approver?: string;
        isApproved?: boolean;
    },
    {
        updatedUser?: AccountModel;
        emailErrorMessage?: React.ReactNode;
        firstNameErrorMessage?: React.ReactNode;
        lastNameErrorMessage?: React.ReactNode;
    }
>;

export const ValidateFields: HandlerType = props => {
    const state = props.getState();
    props.result = {
        updatedUser: { ...getCurrentEditingUser(state) } as AccountModel,
        emailErrorMessage: state.pages.userSetup.emailErrorMessage,
        firstNameErrorMessage: state.pages.userSetup.firstNameErrorMessage,
        lastNameErrorMessage: state.pages.userSetup.lastNameErrorMessage,
    };
    const { parameter, result } = props;
    if (typeof parameter.email !== "undefined") {
        result.emailErrorMessage = parameter.email
            ? validateEmail(parameter.email)
                ? ""
                : siteMessage("CreateNewAccountInfo_EmailAddress_ValidEmail")
            : siteMessage("CreateNewAccountInfo_EmailAddress_Required");
    }

    if (typeof parameter.firstName !== "undefined") {
        result.firstNameErrorMessage = parameter.firstName ? "" : siteMessage("User_Admin_Info_FirstName_Required");
    }

    if (typeof parameter.lastName !== "undefined") {
        result.lastNameErrorMessage = parameter.lastName ? "" : siteMessage("User_Admin_Info_LastName_Required");
    }
};

export const SetUserFields: HandlerType = props => {
    const { parameter, result } = props;
    if (!result.updatedUser) {
        throw new Error("There was no editingUser set and we are trying to update it.");
    }

    result.updatedUser.email = typeof parameter.email !== "undefined" ? parameter.email : result.updatedUser.email;
    result.updatedUser.firstName =
        typeof parameter.firstName !== "undefined" ? parameter.firstName : result.updatedUser.firstName;
    result.updatedUser.lastName =
        typeof parameter.lastName !== "undefined" ? parameter.lastName : result.updatedUser.lastName;
    result.updatedUser.role = typeof parameter.role !== "undefined" ? parameter.role : result.updatedUser.role;
    result.updatedUser.approver =
        typeof parameter.approver !== "undefined" ? parameter.approver : result.updatedUser.approver;
    result.updatedUser.isApproved =
        typeof parameter.isApproved !== "undefined" ? parameter.isApproved : result.updatedUser.isApproved;
};

export const DispatchSetUserFields: HandlerType = props => {
    props.dispatch({
        updatedUser: props.result.updatedUser,
        emailErrorMessage: props.result.emailErrorMessage,
        firstNameErrorMessage: props.result.firstNameErrorMessage,
        lastNameErrorMessage: props.result.lastNameErrorMessage,
        type: "Pages/UserSetup/SetUserFields",
    });
};

export const chain = [ValidateFields, SetUserFields, DispatchSetUserFields];

const setUserFields = createHandlerChainRunner(chain, "SetUserFields");
export default setUserFields;
