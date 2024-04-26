/* eslint-disable spire/export-styles */
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressInfoDisplay, { AddressInfoDisplayStyles } from "@insite/content-library/Components/AddressInfoDisplay";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    return {
        billTo: getBillToState(state, session.billToId).value,
        shipTo: getShipToState(state, session.shipToId).value,
    };
};

type Props = ReturnType<typeof mapStateToProps>;

interface AddressDrawerPunchOutCustomerStyles {
    container?: GridContainerProps;
    customerGridItem?: GridItemProps;
    shipToGridItem?: GridItemProps;
    customerHeadingText?: TypographyPresentationProps;
    customerNumberText?: TypographyPresentationProps;
    shipToHeadingText?: TypographyPresentationProps;
    addressInfoDisplay?: AddressInfoDisplayStyles;
}

export const addressDrawerPunchOutCustomerStyles: AddressDrawerPunchOutCustomerStyles = {
    customerGridItem: {
        width: [12, 12, 12, 3, 3],
        css: css`
            flex-direction: column;
        `,
    },
    customerHeadingText: {
        transform: "uppercase",
        weight: 600,
        css: css`
            padding-bottom: 10px;
        `,
    },
    customerNumberText: {},
    shipToGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css`
            flex-direction: column;
        `,
    },
    shipToHeadingText: {
        transform: "uppercase",
        weight: 600,
        css: css`
            padding-bottom: 10px;
        `,
    },
};

const styles = addressDrawerPunchOutCustomerStyles;

const AddressDrawerPunchOutCustomer = ({ billTo, shipTo }: Props) => {
    if (!billTo || !shipTo) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.customerGridItem}>
                <Typography {...styles.customerHeadingText}>{translate("Customer")}</Typography>
                <Typography {...styles.customerNumberText}>{billTo.customerNumber}</Typography>
            </GridItem>
            <GridItem {...styles.shipToGridItem}>
                <Typography {...styles.shipToHeadingText}>{translate("Ship To")}</Typography>
                <AddressInfoDisplay
                    {...billTo}
                    state={billTo.state?.abbreviation}
                    country={billTo.country?.abbreviation}
                    extendedStyles={styles.addressInfoDisplay}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(AddressDrawerPunchOutCustomer),
    definition: {
        displayName: "Punch Out Address",
        fieldDefinitions: [],
        group: "Header",
    },
};

export default widgetModule;
