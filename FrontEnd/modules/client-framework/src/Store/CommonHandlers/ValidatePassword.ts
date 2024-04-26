import { createHandlerChainRunnerForOldOnComplete, Handler } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";

const digitRegExp = /[0-9]/;
const lowerRegExp = /[a-z]/;
const upperRegExp = /[A-Z]/;
const specialRegExp = /\W/;

/** @deprecated Use direct call of 'translate' inside your component */
export const numberPasswordLengthMessage = translate("Password must include at least one number");
/** @deprecated Use direct call of 'translate' inside your component */
export const lowerCasePasswordLengthMessage = translate("Password must include at least one lowercase character");
/** @deprecated Use direct call of 'translate' inside your component */
export const upperCasePasswordLengthMessage = translate("Password must include at least one uppercase character");
/** @deprecated Use direct call of 'translate' inside your component */
export const specialPasswordLengthMessage = translate("Password must include at least one non alphanumeric character");

type HandlerType = Handler<
    {
        password: string;
        /** This is a legacy onComplete, it will only fire if the Handler CallOnComplete is hit */
        onComplete: (errorMessage: React.ReactNode) => void;
    },
    {
        passwordErrorMessage: React.ReactNode;
    }
>;

export const ValidatePassword: HandlerType = props => {
    let errorMessage: React.ReactNode = "";
    const password = props.parameter.password;
    const {
        passwordMinimumLength,
        passwordRequiresDigit,
        passwordRequiresLowercase,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
    } = getSettingsCollection(props.getState()).accountSettings;

    if (!password) {
        errorMessage = siteMessage("CreateNewAccountInfo_Password_Required");
    }

    if (!errorMessage && password.length > 0 && password.length < passwordMinimumLength) {
        errorMessage = translate("Password must be at least {0} characters long", passwordMinimumLength.toString());
    }

    if (!errorMessage && passwordRequiresDigit && !digitRegExp.test(password)) {
        errorMessage = translate("Password must include at least one number");
    }

    if (!errorMessage && passwordRequiresLowercase && !lowerRegExp.test(password)) {
        errorMessage = translate("Password must include at least one lowercase character");
    }

    if (!errorMessage && passwordRequiresUppercase && !upperRegExp.test(password)) {
        errorMessage = translate("Password must include at least one uppercase character");
    }

    if (!errorMessage && passwordRequiresSpecialCharacter && !specialRegExp.test(password)) {
        errorMessage = translate("Password must include at least one non alphanumeric character");
    }

    props.passwordErrorMessage = errorMessage;
};

export const CallOnComplete: HandlerType = props => {
    props.parameter.onComplete(props.passwordErrorMessage);
};

export const chain = [ValidatePassword, CallOnComplete];

const validatePassword = createHandlerChainRunnerForOldOnComplete(chain, "ValidatePassword");
export default validatePassword;
