import { createWidgetElement } from "@insite/client-framework/Components/ContentItemStore";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentEditingUser, hasChanges } from "@insite/client-framework/Store/Pages/UserSetup/UserSetupSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { UserSetupPageContext } from "@insite/content-library/Pages/UserSetupPage";
import AssignShipToAddressModal from "@insite/content-library/Widgets/UserSetup/AssignShipToAddressModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import React, { useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    editingUser: getCurrentEditingUser(state),
    disableSaveButton:
        !hasChanges(state) ||
        !!state.pages.userSetup.emailErrorMessage ||
        !!state.pages.userSetup.firstNameErrorMessage ||
        !!state.pages.userSetup.lastNameErrorMessage,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface UserSetupHeaderStyles {
    container?: GridContainerProps;
    titleGridItem?: GridItemProps;
    emptyGridItem?: GridItemProps;
    actionsGridItem?: GridItemProps;
    actionButtonsHidden?: HiddenProps;
    assignShipToAddressButton?: ButtonPresentationProps;
    saveButton?: ButtonPresentationProps;
    overflowMenu?: OverflowMenuPresentationProps;
    overflowMenuClickables?: ClickablePresentationProps;
    overflowMenuSaveClickableHidden?: HiddenProps;
}

export const userSetupHeaderStyles: UserSetupHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 20px;
        `,
    },
    titleGridItem: {
        width: [10, 10, 8, 7, 7],
    },
    actionsGridItem: {
        width: [2, 2, 4, 5, 5],
        css: css`
            justify-content: flex-end;
        `,
    },
    assignShipToAddressButton: {
        variant: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
};

const styles = userSetupHeaderStyles;

const UserSetupHeader = ({ editingUser, disableSaveButton }: Props) => {
    const [isAssignShipToAddressModalOpen, setIsAssignShipToAddressModalOpen] = useState(false);
    if (!editingUser) {
        return null;
    }

    const assignShipToAddressClickHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        setIsAssignShipToAddressModalOpen(true);
    };

    const assignShipToAddressModalCloseHandler = () => setIsAssignShipToAddressModalOpen(false);

    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.titleGridItem}>
                    {createWidgetElement("Basic/PageTitle", {
                        fields: { overrideTitle: `${translate("Edit User")} - ${editingUser.userName}` },
                    })}
                </GridItem>
                <GridItem {...styles.actionsGridItem}>
                    <Hidden {...styles.actionButtonsHidden} below="lg">
                        <Button
                            {...styles.assignShipToAddressButton}
                            type="button"
                            onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                                assignShipToAddressClickHandler(event)
                            }
                            data-test-selector="tst_userSetup_assignShipToAddress"
                        >
                            {translate("Assign Ship To Address")}
                        </Button>
                    </Hidden>
                    <Hidden {...styles.actionButtonsHidden} below="md">
                        <Button
                            {...styles.saveButton}
                            type="submit"
                            disabled={disableSaveButton}
                            data-test-selector="tst_userSetupHeader_saveButton"
                        >
                            {translate("Save")}
                        </Button>
                    </Hidden>
                    <Hidden {...styles.actionButtonsHidden} above="md">
                        <OverflowMenu position="end" {...styles.overflowMenu}>
                            <Clickable
                                {...styles.overflowMenuClickables}
                                onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) =>
                                    assignShipToAddressClickHandler(event)
                                }
                            >
                                {translate("Assign Ship To Address")}
                            </Clickable>
                            <Hidden {...styles.overflowMenuSaveClickableHidden} above="sm">
                                <Clickable
                                    {...styles.overflowMenuClickables}
                                    type="submit"
                                    disabled={disableSaveButton}
                                    onClick={() => {}}
                                >
                                    {translate("Save")}
                                </Clickable>
                            </Hidden>
                        </OverflowMenu>
                    </Hidden>
                </GridItem>
            </GridContainer>
            <AssignShipToAddressModal
                isModalOpen={isAssignShipToAddressModalOpen}
                closeModalHandler={assignShipToAddressModalCloseHandler}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(UserSetupHeader),
    definition: {
        group: "User Setup",
        displayName: "Header",
        allowedContexts: [UserSetupPageContext],
    },
};

export default widgetModule;
