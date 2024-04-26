import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import resetBillingAddressFormValidation from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/ResetBillingAddressFormValidation";
import validateBillingAddressForm from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/ValidateBillingAddressForm";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import {
    AddressFieldDisplayCollectionModel,
    BaseAddressModel,
    BillToModel,
    CountryModel,
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
    extendedStyles?: BillingAddressFormStyles;
}

const mapStateToProps = ({
    pages: {
        checkoutShipping: { billingAddressFormState },
    },
}: ApplicationState) => ({
    billingAddressFormState,
});

const mapDispatchToProps = {
    setAddress: (address: BillToModel) => (dispatch: Dispatch<AnyAction>) => {
        dispatch({
            type: "Pages/CheckoutShipping/SetBillingAddress",
            address,
        });
    },
    validateForm: makeHandlerChainAwaitable<Parameters<typeof validateBillingAddressForm>[0], boolean>(
        validateBillingAddressForm,
    ),
    resetBillingAddressFormValidation,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface BillingAddressFormStyles {
    formFields?: CustomerAddressFormFieldStyles;
}

export const billingAddressFormStyles: BillingAddressFormStyles = {};

/**
 * @deprecated Use billingAddressFormStyles instead.
 */
export const oneTimeAddressFormStyles = billingAddressFormStyles;
const styles = billingAddressFormStyles;

class BillingAddressForm extends React.Component<Props, { styles: BillingAddressFormStyles }> {
    static contextType = CheckoutShippingFormContext;

    context!: React.ContextType<typeof CheckoutShippingFormContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            styles: mergeToNew(styles, this.props.extendedStyles),
        };
    }

    componentDidMount() {
        const { billingAddressFormState, fieldDisplay, validateForm } = this.props;
        if (!billingAddressFormState) {
            return;
        }
        const { address } = billingAddressFormState;
        const { validation } = address;
        if (!validation) {
            return;
        }
        this.context.validators.billingAddress = () =>
            validateForm({
                address,
                validation,
                fieldDisplay,
            });
    }

    componentWillUnmount() {
        this.context.validators.billingAddress = undefined;
    }

    componentDidUpdate(prevProps: Props) {
        const { billingAddressFormState: prevBillingAddressFormState, fieldDisplay: prevFieldDisplay } = prevProps;
        const { billingAddressFormState, fieldDisplay, validateForm } = this.props;
        if (prevBillingAddressFormState !== billingAddressFormState && billingAddressFormState) {
            const { address } = billingAddressFormState;
            const { validation } = address;
            if (
                (!prevBillingAddressFormState ||
                    prevBillingAddressFormState.address !== address ||
                    prevBillingAddressFormState.address.validation !== validation ||
                    prevFieldDisplay !== fieldDisplay) &&
                validation
            ) {
                this.context.validators.billingAddress = () =>
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
            }
        }
    }

    handleInputChange: TextFieldProps["onChange"] = event => {
        const { billingAddressFormState, setAddress } = this.props;
        if (!billingAddressFormState) {
            return;
        }
        const { address } = billingAddressFormState;
        setAddress({
            ...address,
            [event.target.name]: event.target.value,
        });
    };

    handleCountryChange = (_: React.ChangeEvent<HTMLSelectElement>, country: BaseAddressModel["country"]) => {
        const { billingAddressFormState, setAddress } = this.props;
        if (!billingAddressFormState) {
            return;
        }
        const { address } = billingAddressFormState;
        setAddress({
            ...address,
            country,
        });
    };

    handleStateChange = (_: React.ChangeEvent<HTMLSelectElement>, state: BaseAddressModel["state"]) => {
        const { billingAddressFormState, setAddress } = this.props;
        if (!billingAddressFormState) {
            return;
        }
        const { address } = billingAddressFormState;
        setAddress({
            ...address,
            state,
        });
    };

    render() {
        const { billingAddressFormState, countries, fieldDisplay } = this.props;
        const { styles } = this.state;
        if (!billingAddressFormState) {
            return null;
        }
        const { address, formErrors } = billingAddressFormState;
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

export default connect(mapStateToProps, mapDispatchToProps)(BillingAddressForm);
