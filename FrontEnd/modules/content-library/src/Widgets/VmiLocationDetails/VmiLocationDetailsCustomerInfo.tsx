import { VmiLocationStateContext } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressInfoDisplay from "@insite/content-library/Components/AddressInfoDisplay";
import { VmiLocationDetailsPageContext } from "@insite/content-library/Pages/VmiLocationDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useContext } from "react";
import { css } from "styled-components";

export interface VmiLocationCustomerInfoStyles {
    container?: GridContainerProps;
    addressInfoDisplayGridItem?: GridItemProps;
    addressInfoHeadingGridItem?: GridItemProps;
    addressInfoHeadingText?: TypographyPresentationProps;
}

export const vmiLocationCustomerInfoStyles: VmiLocationCustomerInfoStyles = {
    container: { gap: 15 },
    addressInfoDisplayGridItem: {
        width: 12,
        css: css`
            padding-top: 0;
        `,
    },
    addressInfoHeadingGridItem: {
        width: 12,
        css: css`
            padding-bottom: 4px;
        `,
    },
    addressInfoHeadingText: { weight: "bold" },
};

const styles = vmiLocationCustomerInfoStyles;

const VmiLocationDetailsCustomerInfo = () => {
    const { value: vmiLocation } = useContext(VmiLocationStateContext);
    if (!vmiLocation?.customer) {
        return null;
    }

    const customer = vmiLocation.customer;

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.addressInfoHeadingGridItem}>
                    <Typography {...styles.addressInfoHeadingText}>{translate("Address")}</Typography>
                </GridItem>
                <GridItem {...styles.addressInfoDisplayGridItem}>
                    <AddressInfoDisplay
                        firstName={customer.firstName}
                        lastName={customer.lastName}
                        companyName={customer.companyName}
                        attention={customer.attention}
                        address1={customer.address1}
                        address2={customer.address2}
                        address3={customer.address3}
                        address4={customer.address4}
                        city={customer.city}
                        state={customer.state ? customer.state.abbreviation : undefined}
                        postalCode={customer.postalCode}
                        country={customer.country ? customer.country.abbreviation : undefined}
                        phone={customer.phone}
                        fax={customer.fax}
                        email={customer.email}
                    />
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: VmiLocationDetailsCustomerInfo,
    definition: {
        allowedContexts: [VmiLocationDetailsPageContext],
        group: "VMI Location Details",
    },
};

export default widgetModule;
