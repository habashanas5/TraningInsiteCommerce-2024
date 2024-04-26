import { SafeDictionary } from "@insite/client-framework/Common/Types";
import validateEmail from "@insite/client-framework/Common/Utilities/validateEmail";
import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import {
    AddressFieldDisplayCollectionModel,
    AddressFieldDisplayModel,
    BaseAddressModel,
    CustomerValidationDto,
} from "@insite/client-framework/Types/ApiModels";

export type AddressErrors = SafeDictionary<React.ReactNode>;

type HandlerType = Handler<
    {
        address: BaseAddressModel;
        validationRules: CustomerValidationDto;
        addressFieldDisplayCollection: AddressFieldDisplayCollectionModel;
    } & HasOnSuccess<AddressErrors>,
    {
        addressErrors: AddressErrors;
    }
>;

const phoneRegex = /^([\(\)/\-\.\+\s]*\d\s?(ext)?[\(\)/\-\.\+\s]*){10,}$/;

const isEmpty = (value: string) => value.trim().length <= 0;
const isValidPhoneNumber = (value: string) => phoneRegex.test(value);

const getRequiredErrorMessage = (addressFieldDisplayCollection: AddressFieldDisplayModel) =>
    siteMessage("Field_Required", addressFieldDisplayCollection.displayName);

export const ResetFormErrors: HandlerType = props => {
    props.addressErrors = {};
};

export const ValidateFirstName: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { firstName } = props.parameter.address;
    if (
        addressFieldDisplayCollection.firstName?.isVisible &&
        validationRules.firstName?.isRequired &&
        isEmpty(firstName)
    ) {
        props.addressErrors.firstName = getRequiredErrorMessage(addressFieldDisplayCollection.firstName);
    }
};

export const ValidateLastName: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { lastName } = props.parameter.address;
    if (
        addressFieldDisplayCollection.lastName?.isVisible &&
        validationRules.lastName?.isRequired &&
        isEmpty(lastName)
    ) {
        props.addressErrors.lastName = getRequiredErrorMessage(addressFieldDisplayCollection.lastName);
    }
};

export const ValidateCompanyName: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { companyName } = props.parameter.address;
    if (
        addressFieldDisplayCollection.companyName?.isVisible &&
        validationRules.companyName?.isRequired &&
        isEmpty(companyName)
    ) {
        props.addressErrors.companyName = getRequiredErrorMessage(addressFieldDisplayCollection.companyName);
    }
};

export const ValidateAttention: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { attention } = props.parameter.address;
    if (
        addressFieldDisplayCollection.attention?.isVisible &&
        validationRules.attention?.isRequired &&
        isEmpty(attention)
    ) {
        props.addressErrors.attention = getRequiredErrorMessage(addressFieldDisplayCollection.attention);
    }
};

export const ValidateAddress1: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { address1 } = props.parameter.address;
    if (
        addressFieldDisplayCollection.address1?.isVisible &&
        validationRules.address1?.isRequired &&
        isEmpty(address1)
    ) {
        props.addressErrors.address1 = getRequiredErrorMessage(addressFieldDisplayCollection.address1);
    }
};

export const ValidateAddress2: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { address2 } = props.parameter.address;
    if (
        addressFieldDisplayCollection.address2?.isVisible &&
        validationRules.address2?.isRequired &&
        isEmpty(address2)
    ) {
        props.addressErrors.address2 = getRequiredErrorMessage(addressFieldDisplayCollection.address2);
    }
};

export const ValidateAddress3: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { address3 } = props.parameter.address;
    if (
        addressFieldDisplayCollection.address3?.isVisible &&
        validationRules.address3?.isRequired &&
        isEmpty(address3)
    ) {
        props.addressErrors.address3 = getRequiredErrorMessage(addressFieldDisplayCollection.address3);
    }
};

export const ValidateAddress4: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { address4 } = props.parameter.address;
    if (
        addressFieldDisplayCollection.address4?.isVisible &&
        validationRules.address4?.isRequired &&
        isEmpty(address4)
    ) {
        props.addressErrors.address4 = getRequiredErrorMessage(addressFieldDisplayCollection.address4);
    }
};

export const ValidateCountry: HandlerType = props => {
    const countries = getCurrentCountries(props.getState());
    if (!countries) {
        throw new Error("Cannot validate country. The website countries have not been loaded yet.");
    }

    const { addressFieldDisplayCollection } = props.parameter;
    const { country } = props.parameter.address;
    if (countries.length > 1 && !country && addressFieldDisplayCollection.country) {
        props.addressErrors.country = getRequiredErrorMessage(addressFieldDisplayCollection.country);
    }
};

export const ValidateState: HandlerType = props => {
    const { country, state } = props.parameter.address;
    const { addressFieldDisplayCollection } = props.parameter;
    const countries = getCurrentCountries(props.getState());
    if (!countries) {
        throw new Error("Cannot validate country. The website countries have not been loaded yet.");
    }

    if (!country) {
        // This is fine to simply return because the address country
        // is validated in the previous handler. If the country has not
        // been selected yet, it doesn"t make sense to show an error for the state.
        return;
    }

    const countryLookup = countries.find(c => c.id === country.id);
    if (
        countries.length > 0 &&
        countryLookup?.states &&
        countryLookup.states.length > 0 &&
        !state &&
        addressFieldDisplayCollection.state
    ) {
        props.addressErrors.state = getRequiredErrorMessage(addressFieldDisplayCollection.state);
    }
};

export const ValidateCity: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { city } = props.parameter.address;
    if (addressFieldDisplayCollection.city?.isVisible && validationRules.city?.isRequired && isEmpty(city)) {
        props.addressErrors.city = getRequiredErrorMessage(addressFieldDisplayCollection.city);
    }
};

export const ValidatePostalCode: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { postalCode } = props.parameter.address;
    if (
        addressFieldDisplayCollection.postalCode?.isVisible &&
        validationRules.postalCode?.isRequired &&
        isEmpty(postalCode)
    ) {
        props.addressErrors.postalCode = getRequiredErrorMessage(addressFieldDisplayCollection.postalCode);
    }
};

export const ValidatePhone: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { phone } = props.parameter.address;
    if (addressFieldDisplayCollection.phone?.isVisible && validationRules.phone?.isRequired && isEmpty(phone)) {
        props.addressErrors.phone = getRequiredErrorMessage(addressFieldDisplayCollection.phone);
    } else if (!isEmpty(phone) && !isValidPhoneNumber(phone)) {
        props.addressErrors.phone = siteMessage("AddressInfo_Phone_Validation");
    }
};

export const ValidateEmail: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { email } = props.parameter.address;
    if (addressFieldDisplayCollection.email?.isVisible && validationRules.email?.isRequired && isEmpty(email)) {
        props.addressErrors.email = getRequiredErrorMessage(addressFieldDisplayCollection.email);
    } else if (!isEmpty(email) && !validateEmail(email)) {
        props.addressErrors.email = siteMessage("AddressInfo_EmailAddress_Validation");
    }
};

export const ValidateFax: HandlerType = props => {
    const { validationRules, addressFieldDisplayCollection } = props.parameter;
    const { fax } = props.parameter.address;
    if (addressFieldDisplayCollection.fax?.isVisible && validationRules.fax?.isRequired && isEmpty(fax)) {
        props.addressErrors.fax = getRequiredErrorMessage(addressFieldDisplayCollection.fax);
    } else if (!isEmpty(fax) && !isValidPhoneNumber(fax)) {
        props.addressErrors.fax = siteMessage("AddressInfo_Phone_Validation");
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.addressErrors);
};

export const chain = [
    ResetFormErrors,
    ValidateFirstName,
    ValidateLastName,
    ValidateCompanyName,
    ValidateAttention,
    ValidateAddress1,
    ValidateAddress2,
    ValidateAddress3,
    ValidateAddress4,
    ValidateCountry,
    ValidateState,
    ValidateCity,
    ValidatePostalCode,
    ValidatePhone,
    ValidateEmail,
    ValidateFax,
    ExecuteOnSuccessCallback,
];

const validateAddress = createHandlerChainRunner(chain, "ValidateAddress");
export default validateAddress;
