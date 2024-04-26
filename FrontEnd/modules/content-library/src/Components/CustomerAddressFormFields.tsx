import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import {
    AddressFieldDisplayCollectionModel,
    BaseAddressModel,
    CountryModel,
    CustomerValidationDto,
    StateModel,
} from "@insite/client-framework/Types/ApiModels";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Select, { SelectPresentationProps, SelectProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps, TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { css } from "styled-components";

interface OwnProps {
    firstName: string;
    lastName: string;
    attention: string;
    companyName: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    country: BaseAddressModel["country"];
    state: BaseAddressModel["state"];
    city: string;
    postalCode: string;
    phone: string;
    email: string;
    fax: string;
    onChangeFirstName: TextFieldProps["onChange"];
    onChangeLastName: TextFieldProps["onChange"];
    onChangeAttention: TextFieldProps["onChange"];
    onChangeCompanyName: TextFieldProps["onChange"];
    onChangeAddress1: TextFieldProps["onChange"];
    onChangeAddress2: TextFieldProps["onChange"];
    onChangeAddress3: TextFieldProps["onChange"];
    onChangeAddress4: TextFieldProps["onChange"];
    onChangeCountry: (event: React.ChangeEvent<HTMLSelectElement>, country: BaseAddressModel["country"]) => void;
    onChangeState: (event: React.ChangeEvent<HTMLSelectElement>, state: BaseAddressModel["state"]) => void;
    onChangeCity: TextFieldProps["onChange"];
    onChangePostalCode: TextFieldProps["onChange"];
    onChangePhone: TextFieldProps["onChange"];
    onChangeEmail: TextFieldProps["onChange"];
    onChangeFax: TextFieldProps["onChange"];
    firstNameError: React.ReactNode;
    lastNameError: React.ReactNode;
    attentionError: React.ReactNode;
    companyNameError: React.ReactNode;
    address1Error: React.ReactNode;
    address2Error: React.ReactNode;
    address3Error: React.ReactNode;
    address4Error: React.ReactNode;
    countryError: React.ReactNode;
    stateError: React.ReactNode;
    cityError: React.ReactNode;
    postalCodeError: React.ReactNode;
    phoneError: React.ReactNode;
    emailError: React.ReactNode;
    faxError: React.ReactNode;
    countries: CountryModel[];
    fieldDisplay: AddressFieldDisplayCollectionModel;
    validation: CustomerValidationDto;
    extendedStyles?: CustomerAddressFormFieldStyles;
}

type Props = OwnProps;

export interface CustomerAddressFormFieldStyles {
    form?: InjectableCss;
    container?: GridContainerProps;
    firstNameGridItem?: GridItemProps;
    firstNameText?: TextFieldPresentationProps;
    lastNameGridItem?: GridItemProps;
    lastNameText?: TextFieldPresentationProps;
    companyNameGridItem?: GridItemProps;
    companyNameText?: TextFieldPresentationProps;
    attentionGridItem?: GridItemProps;
    attentionText?: TextFieldPresentationProps;
    address1GridItem?: GridItemProps;
    address1Text?: TextFieldPresentationProps;
    address2GridItem?: GridItemProps;
    address2Text?: TextFieldPresentationProps;
    address3GridItem?: GridItemProps;
    address3Text?: TextFieldPresentationProps;
    address4GridItem?: GridItemProps;
    address4Text?: TextFieldPresentationProps;
    countryGridItem?: GridItemProps;
    countrySelect?: SelectPresentationProps;
    cityGridItem?: GridItemProps;
    cityText?: TextFieldPresentationProps;
    stateGridItem?: GridItemProps;
    stateSelect?: SelectPresentationProps;
    postalCodeGridItem?: GridItemProps;
    postalCodeText?: TextFieldPresentationProps;
    phoneGridItem?: GridItemProps;
    phoneText?: TextFieldPresentationProps;
    faxGridItem?: GridItemProps;
    faxText?: TextFieldPresentationProps;
    emailGridItem?: GridItemProps;
    emailText?: TextFieldPresentationProps;
    formButtonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const customerAddressFormFieldStyles: CustomerAddressFormFieldStyles = {
    firstNameGridItem: { width: 6 },
    lastNameGridItem: { width: 6 },
    companyNameGridItem: { width: 6 },
    attentionGridItem: { width: 6 },
    address1GridItem: { width: 12 },
    address2GridItem: { width: 12 },
    address3GridItem: { width: 12 },
    address4GridItem: { width: 12 },
    countryGridItem: { width: 12 },
    cityGridItem: { width: 12 },
    stateGridItem: { width: 6 },
    postalCodeGridItem: { width: 6 },
    phoneGridItem: { width: 6 },
    faxGridItem: { width: 6 },
    emailGridItem: { width: 12 },
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

const styles = customerAddressFormFieldStyles;

const CustomerAddressFormFields = ({
    firstName,
    lastName,
    attention,
    companyName,
    address1,
    address2,
    address3,
    address4,
    country,
    state,
    city,
    postalCode,
    phone,
    email,
    fax,
    onChangeFirstName,
    onChangeLastName,
    onChangeAttention,
    onChangeCompanyName,
    onChangeAddress1,
    onChangeAddress2,
    onChangeAddress3,
    onChangeAddress4,
    onChangeCountry,
    onChangeState,
    onChangeCity,
    onChangePostalCode,
    onChangePhone,
    onChangeEmail,
    onChangeFax,
    firstNameError,
    lastNameError,
    attentionError,
    companyNameError,
    address1Error,
    address2Error,
    address3Error,
    address4Error,
    countryError,
    stateError,
    cityError,
    postalCodeError,
    phoneError,
    emailError,
    faxError,
    countries,
    fieldDisplay,
    validation,
    extendedStyles,
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(customerAddressFormFieldStyles, extendedStyles));

    if (!countries) {
        return null;
    }

    const [selectedCountry, setSelectedCountry] = useState<CountryModel | undefined>(undefined);
    const [states, setStates] = useState<StateModel[]>([]);

    useEffect(() => {
        setSelectedCountry(countries.find(c => c.id === country?.id));
    }, [country]);

    useEffect(() => {
        setStates(selectedCountry?.states || []);
    }, [selectedCountry]);

    const handleCountryChange: SelectProps["onChange"] = event => {
        const country = countries.find(c => c.id === event.target.value);
        setSelectedCountry(country);
        onChangeCountry(event, country || null);
    };

    const handleStateChange: SelectProps["onChange"] = event => {
        const state = selectedCountry?.states?.find(s => s.id === event.target.value);
        onChangeState(event, state || null);
    };

    return (
        <GridContainer {...styles.container} data-test-selector="customerAddressFormFields">
            {fieldDisplay.firstName!.isVisible && (
                <GridItem {...styles.firstNameGridItem}>
                    <TextField
                        {...styles.firstNameText}
                        name="firstName"
                        label={fieldDisplay.firstName!.displayName}
                        value={firstName}
                        disabled={validation.firstName!.isDisabled}
                        required={validation.firstName!.isRequired}
                        maxLength={validation.firstName!.maxLength || undefined}
                        onChange={onChangeFirstName}
                        error={firstNameError}
                        data-test-selector="customerAddressForm_firstName"
                    />
                </GridItem>
            )}
            {fieldDisplay.lastName!.isVisible && (
                <GridItem {...styles.lastNameGridItem}>
                    <TextField
                        {...styles.lastNameText}
                        name="lastName"
                        label={fieldDisplay.lastName!.displayName}
                        value={lastName}
                        disabled={validation.lastName!.isDisabled}
                        required={validation.lastName!.isRequired}
                        maxLength={validation.lastName!.maxLength || undefined}
                        onChange={onChangeLastName}
                        error={lastNameError}
                        data-test-selector="customerAddressForm_lastName"
                    />
                </GridItem>
            )}
            {fieldDisplay.companyName!.isVisible && (
                <GridItem {...styles.companyNameGridItem}>
                    <TextField
                        {...styles.companyNameText}
                        name="companyName"
                        label={fieldDisplay.companyName!.displayName}
                        value={companyName}
                        disabled={validation.companyName!.isDisabled}
                        required={validation.companyName!.isRequired}
                        maxLength={validation.companyName!.maxLength || undefined}
                        onChange={onChangeCompanyName}
                        error={companyNameError}
                        data-test-selector="customerAddressForm_companyName"
                    />
                </GridItem>
            )}
            {fieldDisplay.attention!.isVisible && (
                <GridItem {...styles.attentionGridItem}>
                    <TextField
                        {...styles.attentionText}
                        name="attention"
                        label={fieldDisplay.attention!.displayName}
                        value={attention}
                        disabled={validation.attention!.isDisabled}
                        required={validation.attention!.isRequired}
                        maxLength={validation.attention!.maxLength || undefined}
                        onChange={onChangeAttention}
                        error={attentionError}
                        data-test-selector="customerAddressForm_attention"
                    />
                </GridItem>
            )}
            {fieldDisplay.address1!.isVisible && (
                <GridItem {...styles.address1GridItem}>
                    <TextField
                        {...styles.address1Text}
                        name="address1"
                        label={fieldDisplay.address1!.displayName}
                        value={address1}
                        disabled={validation.address1!.isDisabled}
                        required={validation.address1!.isRequired}
                        maxLength={validation.address1!.maxLength || undefined}
                        onChange={onChangeAddress1}
                        error={address1Error}
                        data-test-selector="customerAddressForm_address1"
                    />
                </GridItem>
            )}
            {fieldDisplay.address2!.isVisible && (
                <GridItem {...styles.address2GridItem}>
                    <TextField
                        {...styles.address2Text}
                        name="address2"
                        label={fieldDisplay.address2!.displayName}
                        value={address2}
                        disabled={validation.address2!.isDisabled}
                        required={validation.address2!.isRequired}
                        maxLength={validation.address2!.maxLength || undefined}
                        onChange={onChangeAddress2}
                        error={address2Error}
                        data-test-selector="customerAddressForm_address2"
                    />
                </GridItem>
            )}
            {fieldDisplay.address3!.isVisible && (
                <GridItem {...styles.address3GridItem}>
                    <TextField
                        {...styles.address3Text}
                        name="address3"
                        label={fieldDisplay.address3!.displayName}
                        value={address3}
                        disabled={validation.address3!.isDisabled}
                        required={validation.address3!.isRequired}
                        maxLength={validation.address3!.maxLength || undefined}
                        onChange={onChangeAddress3}
                        error={address3Error}
                        data-test-selector="customerAddressForm_address3"
                    />
                </GridItem>
            )}
            {fieldDisplay.address4!.isVisible && (
                <GridItem {...styles.address4GridItem}>
                    <TextField
                        {...styles.address4Text}
                        name="address4"
                        label={fieldDisplay.address4!.displayName}
                        value={address4}
                        disabled={validation.address4!.isDisabled}
                        required={validation.address4!.isRequired}
                        maxLength={validation.address4!.maxLength || undefined}
                        onChange={onChangeAddress4}
                        error={address4Error}
                        data-test-selector="customerAddressForm_address4"
                    />
                </GridItem>
            )}
            {fieldDisplay.country!.isVisible && countries.length > 1 && (
                <GridItem {...styles.countryGridItem}>
                    <Select
                        {...styles.countrySelect}
                        label={fieldDisplay.country!.displayName}
                        value={selectedCountry?.id || ""}
                        disabled={validation.country!.isDisabled || countries.length === 1}
                        required={validation.country!.isRequired}
                        onChange={handleCountryChange}
                        error={countryError}
                        data-test-selector="customerAddressForm_country"
                    >
                        <option value="">{translate("Select Country")}</option>
                        {countries.map(co => (
                            <option key={co.id} value={co.id}>
                                {co.name}
                            </option>
                        ))}
                    </Select>
                </GridItem>
            )}
            {fieldDisplay.city!.isVisible && (
                <GridItem {...styles.cityGridItem}>
                    <TextField
                        {...styles.cityText}
                        name="city"
                        label={fieldDisplay.city!.displayName}
                        value={city}
                        disabled={validation.city!.isDisabled}
                        required={validation.city!.isRequired}
                        maxLength={validation.city!.maxLength || undefined}
                        onChange={onChangeCity}
                        error={cityError}
                        data-test-selector="customerAddressForm_city"
                    />
                </GridItem>
            )}
            {states.length > 0 && (
                <GridItem {...styles.stateGridItem}>
                    <Select
                        {...styles.stateSelect}
                        label={fieldDisplay.state!.displayName}
                        value={state?.id || ""}
                        disabled={validation.state!.isDisabled}
                        required
                        onChange={handleStateChange}
                        error={stateError}
                        data-test-selector="customerAddressForm_state"
                    >
                        <option value="">{translate("Select State")}</option>
                        {states.map(st => (
                            <option key={st.id} value={st.id}>
                                {st.name}
                            </option>
                        ))}
                    </Select>
                </GridItem>
            )}
            {fieldDisplay.postalCode!.isVisible && (
                <GridItem {...styles.postalCodeGridItem}>
                    <TextField
                        {...styles.postalCodeText}
                        name="postalCode"
                        label={fieldDisplay.postalCode!.displayName}
                        value={postalCode}
                        disabled={validation.postalCode!.isDisabled}
                        required={validation.postalCode!.isRequired}
                        maxLength={validation.postalCode!.maxLength || undefined}
                        onChange={onChangePostalCode}
                        error={postalCodeError}
                        data-test-selector="customerAddressForm_postalCode"
                    />
                </GridItem>
            )}
            {fieldDisplay.phone!.isVisible && (
                <GridItem {...styles.phoneGridItem}>
                    <TextField
                        {...styles.phoneText}
                        name="phone"
                        label={fieldDisplay.phone!.displayName}
                        value={phone}
                        disabled={validation.phone!.isDisabled}
                        required={validation.phone!.isRequired}
                        maxLength={validation.phone!.maxLength || undefined}
                        onChange={onChangePhone}
                        error={phoneError}
                        data-test-selector="customerAddressForm_phone"
                    />
                </GridItem>
            )}
            {fieldDisplay.fax!.isVisible && (
                <GridItem {...styles.faxGridItem}>
                    <TextField
                        {...styles.faxText}
                        name="fax"
                        label={fieldDisplay.fax!.displayName}
                        value={fax}
                        disabled={validation.fax!.isDisabled}
                        required={validation.fax!.isRequired}
                        maxLength={validation.fax!.maxLength || undefined}
                        onChange={onChangeFax}
                        error={faxError}
                        data-test-selector="customerAddressForm_fax"
                    />
                </GridItem>
            )}
            {fieldDisplay.email!.isVisible && (
                <GridItem {...styles.emailGridItem}>
                    <TextField
                        {...styles.emailText}
                        name="email"
                        label={fieldDisplay.email!.displayName}
                        value={email}
                        disabled={validation.email!.isDisabled}
                        required={validation.email!.isRequired}
                        maxLength={validation.email!.maxLength || undefined}
                        onChange={onChangeEmail}
                        error={emailError}
                        data-test-selector="customerAddressForm_email"
                    />
                </GridItem>
            )}
        </GridContainer>
    );
};

export default CustomerAddressFormFields;
