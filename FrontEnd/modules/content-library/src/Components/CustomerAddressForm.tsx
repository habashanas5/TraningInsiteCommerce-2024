import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import translate from "@insite/client-framework/Translate";
import {
    AddressFieldDisplayCollectionModel,
    AddressFieldDisplayModel,
    BaseAddressModel,
    BillToModel,
    CountryModel,
    ShipToModel,
} from "@insite/client-framework/Types/ApiModels";
import CustomerAddressFormFields, {
    CustomerAddressFormFieldStyles,
} from "@insite/content-library/Components/CustomerAddressFormFields";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { css } from "styled-components";

interface OwnProps<Address extends BillToModel | ShipToModel> {
    address: Address;
    countries: CountryModel[];
    addressFieldDisplayCollection: AddressFieldDisplayCollectionModel;
    saveButtonTextOverride?: string;
    onCancel?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>, address: Address) => void;
    extendedStyles?: CustomerAddressFormStyles;
}

interface State<Address extends BillToModel | ShipToModel> {
    address: Address;
    countryLookup?: CountryModel;
    formErrors: FormErrorsState;
    formSubmitAttempted: boolean;
    isSubmitting: boolean;
}

type FormErrorsState = {
    firstName?: React.ReactNode;
    lastName?: React.ReactNode;
    attention?: React.ReactNode;
    companyName?: React.ReactNode;
    address1?: React.ReactNode;
    address2?: React.ReactNode;
    address3?: React.ReactNode;
    address4?: React.ReactNode;
    country?: React.ReactNode;
    city?: React.ReactNode;
    state?: React.ReactNode;
    postalCode?: React.ReactNode;
    phone?: React.ReactNode;
    email?: React.ReactNode;
    fax?: React.ReactNode;
};

export interface CustomerAddressFormStyles {
    form?: InjectableCss;
    formFields?: CustomerAddressFormFieldStyles;
    formButtonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const customerAddressFormStyles: CustomerAddressFormStyles = {
    formButtonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
        `,
    },
    cancelButton: {
        color: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
};

const styles = customerAddressFormStyles;
const StyledForm = getStyledWrapper("form");

const getRequiredErrorMessage = (fieldDisplay: AddressFieldDisplayModel) =>
    siteMessage("Field_Required", fieldDisplay.displayName);

export default class CustomerAddressForm<Address extends BillToModel | ShipToModel> extends React.Component<
    OwnProps<Address>,
    State<Address>
> {
    private styles: CustomerAddressFormStyles;

    constructor(props: OwnProps<Address>) {
        super(props);

        this.styles = mergeToNew(styles, props.extendedStyles);

        const { address } = this.props;
        const countryLookup = this.props.countries.find(c => c.id === address.country?.id);
        this.state = {
            address,
            countryLookup,
            formErrors: {},
            formSubmitAttempted: false,
            isSubmitting: false,
        };
    }

    componentDidUpdate(_: OwnProps<Address>, prevState: State<Address>) {
        if (prevState.address !== this.state.address && this.state.formSubmitAttempted) {
            this.validateForm();
        }
    }

    handleInputChange: TextFieldProps["onChange"] = event => {
        const { target } = event;
        const propertyName = target.name;
        this.setState({
            address: {
                ...this.state.address,
                [propertyName]: target.value,
            },
        });
    };

    handleCountryChange = (_: React.ChangeEvent<HTMLSelectElement>, country: BaseAddressModel["country"]) => {
        const countryLookup = this.props.countries.find(c => c.id === country?.id);
        this.setState({
            address: {
                ...this.state.address,
                country,
                state: null,
            },
            countryLookup,
        });
    };

    handleStateChange = (_: React.ChangeEvent<HTMLSelectElement>, state: BaseAddressModel["state"]) =>
        this.setState({
            address: {
                ...this.state.address,
                state,
            },
        });

    validateForm = () => {
        const fieldDisplay = this.props.addressFieldDisplayCollection;
        const validation = this.props.address.validation!;
        const { countries } = this.props;
        const {
            firstName,
            lastName,
            attention,
            companyName,
            address1,
            address2,
            address3,
            address4,
            country,
            city,
            state,
            postalCode,
            phone,
            email,
            fax,
        } = this.state.address;

        const formErrors: FormErrorsState = {};
        if (fieldDisplay.firstName?.isVisible && validation.firstName?.isRequired && firstName.trim().length <= 0) {
            formErrors.firstName = getRequiredErrorMessage(fieldDisplay.firstName);
        }

        if (fieldDisplay.lastName?.isVisible && validation.lastName?.isRequired && lastName.trim().length <= 0) {
            formErrors.lastName = getRequiredErrorMessage(fieldDisplay.lastName);
        }

        if (fieldDisplay.attention?.isVisible && validation.attention?.isRequired && attention.trim().length <= 0) {
            formErrors.attention = getRequiredErrorMessage(fieldDisplay.attention);
        }

        if (
            fieldDisplay.companyName?.isVisible &&
            validation.companyName?.isRequired &&
            companyName.trim().length <= 0
        ) {
            formErrors.companyName = getRequiredErrorMessage(fieldDisplay.companyName);
        }

        if (fieldDisplay.address1?.isVisible && validation.address1?.isRequired && address1.trim().length <= 0) {
            formErrors.address1 = getRequiredErrorMessage(fieldDisplay.address1);
        }

        if (fieldDisplay.address2?.isVisible && validation.address2?.isRequired && address2.trim().length <= 0) {
            formErrors.address2 = getRequiredErrorMessage(fieldDisplay.address2);
        }

        if (fieldDisplay.address3?.isVisible && validation.address3?.isRequired && address3.trim().length <= 0) {
            formErrors.address3 = getRequiredErrorMessage(fieldDisplay.address3);
        }

        if (fieldDisplay.address4?.isVisible && validation.address4?.isRequired && address4.trim().length <= 0) {
            formErrors.address4 = getRequiredErrorMessage(fieldDisplay.address4);
        }

        if (countries.length > 1 && !country && fieldDisplay.country) {
            formErrors.country = getRequiredErrorMessage(fieldDisplay.country);
        }

        if (fieldDisplay.city?.isVisible && validation.city?.isRequired && city.trim().length <= 0) {
            formErrors.city = getRequiredErrorMessage(fieldDisplay.city);
        }

        const { countryLookup } = this.state;
        if (
            countries.length > 0 &&
            countryLookup?.states &&
            countryLookup.states.length > 0 &&
            !state &&
            fieldDisplay.state
        ) {
            formErrors.state = getRequiredErrorMessage(fieldDisplay.state);
        }

        if (fieldDisplay.postalCode?.isVisible && validation.postalCode?.isRequired && postalCode.trim().length <= 0) {
            formErrors.postalCode = getRequiredErrorMessage(fieldDisplay.postalCode);
        }

        if (fieldDisplay.phone?.isVisible && validation.phone?.isRequired && phone.trim().length <= 0) {
            formErrors.phone = getRequiredErrorMessage(fieldDisplay.phone);
        } else if (phone.trim().length > 0 && !/^([\(\)/\-\.\+\s]*\d\s?(ext)?[\(\)/\-\.\+\s]*){10,}$/g.test(phone)) {
            formErrors.phone = siteMessage("AddressInfo_Phone_Validation");
        }

        if (fieldDisplay.email?.isVisible && validation.email?.isRequired && email.trim().length <= 0) {
            formErrors.email = getRequiredErrorMessage(fieldDisplay.email);
        } else if (email.trim().length > 0 && !/\w+([-+."]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g.test(email)) {
            formErrors.email = siteMessage("AddressInfo_EmailAddress_Validation");
        }

        if (fieldDisplay.fax?.isVisible && validation.fax?.isRequired && fax.trim().length <= 0) {
            formErrors.fax = getRequiredErrorMessage(fieldDisplay.fax);
        } else if (fax.trim().length > 0 && !/^([\(\)/\-\.\+\s]*\d\s?(ext)?[\(\)/\-\.\+\s]*){10,}$/g.test(fax)) {
            formErrors.fax = siteMessage("AddressInfo_Phone_Validation");
        }

        this.setState({ formErrors });

        return formErrors;
    };

    submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({ formSubmitAttempted: true, isSubmitting: true });

        const formErrors = this.validateForm();

        this.setState({ formErrors }, () => {
            if (Object.keys(this.state.formErrors).length === 0) {
                this.props.onSubmit(event, { ...this.props.address, ...this.state.address });
            } else {
                this.setState({
                    isSubmitting: false,
                });
            }
        });
    };

    render() {
        const {
            firstName,
            lastName,
            attention,
            companyName,
            address1,
            address2,
            address3,
            address4,
            country,
            city,
            state,
            postalCode,
            phone,
            email,
            fax,
        } = this.state.address;
        const { formErrors } = this.state;
        const { countries, extendedStyles } = this.props;
        const { validation } = this.props.address;
        const fieldDisplay = this.props.addressFieldDisplayCollection;

        if (!validation) {
            return null;
        }
        const isSaveDisabled =
            (validation.firstName!.isDisabled &&
                validation.lastName!.isDisabled &&
                validation.companyName!.isDisabled &&
                validation.attention!.isDisabled &&
                validation.address1!.isDisabled &&
                validation.address2!.isDisabled &&
                validation.address3!.isDisabled &&
                validation.address4!.isDisabled &&
                validation.country!.isDisabled &&
                validation.city!.isDisabled &&
                validation.postalCode!.isDisabled &&
                validation.phone!.isDisabled &&
                validation.fax!.isDisabled &&
                validation.email!.isDisabled) ||
            this.state.isSubmitting;

        return (
            <StyledForm {...styles.form} onSubmit={this.submitHandler} noValidate>
                <CustomerAddressFormFields
                    firstName={firstName}
                    lastName={lastName}
                    attention={attention}
                    companyName={companyName}
                    address1={address1}
                    address2={address2}
                    address3={address3}
                    address4={address4}
                    country={country}
                    city={city}
                    state={state}
                    postalCode={postalCode}
                    phone={phone}
                    email={email}
                    fax={fax}
                    onChangeFirstName={this.handleInputChange}
                    onChangeLastName={this.handleInputChange}
                    onChangeAttention={this.handleInputChange}
                    onChangeCompanyName={this.handleInputChange}
                    onChangeAddress1={this.handleInputChange}
                    onChangeAddress2={this.handleInputChange}
                    onChangeAddress3={this.handleInputChange}
                    onChangeAddress4={this.handleInputChange}
                    onChangeCountry={this.handleCountryChange}
                    onChangeState={this.handleStateChange}
                    onChangeCity={this.handleInputChange}
                    onChangePostalCode={this.handleInputChange}
                    onChangePhone={this.handleInputChange}
                    onChangeEmail={this.handleInputChange}
                    onChangeFax={this.handleInputChange}
                    firstNameError={formErrors.firstName}
                    lastNameError={formErrors.lastName}
                    attentionError={formErrors.attention}
                    companyNameError={formErrors.companyName}
                    address1Error={formErrors.address1}
                    address2Error={formErrors.address2}
                    address3Error={formErrors.address3}
                    address4Error={formErrors.address4}
                    countryError={formErrors.country}
                    stateError={formErrors.state}
                    cityError={formErrors.city}
                    postalCodeError={formErrors.postalCode}
                    phoneError={formErrors.phone}
                    emailError={formErrors.email}
                    faxError={formErrors.fax}
                    countries={countries}
                    validation={validation}
                    fieldDisplay={fieldDisplay}
                    extendedStyles={extendedStyles?.formFields}
                />
                <StyledWrapper {...styles.formButtonsWrapper}>
                    {this.props.onCancel && (
                        <Button
                            {...this.styles.cancelButton}
                            type="button"
                            onClick={this.props.onCancel}
                            data-test-selector="customerAddressForm_cancel"
                        >
                            {translate("Cancel")}
                        </Button>
                    )}
                    <Button
                        {...this.styles.submitButton}
                        type="submit"
                        disabled={isSaveDisabled}
                        data-test-selector="customerAddressForm_save"
                    >
                        {this.props.saveButtonTextOverride ?? translate("Save")}
                    </Button>
                </StyledWrapper>
            </StyledForm>
        );
    }
}
