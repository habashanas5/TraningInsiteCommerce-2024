import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import resetShippingAddressFormValidation from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/ResetShippingAddressFormValidation";
import validateShippingAddressForm from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/ValidateShippingAddressForm";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import {
    AddressFieldDisplayCollectionModel,
    BaseAddressModel,
    CountryModel,
    ShipToModel,
} from "@insite/client-framework/Types/ApiModels";
import CustomerAddressFormFields, {
    CustomerAddressFormFieldStyles,
} from "@insite/content-library/Components/CustomerAddressFormFields";
import { CheckoutShippingFormContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import { TextFieldProps } from "@insite/mobius/TextField";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { Dispatch } from "redux";

interface OwnProps {
    countries: CountryModel[];
    fieldDisplay: AddressFieldDisplayCollectionModel;
    extendedStyles?: ShippingAddressFormStyles;
}

const mapStateToProps = ({
    pages: {
        checkoutShipping: { shippingAddressFormState },
    },
}: ApplicationState) => ({
    shippingAddressFormState,
});

const mapDispatchToProps = {
    setAddress: (address: ShipToModel) => (dispatch: Dispatch<AnyAction>) => {
        dispatch({
            type: "Pages/CheckoutShipping/SetShippingAddress",
            address,
        });
    },
    validateForm: makeHandlerChainAwaitable<Parameters<typeof validateShippingAddressForm>[0], boolean>(
        validateShippingAddressForm,
    ),
    resetShippingAddressFormValidation,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

type State = {
    styles: ShippingAddressFormStyles;
};

export interface ShippingAddressFormStyles {
    formFields?: CustomerAddressFormFieldStyles;
}

export const oneTimeAddressFormStyles: ShippingAddressFormStyles = {};

const styles = oneTimeAddressFormStyles;

class ShippingAddressForm extends React.Component<Props, State> {
    static contextType = CheckoutShippingFormContext;

    context!: React.ContextType<typeof CheckoutShippingFormContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            styles: mergeToNew(styles, this.props.extendedStyles),
        };
    }

    componentDidMount() {
        const { shippingAddressFormState, fieldDisplay, validateForm } = this.props;
        if (!shippingAddressFormState) {
            return;
        }
        const { address } = shippingAddressFormState;
        const { validation } = address;
        if (!validation) {
            return;
        }

        const shouldValidate =
            validation.firstName?.isDisabled === false ||
            validation.lastName?.isDisabled === false ||
            validation.companyName?.isDisabled === false ||
            validation.attention?.isDisabled === false ||
            validation.address1?.isDisabled === false ||
            validation.address2?.isDisabled === false ||
            validation.address3?.isDisabled === false ||
            validation.address4?.isDisabled === false ||
            validation.city?.isDisabled === false ||
            validation.state?.isDisabled === false ||
            validation.country?.isDisabled === false ||
            validation.postalCode?.isDisabled === false ||
            validation.phone?.isDisabled === false ||
            validation.email?.isDisabled === false ||
            validation.fax?.isDisabled === false;
        if (shouldValidate) {
            this.context.validators.shippingAddress = () =>
                validateForm({
                    address,
                    validation,
                    fieldDisplay,
                });
            this.props.resetShippingAddressFormValidation();
        }
    }

    componentWillUnmount() {
        this.context.validators.shippingAddress = undefined;
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { shippingAddressFormState: prevShippingAddressFormState, fieldDisplay: prevFieldDisplay } = prevProps;
        const { shippingAddressFormState, fieldDisplay, validateForm } = this.props;
        if (prevShippingAddressFormState !== shippingAddressFormState && shippingAddressFormState) {
            const { address } = shippingAddressFormState;
            const { validation } = address;
            if (
                (!prevShippingAddressFormState ||
                    prevShippingAddressFormState.address !== address ||
                    prevShippingAddressFormState.address.validation !== validation ||
                    prevFieldDisplay !== fieldDisplay) &&
                validation
            ) {
                const shouldValidate =
                    validation.firstName?.isDisabled === false ||
                    validation.lastName?.isDisabled === false ||
                    validation.companyName?.isDisabled === false ||
                    validation.attention?.isDisabled === false ||
                    validation.address1?.isDisabled === false ||
                    validation.address2?.isDisabled === false ||
                    validation.address3?.isDisabled === false ||
                    validation.address4?.isDisabled === false ||
                    validation.city?.isDisabled === false ||
                    validation.state?.isDisabled === false ||
                    validation.country?.isDisabled === false ||
                    validation.postalCode?.isDisabled === false ||
                    validation.phone?.isDisabled === false ||
                    validation.email?.isDisabled === false ||
                    validation.fax?.isDisabled === false;
                if (shouldValidate) {
                    this.context.validators.shippingAddress = () =>
                        validateForm({
                            address,
                            validation,
                            fieldDisplay,
                        });

                    if (this.context.formSubmitAttempted) {
                        validateForm({
                            address,
                            validation,
                            fieldDisplay,
                        });
                    }
                } else {
                    this.context.validators.shippingAddress = undefined;
                }
            }
        }
    }

    handleInputChange: TextFieldProps["onChange"] = event => {
        const { shippingAddressFormState, setAddress } = this.props;
        if (!shippingAddressFormState) {
            return;
        }
        const { address } = shippingAddressFormState;
        setAddress({
            ...address,
            [event.target.name]: event.target.value,
        });
    };

    handleCountryChange = (_: React.ChangeEvent<HTMLSelectElement>, country: BaseAddressModel["country"]) => {
        const { shippingAddressFormState, setAddress } = this.props;
        if (!shippingAddressFormState) {
            return;
        }
        const { address } = shippingAddressFormState;
        setAddress({
            ...address,
            country,
        });
    };

    handleStateChange = (_: React.ChangeEvent<HTMLSelectElement>, state: BaseAddressModel["state"]) => {
        const { shippingAddressFormState, setAddress } = this.props;
        if (!shippingAddressFormState) {
            return;
        }
        const { address } = shippingAddressFormState;
        setAddress({
            ...address,
            state,
        });
    };

    render() {
        const { shippingAddressFormState, countries, fieldDisplay } = this.props;
        const { styles } = this.state;
        if (!shippingAddressFormState) {
            return null;
        }
        const { address, formErrors } = shippingAddressFormState;
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
            validation,
        } = address;
        if (!validation) {
            return null;
        }

        return (
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
                extendedStyles={styles.formFields}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingAddressForm);
