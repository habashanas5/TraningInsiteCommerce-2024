import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

export interface AddressInfoDisplayStyles {
    wrapper?: InjectableCss;
    customerNameText?: TypographyProps;
    firstNameText?: TypographyProps;
    lastNameText?: TypographyProps;
    attentionText?: TypographyProps;
    companyNameText?: TypographyProps;
    address1Text?: TypographyProps;
    address2Text?: TypographyProps;
    address3Text?: TypographyProps;
    address4Text?: TypographyProps;
    cityStatePostalCodeText?: TypographyProps;
    cityText?: TypographyProps;
    stateText?: TypographyProps;
    postalCodeText?: TypographyProps;
    countryText?: TypographyProps;
    phoneText?: TypographyProps;
    emailText?: TypographyProps;
    faxText?: TypographyProps;
}

export const addressInfoDisplayStyles: AddressInfoDisplayStyles = {
    wrapper: {
        css: css`
            font-style: normal;
        `,
    },
    customerNameText: { as: "p" },
    attentionText: { as: "p" },
    companyNameText: { as: "p" },
    address1Text: { as: "p" },
    address2Text: { as: "p" },
    address3Text: { as: "p" },
    address4Text: { as: "p" },
    cityStatePostalCodeText: { as: "p" },
    countryText: { as: "p" },
    phoneText: { as: "p" },
    emailText: { as: "p" },
    faxText: { as: "p" },
};

interface OwnProps {
    firstName?: string;
    lastName?: string;
    companyName?: string;
    attention?: string;
    address1: string;
    address2?: string;
    address3?: string;
    address4?: string;
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
    phone?: string;
    fax?: string;
    email?: string;
    extendedStyles?: AddressInfoDisplayStyles;
}

type Props = OwnProps;

const StyledAddress = getStyledWrapper("address");

const AddressInfoDisplay: React.FunctionComponent<Props> = function Address(props: Props) {
    const [styles] = React.useState(() => mergeToNew(addressInfoDisplayStyles, props.extendedStyles));
    return (
        <StyledAddress {...styles.wrapper}>
            <FullName firstName={props.firstName} lastName={props.lastName} styles={styles} />
            {props.attention && (
                <Typography {...styles.attentionText} data-test-selector="addressInfoDisplay_attention">
                    {translate("Attn:")} {props.attention}
                </Typography>
            )}
            {props.companyName && (
                <Typography {...styles.companyNameText} data-test-selector="addressInfoDisplay_companyName">
                    {props.companyName}
                </Typography>
            )}
            <Typography {...styles.address1Text} data-test-selector="addressInfoDisplay_address1">
                {props.address1}
            </Typography>
            {props.address2 && (
                <Typography {...styles.address2Text} data-test-selector="addressInfoDisplay_address2">
                    {props.address2}
                </Typography>
            )}
            {props.address3 && (
                <Typography {...styles.address3Text} data-test-selector="addressInfoDisplay_address3">
                    {props.address3}
                </Typography>
            )}
            {props.address4 && (
                <Typography {...styles.address4Text} data-test-selector="addressInfoDisplay_address4">
                    {props.address4}
                </Typography>
            )}
            <CityStatePostalCode city={props.city} state={props.state} postalCode={props.postalCode} styles={styles} />
            {props.country && (
                <Typography {...styles.countryText} data-test-selector="addressInfoDisplay_country">
                    {props.country}
                </Typography>
            )}
            {props.phone && (
                <Typography {...styles.phoneText} data-test-selector="addressInfoDisplay_phoneNumber">
                    {props.phone}
                </Typography>
            )}
            {props.fax && (
                <Typography {...styles.faxText} data-test-selector="addressInfoDisplay_fax">
                    {props.fax}
                </Typography>
            )}
            {props.email && (
                <Typography {...styles.emailText} data-test-selector="addressInfoDisplay_emailAddress">
                    {props.email}
                </Typography>
            )}
        </StyledAddress>
    );
};

interface FullNameProps {
    firstName?: string;
    lastName?: string;
    styles: AddressInfoDisplayStyles;
}

const FullName = ({ firstName, lastName, styles }: FullNameProps) => {
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    if (!fullName) {
        return null;
    }
    return (
        <Typography {...styles.customerNameText}>
            {firstName && (
                <Typography {...styles.firstNameText} data-test-selector="addressInfoDisplay_firstName">
                    {`${firstName} `}
                </Typography>
            )}
            {lastName && (
                <Typography {...styles.lastNameText} data-test-selector="addressInfoDisplay_lastName">
                    {lastName}
                </Typography>
            )}
        </Typography>
    );
};

interface CityStatePostalCodeProps {
    city: string;
    state?: string;
    postalCode: string;
    styles: AddressInfoDisplayStyles;
}

const CityStatePostalCode = ({ city, state, postalCode, styles }: CityStatePostalCodeProps) => {
    return (
        <Typography {...styles.cityStatePostalCodeText}>
            <Typography {...styles.cityText} data-test-selector="addressInfoDisplay_city">
                {city}
            </Typography>
            {state && (
                <>
                    {", "}
                    <Typography {...styles.stateText} data-test-selector="addressInfoDisplay_state">
                        {state}
                    </Typography>
                </>
            )}
            {postalCode && (
                <>
                    {" "}
                    <Typography {...styles.postalCodeText} data-test-selector="addressInfoDisplay_postalCode">
                        {postalCode}
                    </Typography>
                </>
            )}
        </Typography>
    );
};

export default AddressInfoDisplay;
