import { getCookie } from "@insite/client-framework/Common/Cookies";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView, getAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccount";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import loadVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocations";
import { getVmiLocationsDataView } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import clearSelectedVmiLocations from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/ClearSelectedVmiLocations";
import toggleLocationCheck from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/ToggleLocationCheck";
import updateLocationsSearchFields from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/UpdateLocationsSearchFields";
import updateUser from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/UpdateUser";
import translate from "@insite/client-framework/Translate";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import VmiLocationsTable, { VmiLocationsTableStyles } from "@insite/content-library/Widgets/VmiUsers/VmiLocationsTable";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Search from "@insite/mobius/Icons/Search";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Radio, { RadioProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ChangeEvent, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    isOpen: boolean;
    onSuccess: () => void;
    onClose: () => void;
    editUserId?: string;
    getAccountsParameter?: GetAccountsApiParameter;
    setGetAccountsParameter?: (parameter: GetAccountsApiParameter) => void;
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    return {
        accountsDataView: props.isOpen && !props.editUserId && getAccountsDataView(state, props.getAccountsParameter),
        accountState: props.isOpen && props.editUserId ? getAccountState(state, props.editUserId) : null,
        getVmiLocationsParameter: state.pages.vmiUsers.getVmiLocationsParameter,
        selectedVmiLocations: state.pages.vmiUsers.selectedVmiLocations,
        vmiLocationsDataView: getVmiLocationsDataView(state, state.pages.vmiUsers.getVmiLocationsParameter),
    };
};

const mapDispatchToProps = {
    loadAccount,
    loadAccounts,
    loadVmiLocations,
    toggleLocationCheck,
    clearSelectedVmiLocations,
    updateLocationsSearchFields,
    updateUser,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface AddVmiUserModalStyles {
    modal?: ModalPresentationProps;
    form?: InjectableCss;
    container?: GridContainerProps;
    leftGridItem?: GridItemProps;
    wrapper?: InjectableCss;
    titleText?: TypographyPresentationProps;
    usernameText?: TypographyPresentationProps;
    firstNameText?: TypographyPresentationProps;
    lastNameText?: TypographyPresentationProps;
    emailAddressText?: TypographyPresentationProps;
    userSelectorDynamicDropdown?: DynamicDropdownPresentationProps;
    rolesRadioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    roleRadio?: RadioProps;
    rightGridItem?: GridItemProps;
    locationsContainer?: GridContainerProps;
    searchBoxGridItem?: GridItemProps;
    locationsSearchText?: TextFieldPresentationProps;
    locationsTableGridItem?: GridItemProps;
    vmiLocationsTable?: VmiLocationsTableStyles;
    pagination?: PaginationPresentationProps;
    buttonsGridItem?: GridItemProps;
    removeUserLink?: LinkPresentationProps;
    importLink?: LinkPresentationProps;
    cancelButton?: ButtonPresentationProps;
    submitButton?: ButtonPresentationProps;
    removeUserModal?: TwoButtonModalStyles;
}

export const addVmiUserModalStyles: AddVmiUserModalStyles = {
    modal: { size: 1100 },
    leftGridItem: {
        width: [12, 12, 6, 3, 3],
        css: css`
            flex-direction: column;
        `,
    },
    wrapper: {
        css: css`
            margin-bottom: 12px;
        `,
    },
    titleText: {
        variant: "h6",
        css: css`
            margin-bottom: 5px;
            font-weight: 600;
        `,
    },
    userSelectorDynamicDropdown: {
        cssOverrides: {
            dropdownWrapper: css`
                margin-bottom: 20px;
            `,
        },
    },
    rightGridItem: { width: [12, 12, 6, 9, 9] },
    locationsContainer: {
        gap: 20,
    },
    searchBoxGridItem: { width: [12, 12, 6, 5, 5] },
    locationsSearchText: { iconProps: { src: Search } },
    locationsTableGridItem: {
        width: 12,
        css: css`
            display: block;
        `,
    },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: 12,
    },
    removeUserLink: {
        css: css`
            margin: 9px 20px;
            white-space: nowrap;
        `,
    },
    importLink: {
        css: css`
            margin: 9px 20px;
            white-space: nowrap;
        `,
    },
    cancelButton: {
        variant: "secondary",
        css: css`
            word-break: keep-all;
        `,
    },
    submitButton: {
        css: css`
            margin-left: 1rem;
        `,
    },
};

const styles = addVmiUserModalStyles;

const StyledForm = getStyledWrapper("form");

const searchMinimumCharacterLength = 3;

const AddVmiUserModal = ({
    isOpen,
    editUserId,
    onClose,
    onSuccess,
    accountsDataView,
    accountState,
    getAccountsParameter,
    getVmiLocationsParameter,
    selectedVmiLocations,
    vmiLocationsDataView,
    loadAccount,
    loadAccounts,
    loadVmiLocations,
    toggleLocationCheck,
    clearSelectedVmiLocations,
    updateLocationsSearchFields,
    updateUser,
    setGetAccountsParameter,
    toaster,
}: Props) => {
    const [userSearchText, setUserSearchText] = useState("");
    const [user, setUser] = useState<AccountModel>();
    const [options, setOptions] = useState<OptionObject[]>([]);
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [showFormErrors, setShowFormErrors] = useState(false);
    const [role, setRole] = useState("VMI_User");
    const [searchTimeoutId, setSearchTimeoutId] = useState<number | undefined>(undefined);
    const [removeUserModalIsOpen, setRemoveUserModalIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen && !editUserId && accountsDataView && !accountsDataView.isLoading) {
            loadAccounts(getAccountsParameter);
        }
    }, [getAccountsParameter, isOpen]);

    useEffect(() => {
        if (!isOpen || !editUserId) {
            return;
        }

        if (accountState?.value) {
            selectUser(accountState.value);
        } else if (accountState && !accountState.isLoading && !accountState.value) {
            loadAccount({ accountId: editUserId });
        }
    }, [isOpen, accountState]);

    useEffect(() => {
        if (accountsDataView && accountsDataView.value) {
            const options: OptionObject[] = accountsDataView.value.map(c => ({
                optionText: c.userName,
                optionValue: c.id,
            }));
            setOptions(options);
            if (user) {
                clearUserData();
            } else if (accountsDataView.value.length === 1) {
                selectUser(accountsDataView.value[0]);
            }
        }
    }, [accountsDataView]);

    useEffect(() => {
        const pageSizeCookie = getCookie("AddVmiUserModal-Locations-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== getVmiLocationsParameter.pageSize) {
            updateLocationsSearchFields({ pageSize });
            return;
        }

        if (!vmiLocationsDataView.value && !vmiLocationsDataView.isLoading) {
            loadVmiLocations(getVmiLocationsParameter);
        }
    }, [getVmiLocationsParameter]);

    const selectUser = (account: AccountModel) => {
        if (account) {
            setUser(account);
            setRole(account.vmiRole === "VMI_Admin" ? "VMI_Admin" : "VMI_User");
            clearSelectedVmiLocations();
            loadVmiLocations({
                userId: account.id,
                page: 1,
                pageSize: 1000,
                expand: ["customerlabel"],
                onComplete: result => {
                    const vmiLocationIds = result.apiResult?.vmiLocations?.map(o => o.id) || [];
                    toggleLocationCheck({ ids: vmiLocationIds });
                },
            });
        }
    };

    const selectUserHandler = (userId?: string) => {
        if (accountsDataView && accountsDataView.value && userId) {
            const user = accountsDataView.value.filter(user => user.id === userId)[0];
            if (user) {
                selectUser(user);
                setUserErrorMessage("");
            }
        } else if (showFormErrors) {
            validateForm();
        }
    };

    const userSearchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserSearchText(event.currentTarget.value);
        const apiParameter: GetAccountsApiParameter = {
            ...getAccountsParameter,
            searchText: userSearchText || undefined,
        };
        typeof setGetAccountsParameter === "function" && setGetAccountsParameter(apiParameter);
    };

    const validateForm = () => {
        setUserErrorMessage(user ? "" : siteMessage("Field_Required", translate("User")).toString());
        return !!user;
    };

    const formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setShowFormErrors(true);
            return false;
        }

        const selectedIds = Object.keys(selectedVmiLocations).filter(o => selectedVmiLocations[o]);
        updateUser({
            userId: user!.id,
            role: user?.vmiRole === role ? undefined : role,
            vmiLocationIds: selectedIds,
            reloadVmiUsers: true,
            onComplete: result => {
                if (result.apiResult?.successful) {
                    toaster.addToast({
                        body: editUserId
                            ? translate("Vmi user updated successfully")
                            : translate("Vmi user added successfully"),
                        messageType: "success",
                    });

                    onSuccess();
                    resetState();
                } else if (result.apiResult?.errorMessage) {
                    toaster.addToast({ body: result.apiResult?.errorMessage, messageType: "danger" });
                }
            },
        });
    };

    const resetState = () => {
        setUserSearchText("");
        clearUserData();
        setShowFormErrors(false);
        setRemoveUserModalIsOpen(false);
    };

    const clearUserData = () => {
        setUser(undefined);
        setRole("VMI_User");
        clearSelectedVmiLocations();
        setUserErrorMessage("");
    };

    const roleChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setRole(event.currentTarget.value);
    };

    const locationsSearchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof searchTimeoutId === "number") {
            clearTimeout(searchTimeoutId);
        }
        const searchText = event.currentTarget.value;
        if (searchText.length > 0 && searchText.length < searchMinimumCharacterLength) {
            return;
        }
        setSearchTimeoutId(
            setTimeout(() => {
                updateLocationsSearchFields({ filter: searchText, page: 1 });
            }, 250),
        );
    };

    const toggleLocations = (ids: string[]) => {
        toggleLocationCheck({ ids });
    };

    const changePage = (newPageIndex: number) => {
        updateLocationsSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateLocationsSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    const closeModalHandler = () => {
        onClose();
        resetState();
    };

    const removeUserHandler = () => {
        setRemoveUserModalIsOpen(true);
    };

    const removeCancelHandler = () => {
        setRemoveUserModalIsOpen(false);
    };

    const removeUserSubmitHandler = () => {
        updateUser({
            userId: user!.id,
            vmiLocationIds: null,
            removeVmiPermissions: true,
            reloadVmiUsers: true,
            onComplete: result => {
                if (result.apiResult?.successful) {
                    toaster.addToast({
                        body: translate("Vmi user removed successfully"),
                        messageType: "success",
                    });
                    onSuccess();
                    resetState();
                } else if (result.apiResult?.errorMessage) {
                    toaster.addToast({ body: result.apiResult?.errorMessage, messageType: "danger" });
                }
            },
        });
    };

    return (
        <>
            <Modal
                {...styles.modal}
                handleClose={closeModalHandler}
                headline={editUserId ? translate("Edit User") : translate("Add User")}
                isOpen={isOpen}
            >
                <StyledForm {...styles.form} noValidate onSubmit={formSubmitHandler}>
                    <GridContainer {...styles.container}>
                        <GridItem {...styles.leftGridItem}>
                            {editUserId && (
                                <>
                                    <StyledWrapper {...styles.wrapper}>
                                        <Typography as="h2" {...styles.titleText} id="addVmiUserModalUsername">
                                            {translate("Username")}
                                        </Typography>
                                        <Typography {...styles.usernameText} aria-labelledby="addVmiUserModalUsername">
                                            {user?.userName}
                                        </Typography>
                                    </StyledWrapper>
                                    <StyledWrapper {...styles.wrapper}>
                                        <Typography as="h2" {...styles.titleText} id="addVmiUserModalFirstName">
                                            {translate("First Name")}
                                        </Typography>
                                        <Typography
                                            {...styles.firstNameText}
                                            aria-labelledby="addVmiUserModalFirstName"
                                        >
                                            {user?.firstName}
                                        </Typography>
                                    </StyledWrapper>
                                    <StyledWrapper {...styles.wrapper}>
                                        <Typography as="h2" {...styles.titleText} id="addVmiUserModalLastName">
                                            {translate("Last Name")}
                                        </Typography>
                                        <Typography {...styles.lastNameText} aria-labelledby="addVmiUserModalLastName">
                                            {user?.lastName}
                                        </Typography>
                                    </StyledWrapper>
                                    <StyledWrapper {...styles.wrapper}>
                                        <Typography as="h2" {...styles.titleText} id="addVmiUserModalEmail">
                                            {translate("Email Address")}
                                        </Typography>
                                        <Typography {...styles.emailAddressText} aria-labelledby="addVmiUserModalEmail">
                                            {user?.email}
                                        </Typography>
                                    </StyledWrapper>
                                </>
                            )}
                            {!editUserId && (
                                <DynamicDropdown
                                    {...styles.userSelectorDynamicDropdown}
                                    error={showFormErrors && userErrorMessage}
                                    label={translate("Search User")}
                                    onSelectionChange={selectUserHandler}
                                    onInputChange={userSearchTextChanged}
                                    selected={user?.id}
                                    placeholder={translate("Search")}
                                    isLoading={accountsDataView && accountsDataView.isLoading}
                                    options={options}
                                    filterOption={() => true}
                                    required
                                />
                            )}
                            <RadioGroup
                                label="Select VMI Role"
                                value={role}
                                onChangeHandler={roleChangeHandler}
                                disabled={!user}
                                {...styles.rolesRadioGroup}
                            >
                                <Radio {...styles.roleRadio} value="VMI_User">
                                    {translate("User")}
                                </Radio>
                                <Radio {...styles.roleRadio} value="VMI_Admin">
                                    {translate("Admin")}
                                </Radio>
                            </RadioGroup>
                        </GridItem>
                        <GridItem {...styles.rightGridItem}>
                            <GridContainer {...styles.locationsContainer}>
                                <GridItem {...styles.searchBoxGridItem}>
                                    <TextField
                                        label={translate("Assign Locations")}
                                        placeholder={translate("Search Locations")}
                                        {...styles.locationsSearchText}
                                        onChange={locationsSearchTextChangeHandler}
                                    />
                                </GridItem>
                                <GridItem {...styles.locationsTableGridItem}>
                                    <VmiLocationsTable
                                        getVmiLocationsParameter={getVmiLocationsParameter}
                                        selectedVmiLocations={selectedVmiLocations}
                                        updateSearchFields={updateLocationsSearchFields}
                                        toggleLocations={toggleLocations}
                                    />
                                    {vmiLocationsDataView.value &&
                                        vmiLocationsDataView.pagination &&
                                        vmiLocationsDataView.pagination.totalItemCount > 0 && (
                                            <Pagination
                                                {...styles.pagination}
                                                resultsCount={vmiLocationsDataView.pagination.totalItemCount}
                                                currentPage={vmiLocationsDataView.pagination.page}
                                                resultsPerPage={vmiLocationsDataView.pagination.pageSize}
                                                resultsPerPageOptions={vmiLocationsDataView.pagination.pageSizeOptions}
                                                onChangePage={changePage}
                                                onChangeResultsPerPage={changeResultsPerPage}
                                                pageSizeCookie="AddVmiUserModal-Locations-PageSize"
                                            />
                                        )}
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem {...styles.buttonsGridItem}>
                            {editUserId && (
                                <Link {...styles.removeUserLink} onClick={removeUserHandler} type="button">
                                    {translate("Remove User")}
                                </Link>
                            )}
                            {!editUserId && <Link {...styles.importLink}>{translate("Import CSV")}</Link>}
                            <Button {...styles.cancelButton} onClick={closeModalHandler} type="button">
                                {translate("Cancel")}
                            </Button>
                            <Button {...styles.submitButton} type="submit">
                                {editUserId ? translate("Save") : translate("Add User")}
                            </Button>
                        </GridItem>
                    </GridContainer>
                </StyledForm>
            </Modal>
            <TwoButtonModal
                {...styles.removeUserModal}
                modalIsOpen={removeUserModalIsOpen}
                headlineText={translate("Remove User from VMI")}
                messageText={translate("This user will not longer be able to use VMI.")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Remove")}
                onCancel={removeCancelHandler}
                onSubmit={removeUserSubmitHandler}
            ></TwoButtonModal>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(AddVmiUserModal));
