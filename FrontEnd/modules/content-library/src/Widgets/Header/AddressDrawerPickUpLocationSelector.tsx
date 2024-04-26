import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import changePickUpWarehouse from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/ChangePickUpWarehouse";
import translate from "@insite/client-framework/Translate";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import FindLocationModal, { FindLocationModalStyles } from "@insite/content-library/Components/FindLocationModal";
import WarehouseAddressInfoDisplay, {
    WarehouseAddressInfoDisplayStyles,
} from "@insite/content-library/Components/WarehouseAddressInfoDisplay";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    fulfillmentMethod: state.components.addressDrawer.fulfillmentMethod,
    pickUpWarehouse: state.components.addressDrawer.pickUpWarehouse,
});

const mapDispatchToProps = {
    changePickUpWarehouse,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AddressDrawerPickUpLocationSelectorStyles {
    wrapper?: InjectableCss;
    headerText?: TypographyPresentationProps;
    changeLink?: LinkPresentationProps;
    warehouseAddress?: WarehouseAddressInfoDisplayStyles;
    findLocationModal?: FindLocationModalStyles;
}

export const addressDrawerPickUpLocationSelectorStyles: AddressDrawerPickUpLocationSelectorStyles = {
    headerText: {
        weight: 600,
    },
    changeLink: {
        css: css`
            margin-left: 15px;
        `,
    },
};

const styles = addressDrawerPickUpLocationSelectorStyles;

const AddressDrawerPickUpLocationSelector = ({ fulfillmentMethod, pickUpWarehouse, changePickUpWarehouse }: Props) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const handleChangeLocationClick = () => {
        setIsModalOpen(true);
    };
    const handleModalClose = () => setIsModalOpen(false);
    const handleWarehouseSelected = (warehouse: WarehouseModel) => {
        changePickUpWarehouse({ warehouse });
        setIsModalOpen(false);
    };

    return (
        <>
            <StyledWrapper
                id="addressDrawerPickUpLocationSelector"
                role="region"
                aria-live="polite"
                data-test-selector="changeCustomer_pickUpLocation"
                {...styles.wrapper}
            >
                {fulfillmentMethod === FulfillmentMethod.PickUp ? (
                    <>
                        <Typography {...styles.headerText}>{translate("Pick Up Address")}</Typography>
                        <Link
                            onClick={handleChangeLocationClick}
                            data-test-selector="changeCustomer_pickUpLocation_findLocation"
                            {...styles.changeLink}
                        >
                            {translate("Find Location")}
                        </Link>
                        {pickUpWarehouse && (
                            <WarehouseAddressInfoDisplay
                                warehouse={pickUpWarehouse}
                                extendedStyles={styles.warehouseAddress}
                            />
                        )}
                    </>
                ) : (
                    <></>
                )}
            </StyledWrapper>
            <FindLocationModal
                modalIsOpen={isModalOpen}
                onWarehouseSelected={handleWarehouseSelected}
                onModalClose={handleModalClose}
                extendedStyles={styles.findLocationModal}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AddressDrawerPickUpLocationSelector),
    definition: {
        group: "Header",
    },
};

export default widgetModule;
