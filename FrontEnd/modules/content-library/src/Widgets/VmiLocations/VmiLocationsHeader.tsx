import {
    defaultVmiLocationGetShipTosApiParameter,
    GetShipTosApiParameter,
} from "@insite/client-framework/Services/CustomersService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { isVmiAdmin } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { LocationsPageContext } from "@insite/content-library/Pages/VmiLocationsPage";
import AddVmiLocationModal from "@insite/content-library/Widgets/VmiLocations/AddVmiLocationModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        billToId: session.billToId,
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
    };
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface VmiLocationsHeaderStyles {
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    titleText?: TypographyPresentationProps;
    overflowMenu?: OverflowMenuPresentationProps;
    addLocationButton?: ButtonPresentationProps;
}

export const headerStyles: VmiLocationsHeaderStyles = {
    titleGridItem: {
        width: [11, 9, 7, 5, 6],
    },
    buttonsGridItem: {
        width: [1, 3, 5, 7, 6],
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    titleText: {
        variant: "h2",
    },
};

const styles = headerStyles;

class VmiLocationsHeader extends Component<
    Props,
    { isAddLocationModalOpen: boolean; shipTosParameter: GetShipTosApiParameter }
> {
    state = {
        isAddLocationModalOpen: false,
        shipTosParameter: defaultVmiLocationGetShipTosApiParameter(this.props.billToId),
    };

    addLocationClickHandler = () => {
        this.setState({ isAddLocationModalOpen: true });
    };

    onSuccessAddLocationModal = () => {
        this.setState({ isAddLocationModalOpen: false });
    };

    onCloseAddLocationModal = () => {
        this.setState({ isAddLocationModalOpen: false });
    };

    setShipTosParameter = (parameter: GetShipTosApiParameter) => {
        this.setState({ shipTosParameter: parameter });
    };

    render() {
        return (
            <>
                <GridContainer {...styles.gridContainer}>
                    <GridItem {...styles.titleGridItem}>
                        <Typography as="h2" {...styles.titleText}>
                            {translate("Locations")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.buttonsGridItem}>
                        {this.props.isVmiAdmin && (
                            <>
                                <Hidden above="sm">
                                    <OverflowMenu position="end" {...styles.overflowMenu}>
                                        <Clickable onClick={this.addLocationClickHandler}>
                                            {translate("Add Location")}
                                        </Clickable>
                                    </OverflowMenu>
                                </Hidden>
                                <Hidden below="md">
                                    <Button {...styles.addLocationButton} onClick={this.addLocationClickHandler}>
                                        {translate("Add Location")}
                                    </Button>
                                </Hidden>
                            </>
                        )}
                    </GridItem>
                </GridContainer>
                <AddVmiLocationModal
                    isOpen={this.state.isAddLocationModalOpen}
                    onSuccess={this.onSuccessAddLocationModal}
                    onClose={this.onCloseAddLocationModal}
                    shipTosParameter={this.state.shipTosParameter}
                    setShipTosParameter={this.setShipTosParameter}
                />
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(VmiLocationsHeader),
    definition: {
        group: "VMI Locations",
        allowedContexts: [LocationsPageContext],
    },
};

export default widgetModule;
