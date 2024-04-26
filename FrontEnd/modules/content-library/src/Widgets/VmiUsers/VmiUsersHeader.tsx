import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { VmiUsersPageContext } from "@insite/content-library/Pages/VmiUsersPage";
import AddVmiUserModal from "@insite/content-library/Widgets/VmiUsers/AddVmiUserModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Search from "@insite/mobius/Icons/Search";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    parameter: state.pages.vmiUsers.getVmiUsersParameter,
    searchText: state.pages.vmiUsers.getVmiUsersParameter.searchText,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiUsersHeaderStyles {
    wrapper?: InjectableCss;
    titleContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    buttonsHidden?: HiddenProps;
    addUserButton?: ButtonPresentationProps;
    overflowMenu?: OverflowMenuPresentationProps;
    searchContainer?: GridContainerProps;
    searchGridItem?: GridItemProps;
    searchText?: TextFieldPresentationProps;
    toggleFilterGridItem?: GridItemProps;
    addUserClickable?: ClickablePresentationProps;
    toggleFilterIcon?: IconPresentationProps;
    toggleFilterClickable?: ClickablePresentationProps;
    filterContainer?: GridContainerProps;
    filterGridItem?: GridItemProps;
    roleFilterSelect?: SelectPresentationProps;
}

export const vmiUsersHeaderStyles: VmiUsersHeaderStyles = {
    wrapper: {
        css: css`
            margin-bottom: 1rem;
        `,
    },
    titleGridItem: {
        width: [10, 10, 8, 9, 9],
    },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [2, 2, 4, 3, 3],
    },
    addUserButton: {
        css: css`
            justify-content: flex-end;
        `,
    },
    searchGridItem: {
        width: [10, 10, 6, 5, 4],
    },
    searchText: { iconProps: { src: Search } },
    toggleFilterGridItem: {
        width: [2, 2, 6, 7, 8],
        style: { justifyContent: "flex-end" },
    },
    toggleFilterIcon: {
        src: Filter,
        size: 24,
    },
    filterGridItem: {
        width: [10, 10, 6, 5, 4],
    },
};

const styles = vmiUsersHeaderStyles;

const searchMinimumCharacterLength = 3;

const VmiUsersHeader = ({ id, parameter, updateSearchFields, searchText }: Props) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTimeoutId, setSearchTimeoutId] = useState<number | undefined>(undefined);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [modalGetAccountsParameter, setModalGetAccountsParameter] = useState<GetAccountsApiParameter>({
        expand: ["administration"],
        sort: "UserName",
        pageSize: 1000,
        page: 1,
        excludeRoles: ["VMI_User", "VMI_Admin"],
    });
    const [searchUserText, setSearchUserText] = useState(searchText);

    const searchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof searchTimeoutId === "number") {
            clearTimeout(searchTimeoutId);
        }
        const searchText = event.currentTarget.value;
        setSearchUserText(searchText);
        if (searchText.length > 0 && searchText.length < searchMinimumCharacterLength) {
            return;
        }
        setSearchTimeoutId(
            setTimeout(() => {
                updateSearchFields({
                    searchText,
                    page: 1,
                });
            }, 250),
        );
    };

    const openAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const onSuccessAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    const onCloseAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    const toggleFiltersOpen = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleChangeRoleFilter = (event: React.FormEvent<HTMLSelectElement>) => {
        let roles;
        if (event.currentTarget.value === "User") {
            roles = ["VMI_User"];
        } else if (event.currentTarget.value === "Admin") {
            roles = ["VMI_Admin"];
        } else {
            roles = ["VMI_User", "VMI_Admin"];
        }
        updateSearchFields({ roles });
    };

    const addUserText = translate("Add User");
    const includeUserRole = parameter.roles?.includes("VMI_User");
    const includeAdminRole = parameter.roles?.includes("VMI_Admin");
    const selectRoleValue =
        includeUserRole && !includeAdminRole ? "User" : !includeUserRole && includeAdminRole ? "Admin" : "";

    return (
        <StyledWrapper {...styles.wrapper}>
            <GridContainer {...styles.titleContainer}>
                <GridItem {...styles.titleGridItem}>
                    <Zone zoneName="Content00" contentId={id} />
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    <Hidden {...styles.buttonsHidden} below="md">
                        <Button {...styles.addUserButton} onClick={openAddUserModal}>
                            {addUserText}
                        </Button>
                    </Hidden>
                    <Hidden {...styles.buttonsHidden} above="sm">
                        <OverflowMenu {...styles.overflowMenu}>
                            <Clickable {...styles.addUserClickable} onClick={openAddUserModal}>
                                {addUserText}
                            </Clickable>
                        </OverflowMenu>
                    </Hidden>
                </GridItem>
            </GridContainer>
            <GridContainer {...styles.searchContainer}>
                <GridItem {...styles.searchGridItem}>
                    <TextField
                        placeholder={translate("Search Users")}
                        {...styles.searchText}
                        value={searchUserText}
                        onChange={searchTextChangeHandler}
                    />
                </GridItem>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable {...styles.toggleFilterClickable} onClick={toggleFiltersOpen}>
                        <Icon {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
            {isFilterOpen && (
                <GridContainer {...styles.filterContainer}>
                    <GridItem {...styles.filterGridItem}>
                        <Select
                            label={translate("Role")}
                            {...styles.roleFilterSelect}
                            value={selectRoleValue}
                            onChange={handleChangeRoleFilter}
                        >
                            <option value="">{translate("Select")}</option>
                            <option key="User" value="User">
                                {translate("User")}
                            </option>
                            <option key="Admin" value="Admin">
                                {translate("Admin")}
                            </option>
                        </Select>
                    </GridItem>
                </GridContainer>
            )}
            <AddVmiUserModal
                isOpen={isAddUserModalOpen}
                onSuccess={onSuccessAddUserModal}
                onClose={onCloseAddUserModal}
                getAccountsParameter={modalGetAccountsParameter}
                setGetAccountsParameter={setModalGetAccountsParameter}
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiUsersHeader),
    definition: {
        allowedContexts: [VmiUsersPageContext],
        group: "VMI Users",
    },
};

export default widgetModule;
