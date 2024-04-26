import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { BillToModel, CountryModel, StateModel } from "@insite/client-framework/Types/ApiModels";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

interface OwnProps {
    useBillTo: boolean;
    onUseBillToChange: (event: React.SyntheticEvent<Element, Event>, value: boolean) => void;
    billTo: BillToModel | undefined;
    address1: string;
    address1Ref?: React.Ref<HTMLInputElement>;
    onAddress1Change: (event: React.ChangeEvent<HTMLInputElement>) => void;
    address1Error?: string;
    country: string;
    countryRef?: React.Ref<HTMLSelectElement>;
    onCountryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    countryError?: string;
    state: string;
    stateRef?: React.Ref<HTMLSelectElement>;
    onStateChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    stateError?: string;
    city: string;
    cityRef?: React.Ref<HTMLInputElement>;
    onCityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cityError?: string;
    postalCode: string;
    postalCodeRef?: React.Ref<HTMLInputElement>;
    onPostalCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    postalCodeError?: string;
    availableCountries: CountryModel[];
    availableStates?: StateModel[] | null;
    extendedStyles?: CreditCardBillingAddressEntryStyles;
}

export interface CreditCardBillingAddressEntryStyles {
    container?: GridContainerProps;
    headingGridItem?: GridItemProps;
    heading?: TypographyPresentationProps;
    useBillingAddressGridItem?: GridItemProps;
    useBillingAddressCheckboxGroup?: CheckboxGroupComponentProps;
    useBillingAddressCheckbox?: CheckboxPresentationProps;
    billingAddressGridItem?: GridItemProps;
    billingAddressLabel?: TypographyPresentationProps;
    billingAddress?: AddressInfoDisplayStyles;
    address1GridItem?: GridItemProps;
    address1Text?: TextFieldPresentationProps;
    countryGridItem?: GridItemProps;
    countrySelect?: SelectPresentationProps;
    stateGridItem?: GridItemProps;
    stateSelect?: SelectPresentationProps;
    cityGridItem?: GridItemProps;
    cityText?: TextFieldPresentationProps;
    postalCodeGridItem?: GridItemProps;
    postalCodeText?: TextFieldPresentationProps;
}

export const creditCardBillingAddressEntryStyles: CreditCardBillingAddressEntryStyles = {
    container: { gap: 10 },
    headingGridItem: { width: 12 },
    heading: { variant: "h5" },
    useBillingAddressGridItem: { width: 12 },
    billingAddressGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    billingAddressLabel: { weight: 600 },
    address1GridItem: { width: 12 },
    countryGridItem: { width: 12 },
    stateGridItem: { width: 12 },
    cityGridItem: { width: 12 },
    postalCodeGridItem: { width: 12 },
};

const CreditCardBillingAddressEntry = ({
    useBillTo,
    billTo,
    extendedStyles,
    onUseBillToChange,
    address1,
    address1Ref,
    onAddress1Change,
    address1Error,
    country,
    countryRef,
    onCountryChange,
    countryError,
    availableCountries,
    state,
    stateRef,
    onStateChange,
    stateError,
    availableStates,
    city,
    cityRef,
    onCityChange,
    cityError,
    postalCode,
    postalCodeRef,
    onPostalCodeChange,
    postalCodeError,
}: OwnProps) => {
    const [styles] = React.useState(() => mergeToNew(creditCardBillingAddressEntryStyles, extendedStyles));

    if (!billTo) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.heading} as="h2">
                    {translate("Credit Card Address")}
                </Typography>
            </GridItem>
            <GridItem {...styles.useBillingAddressGridItem}>
                <CheckboxGroup {...styles.useBillingAddressCheckboxGroup}>
                    <Checkbox
                        {...styles.useBillingAddressCheckbox}
                        checked={useBillTo}
                        onChange={onUseBillToChange}
                        data-test-selector="checkoutReviewAndSubmit_useBillingAddress"
                    >
                        {translate("Use Billing Address")}
                    </Checkbox>
                </CheckboxGroup>
            </GridItem>
            {useBillTo ? (
                <GridItem {...styles.billingAddressGridItem}>
                    <Typography {...styles.billingAddressLabel}>{translate("Billing Address")}</Typography>
                    <AddressInfoDisplay
                        {...billTo}
                        state={billTo.state?.name}
                        country={billTo.country?.name}
                        extendedStyles={styles.billingAddress}
                    />
                </GridItem>
            ) : (
                <>
                    <GridItem {...styles.address1GridItem}>
                        <TextField
                            {...styles.address1Text}
                            label={translate("Address")}
                            value={address1}
                            onChange={onAddress1Change}
                            required
                            maxLength={30}
                            error={address1Error}
                            data-test-selector="checkoutReviewAndSubmit_creditCardBillingAddress1"
                            ref={address1Ref}
                        />
                    </GridItem>
                    <GridItem {...styles.countryGridItem}>
                        <Select
                            {...styles.countrySelect}
                            label={translate("Country")}
                            value={country}
                            onChange={onCountryChange}
                            required
                            error={countryError}
                            data-test-selector="checkoutReviewAndSubmit_creditCardBillingCountry"
                            ref={countryRef}
                        >
                            <option value="">{translate("Select Country")}</option>
                            {availableCountries.map(country => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem {...styles.stateGridItem}>
                        <Select
                            {...styles.stateSelect}
                            label={translate("State")}
                            value={state}
                            onChange={onStateChange}
                            required
                            error={stateError}
                            data-test-selector="checkoutReviewAndSubmit_creditCardBillingState"
                            ref={stateRef}
                        >
                            <option value="">{translate("Select State")}</option>
                            {availableStates?.map(state => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
                                </option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem {...styles.cityGridItem}>
                        <TextField
                            {...styles.cityText}
                            label={translate("City")}
                            value={city}
                            onChange={onCityChange}
                            required
                            maxLength={30}
                            error={cityError}
                            data-test-selector="checkoutReviewAndSubmit_creditCardBillingCity"
                            ref={cityRef}
                        />
                    </GridItem>
                    <GridItem {...styles.postalCodeGridItem}>
                        <TextField
                            {...styles.postalCodeText}
                            label={translate("Postal Code")}
                            value={postalCode}
                            onChange={onPostalCodeChange}
                            required
                            maxLength={30}
                            error={postalCodeError}
                            data-test-selector="checkoutReviewAndSubmit_creditCardBillingPostalCode"
                            ref={postalCodeRef}
                        />
                    </GridItem>
                </>
            )}
        </GridContainer>
    );
};

export default CreditCardBillingAddressEntry;
