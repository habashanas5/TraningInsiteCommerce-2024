import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import removeVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/RemoveVmiLocations";
import {
    isVmiAdmin,
    VmiLocationsDataViewContext,
} from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { LocationsPageContext } from "@insite/content-library/Pages/VmiLocationsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        getVmiLocationsParameter: state.pages.vmiLocations.getVmiLocationsParameter,
        selectedIds: state.pages.vmiLocations.selectedVmiLocations,
        isRemoving: state.data.vmiLocations.isRemoving,
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
    };
};

const mapDispatchToProps = {
    removeVmiLocations,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps;

export interface OrderHistoryHeaderStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    removeLink?: LinkPresentationProps;
    locationsCountText?: TypographyPresentationProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
}

export const headerStyles: OrderHistoryHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding: 20px 0;
        `,
    },
    gridItem: {
        width: 12,
        css: css`
            > * {
                padding-right: 10px;
            }
        `,
    },
    twoButtonModalStyles: {
        submitButton: {
            color: "primary",
        },
    },
};
const styles = headerStyles;

const VmiLocationsActions = ({ selectedIds, removeVmiLocations, isRemoving, isVmiAdmin }: Props) => {
    const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);

    const vmiLocationsDataView = useContext(VmiLocationsDataViewContext);

    if (!vmiLocationsDataView.value || !vmiLocationsDataView.pagination) {
        return null;
    }

    const { totalItemCount } = vmiLocationsDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const handleRemoveButtonClick = () => {
        setRemoveModalIsOpen(true);
    };

    const handleCancelModalButtonClick = () => {
        setRemoveModalIsOpen(false);
    };

    const handleDeleteModalButtonClick = () => {
        setRemoveModalIsOpen(false);
        removeVmiLocations({
            ids: Object.keys(selectedIds),
        });
    };

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.gridItem}>
                    <Typography {...styles.locationsCountText}>
                        {totalItemCount} {translate("Locations")}
                    </Typography>
                    {isVmiAdmin && (
                        <Link
                            {...styles.removeLink}
                            disabled={isRemoving || Object.keys(selectedIds).length === 0}
                            onClick={handleRemoveButtonClick}
                        >
                            {translate("Remove")}
                        </Link>
                    )}
                </GridItem>
            </GridContainer>
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
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiLocationsActions),
    definition: {
        group: "VMI Locations",
        allowedContexts: [LocationsPageContext],
    },
};

export default widgetModule;
