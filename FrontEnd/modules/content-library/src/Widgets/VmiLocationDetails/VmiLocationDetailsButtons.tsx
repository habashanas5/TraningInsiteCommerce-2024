import {
    defaultVmiLocationGetShipTosApiParameter,
    GetShipTosApiParameter,
} from "@insite/client-framework/Services/CustomersService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import removeVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/RemoveVmiLocations";
import {
    isVmiAdmin,
    VmiLocationStateContext,
} from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { VmiLocationDetailsPageContext } from "@insite/content-library/Pages/VmiLocationDetailsPage";
import VmiLocationDetailsAddProductModal from "@insite/content-library/Widgets/VmiLocationDetails/VmiLocationDetailsAddProductModal";
import AddVmiLocationModal from "@insite/content-library/Widgets/VmiLocations/AddVmiLocationModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        vmiLocationsPageUrl: getPageLinkByPageType(state, "VmiLocationsPage")?.url,
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
        billToId: session.billToId,
    };
};

const mapDispatchToProps = {
    removeVmiLocations,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface VmiLocationDetailsButtonsStyles {
    gridContainer?: GridContainerProps;
    buttonsGridItem?: GridItemProps;
    overflowMenu?: OverflowMenuPresentationProps;
    menuButton?: ButtonPresentationProps;
    menuButtonOverflowMenu?: OverflowMenuPresentationProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
}

export const vmiLocationDetailsButtonsStyles: VmiLocationDetailsButtonsStyles = {
    buttonsGridItem: {
        width: [6, 6, 6, 12, 12],
        css: css`
            display: flex;
            justify-content: flex-end;
            nav {
                display: inline-block;
            }
        `,
    },
    menuButton: {
        css: css`
            margin: 5px;
            white-space: nowrap;
        `,
    },
    twoButtonModalStyles: {
        submitButton: {
            color: "primary",
        },
    },
};

const styles = vmiLocationDetailsButtonsStyles;

const VmiLocationDetailsButtons = ({
    history,
    vmiLocationsPageUrl,
    isVmiAdmin,
    removeVmiLocations,
    billToId,
}: Props) => {
    const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
    const [addProductModalOpen, setAddProductModalOpen] = useState(false);
    const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
    const [locationId, setLocationId] = useState<string | undefined>(undefined);
    const [shipTosParameter, setShipTosParameter] = useState(defaultVmiLocationGetShipTosApiParameter(billToId));

    const { value: vmiLocation } = useContext(VmiLocationStateContext);
    if (!vmiLocation) {
        return null;
    }

    const addProductBinClickHandler = () => {
        setAddProductModalOpen(true);
    };

    const editLocationClickHandler = (id: string) => {
        setIsAddLocationModalOpen(true);
        setLocationId(id);
    };

    const deleteLocationClickHandler = () => {
        setRemoveModalIsOpen(true);
    };

    const handleCancelModalButtonClick = () => {
        setRemoveModalIsOpen(false);
    };

    const handleDeleteModalButtonClick = () => {
        setRemoveModalIsOpen(false);
        removeVmiLocations({
            ids: [vmiLocation.id],
            onComplete: () => {
                if (vmiLocationsPageUrl) {
                    history.push(vmiLocationsPageUrl);
                }
            },
        });
    };

    const onSuccessAddProductModal = () => {
        setAddProductModalOpen(false);
    };

    const onCloseAddProductModal = () => {
        setAddProductModalOpen(false);
    };

    const onSuccessAddLocationModal = () => {
        setIsAddLocationModalOpen(false);
    };

    const onCloseAddLocationModal = () => {
        setIsAddLocationModalOpen(false);
    };

    const setShipTosParameterFunc = (parameter: GetShipTosApiParameter) => {
        setShipTosParameter(parameter);
    };

    return (
        <>
            {isVmiAdmin && (
                <GridContainer {...styles.gridContainer}>
                    <GridItem {...styles.buttonsGridItem}>
                        <Hidden above="sm">
                            <OverflowMenu position="end" {...styles.overflowMenu}>
                                <Clickable onClick={addProductBinClickHandler}>
                                    {translate("Add Product/Bin")}
                                </Clickable>
                                <Clickable onClick={() => editLocationClickHandler(vmiLocation.id)}>
                                    {translate("Edit Location")}
                                </Clickable>
                                <Clickable onClick={deleteLocationClickHandler}>
                                    {translate("Delete Location")}
                                </Clickable>
                            </OverflowMenu>
                        </Hidden>
                        <Hidden below="md">
                            <Button {...styles.menuButton} onClick={addProductBinClickHandler}>
                                {translate("Add Product/Bin")}
                            </Button>
                            <OverflowMenu position="end" {...styles.menuButtonOverflowMenu}>
                                <Clickable onClick={() => editLocationClickHandler(vmiLocation.id)}>
                                    {translate("Edit Location")}
                                </Clickable>
                                <Clickable onClick={deleteLocationClickHandler}>
                                    {translate("Delete Location")}
                                </Clickable>
                            </OverflowMenu>
                        </Hidden>
                    </GridItem>
                </GridContainer>
            )}
            <TwoButtonModal
                modalIsOpen={removeModalIsOpen}
                headlineText={translate("Delete Location")}
                messageText={translate("This will delete all information assigned to this location")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                extendedStyles={styles.twoButtonModalStyles}
                onCancel={handleCancelModalButtonClick}
                onSubmit={handleDeleteModalButtonClick}
            ></TwoButtonModal>
            <VmiLocationDetailsAddProductModal
                isOpen={addProductModalOpen}
                onSuccess={onSuccessAddProductModal}
                onClose={onCloseAddProductModal}
            ></VmiLocationDetailsAddProductModal>
            <AddVmiLocationModal
                isOpen={isAddLocationModalOpen}
                editLocationId={locationId}
                onSuccess={onSuccessAddLocationModal}
                onClose={onCloseAddLocationModal}
                shipTosParameter={shipTosParameter}
                setShipTosParameter={setShipTosParameterFunc}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(VmiLocationDetailsButtons)),
    definition: {
        group: "VMI Location Details",
        allowedContexts: [VmiLocationDetailsPageContext],
    },
};

export default widgetModule;
