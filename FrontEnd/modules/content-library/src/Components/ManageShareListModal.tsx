import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { ShareOptions } from "@insite/client-framework/Services/WishListService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import removeWishListShare from "@insite/client-framework/Store/Components/ManageShareListModal/Handlers/RemoveWishListShare";
import setManageShareListModalIsOpen from "@insite/client-framework/Store/Components/ManageShareListModal/Handlers/SetManageShareListModalIsOpen";
import setShareListModalIsOpen from "@insite/client-framework/Store/Components/ShareListModal/Handlers/SetShareListModalIsOpen";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import updateWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/UpdateWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import translate from "@insite/client-framework/Translate";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DataTable, { DataTablePresentationProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Radio, { RadioProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: ManageShareListModalStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    modalIsOpen: state.components.manageShareListModal.isOpen,
    wishListId: state.components.manageShareListModal.wishListId,
    wishListState: getWishListState(state, state.components.manageShareListModal.wishListId),
});

const mapDispatchToProps = {
    setManageShareListModalIsOpen,
    setShareListModalIsOpen,
    removeWishListShare,
    updateWishList: makeHandlerChainAwaitable(updateWishList),
    loadWishList,
};

export interface ManageShareListModalStyles {
    modal?: ModalPresentationProps;
    editingPermissionText?: TypographyProps;
    editingPermissionRadioGroup?: RadioGroupProps;
    editingPermissionRadio?: RadioProps;
    usersTableWrapper?: InjectableCss;
    sharedWithAllText?: TypographyProps;
    usersTableText?: TypographyProps;
    userTableHeaderText?: TypographyProps;
    inviteButton?: ButtonPresentationProps;
    userTable?: DataTablePresentationProps;
    userTableHead?: DataTableHeadProps;
    userTableHeader?: DataTableHeaderProps;
    userTableBody?: DataTableBodyProps;
    userCell?: DataTableCellProps;
    userNameText?: TypographyProps;
    userRemoveLink?: LinkPresentationProps;
    buttonsWrapper?: InjectableCss;
    makePrivateButton?: ButtonPresentationProps;
    closeButton?: ButtonPresentationProps;
    makeListPrivateModal?: TwoButtonModalStyles;
}

export const addToListModalStyles: ManageShareListModalStyles = {
    modal: {
        size: 600,
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    editingPermissionText: {
        weight: "bold",
    },
    editingPermissionRadioGroup: {
        css: css`
            display: inline-block;
            width: 100%;
            flex-direction: row;
            & > div {
                margin-right: 20px;
                display: inline-flex;
            }
        `,
    },
    sharedWithAllText: {
        css: css`
            margin-top: 15px;
            margin-bottom: 15px;
            display: block;
        `,
    },
    usersTableWrapper: {
        css: css`
            margin-top: 15px;
            margin-bottom: 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
        `,
    },
    usersTableText: {
        weight: "bold",
    },
    inviteButton: {
        variant: "secondary",
        css: css`
            margin-left: auto;
        `,
    },
    userCell: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
    userRemoveLink: {
        css: css`
            margin-left: auto;
        `,
    },
    buttonsWrapper: {
        css: css`
            margin-top: 20px;
            display: flex;
            align-items: center;
        `,
    },
    makePrivateButton: {
        variant: "secondary",
    },
    closeButton: {
        css: css`
            margin-left: auto;
        `,
    },
};

const ManageShareListModal = ({
    modalIsOpen,
    wishListId,
    wishListState,
    extendedStyles,
    setManageShareListModalIsOpen,
    setShareListModalIsOpen,
    removeWishListShare,
    updateWishList,
    loadWishList,
}: Props) => {
    const [styles] = useState(() => mergeToNew(addToListModalStyles, extendedStyles));

    const [wishList, setWishList] = useState(wishListState.value);
    const [allowEditing, setAllowEditing] = useState(wishList?.allowEdit.toString());
    useEffect(() => {
        if (!wishListState.value || typeof wishListState.value.sharedUsers === "undefined") {
            return;
        }

        setWishList(wishListState.value);
        setAllowEditing(wishListState.value.allowEdit.toString());
    }, [wishListState]);

    const [makeListPrivateModalVisible, setMakeListPrivateModalVisible] = useState(false);

    useEffect(() => {
        if (!modalIsOpen || !wishListId || wishListState.isLoading) {
            return;
        }

        if (typeof wishListState.value?.sharedUsers !== "undefined") {
            return;
        }

        loadWishList({
            wishListId,
            exclude: ["listLines"],
            expand: ["sharedUsers"],
        });
    }, [modalIsOpen, wishListState]);

    const modalCloseHandler = () => {
        setManageShareListModalIsOpen({ modalIsOpen: false });
    };

    const inviteClickHandler = () => {
        setShareListModalIsOpen({ modalIsOpen: true, wishListId, fromManage: true });
        setManageShareListModalIsOpen({ modalIsOpen: false });
    };

    const userRemoveHandler = (userId: string) => {
        if (!wishList) {
            return;
        }

        const isLastUser = wishList.sharedUsers?.length === 1;
        removeWishListShare({ wishList, userId });
        if (isLastUser) {
            setManageShareListModalIsOpen({ modalIsOpen: false });
        }
    };

    const handleMakeListPrivateClick = async () => {
        if (!wishList) {
            return;
        }

        await updateWishList({
            apiParameter: {
                wishList: {
                    ...wishList,
                    sendEmail: false,
                    shareOption: ShareOptions.Private,
                },
            },
        });
        setMakeListPrivateModalVisible(false);
        setManageShareListModalIsOpen({ modalIsOpen: false });
    };

    const handleOpenMakeListPrivateClick = () => {
        setMakeListPrivateModalVisible(true);
    };

    const handleEditingPermissionChanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!wishList) {
            return;
        }

        setAllowEditing(event.target.value);
        await updateWishList({
            apiParameter: {
                wishList: {
                    ...wishList,
                    sendEmail: false,
                    allowEdit: event.target.value === "true",
                },
            },
        });
    };

    return (
        <Modal
            {...styles.modal}
            headline={translate("Manage Sharing")}
            isOpen={modalIsOpen}
            handleClose={modalCloseHandler}
        >
            <Typography data-test-selector="productAddToListModal_requireSignIn" {...styles.editingPermissionText}>
                {translate("Editing Permission")}
            </Typography>
            <RadioGroup
                value={allowEditing}
                onChangeHandler={event => {
                    handleEditingPermissionChanged(event);
                }}
                {...styles.editingPermissionRadioGroup}
            >
                <Radio value="true" {...styles.editingPermissionRadio} disabled={wishListState.isLoading}>
                    {translate("Allow Editing")}
                </Radio>
                <Radio value="false" {...styles.editingPermissionRadio} disabled={wishListState.isLoading}>
                    {translate("View Only")}
                </Radio>
            </RadioGroup>
            {wishList?.shareOption === ShareOptions.AllCustomerUsers && (
                <Typography {...styles.sharedWithAllText}>
                    {translate("Shared with all users on billing account.")}
                </Typography>
            )}
            {wishList && wishList.shareOption !== ShareOptions.AllCustomerUsers && (
                <StyledWrapper {...styles.usersTableWrapper}>
                    <Typography {...styles.usersTableText}>{translate("Users Shared With")}</Typography>
                    <Button {...styles.inviteButton} disabled={wishListState.isLoading} onClick={inviteClickHandler}>
                        {translate("Invite User")}
                    </Button>
                </StyledWrapper>
            )}
            {wishList && wishList.shareOption !== ShareOptions.AllCustomerUsers && (
                <DataTable {...styles.userTable}>
                    <DataTableHead {...styles.userTableHead}>
                        <DataTableHeader {...styles.userTableHeader} title={translate("User")}>
                            <Typography {...styles.userTableHeaderText}>{translate("User")}</Typography>
                        </DataTableHeader>
                    </DataTableHead>
                    <DataTableBody {...styles.userTableBody}>
                        {wishList.sharedUsers?.map(({ id, displayName }) => (
                            <DataTableRow key={id}>
                                <DataTableCell {...styles.userCell}>
                                    <Typography {...styles.userNameText}>{displayName || id}</Typography>
                                    <Link
                                        {...styles.userRemoveLink}
                                        disabled={wishListState.isLoading}
                                        onClick={() => userRemoveHandler(id)}
                                    >
                                        {translate("Remove")}
                                    </Link>
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            )}
            <StyledWrapper {...styles.buttonsWrapper}>
                <Button
                    {...styles.makePrivateButton}
                    disabled={wishListState.isLoading}
                    onClick={handleOpenMakeListPrivateClick}
                >
                    {translate("Make List Private")}
                </Button>
                <Button {...styles.closeButton} disabled={wishListState.isLoading} onClick={() => modalCloseHandler()}>
                    {translate("Done")}
                </Button>
                <TwoButtonModal
                    {...styles.makeListPrivateModal}
                    headlineText={translate("Make List Private")}
                    messageText={siteMessage("Lists_Shared_Users_Will_No_Longer_Have_Access")}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Make List Private")}
                    modalIsOpen={makeListPrivateModalVisible}
                    onCancel={() => setMakeListPrivateModalVisible(false)}
                    onSubmit={handleMakeListPrivateClick}
                />
            </StyledWrapper>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageShareListModal);
