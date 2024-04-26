import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

export interface AddressInfoCondensedDisplayStyles {
    wrapper?: InjectableCss;
    addressText?: TypographyProps;
    cityStatePostalCodeText?: TypographyProps;
    countryText?: TypographyProps;
}

export const addressInfoCondensedDisplayStyles: AddressInfoCondensedDisplayStyles = {
    wrapper: {
        css: css`
            font-style: normal;
        `,
    },
    addressText: { as: "p" },
    cityStatePostalCodeText: { as: "p" },
    countryText: { as: "p" },
};

interface OwnProps {
    address1: string;
    address2?: string;
    address3?: string;
    address4?: string;
    city: string;
    state?: string;
    postalCode: string;
    country?: string;
    extendedStyles?: AddressInfoCondensedDisplayStyles;
}

type Props = OwnProps;

const StyledAddress = getStyledWrapper("address");

const AddressInfoCondensedDisplay: React.FunctionComponent<Props> = function Address(props: Props) {
    const [styles] = React.useState(() => mergeToNew(addressInfoCondensedDisplayStyles, props.extendedStyles));
    return (
        <StyledAddress {...styles.wrapper}>
            <AddressLine
                address1={props.address1}
                address2={props.address2}
                address3={props.address3}
                address4={props.address4}
                styles={styles}
            />
            <CityStatePostalCode city={props.city} state={props.state} postalCode={props.postalCode} styles={styles} />
            {props.country && <Typography {...styles.countryText}>{props.country}</Typography>}
        </StyledAddress>
    );
};

interface CityStatePostalCodeProps {
    city: string;
    state?: string;
    postalCode: string;
    styles: AddressInfoCondensedDisplayStyles;
}

const CityStatePostalCode: React.FunctionComponent<CityStatePostalCodeProps> = function CityStatePostalCode(
    props: CityStatePostalCodeProps,
) {
    let cityStatePostalDisplay = props.city;
    if (props.state) {
        cityStatePostalDisplay += `, ${props.state}`;
    }
    if (props.postalCode) {
        cityStatePostalDisplay += ` ${props.postalCode}`;
    }
    return <Typography {...props.styles.cityStatePostalCodeText}>{cityStatePostalDisplay}</Typography>;
};

interface AddressLineProps {
    address1: string;
    address2?: string;
    address3?: string;
    address4?: string;
    styles: AddressInfoCondensedDisplayStyles;
}

const AddressLine: React.FunctionComponent<AddressLineProps> = (props: AddressLineProps) => {
    let addressLine = props.address1;
    if (props.address2) {
        addressLine += `, ${props.address2}`;
    }
    if (props.address3) {
        addressLine += `, ${props.address3}`;
    }
    if (props.address4) {
        addressLine += `, ${props.address4}`;
    }
    return <Typography {...props.styles.addressText}>{addressLine}</Typography>;
};

export default AddressInfoCondensedDisplay;
