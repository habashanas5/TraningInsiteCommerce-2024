import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import {
    getWishListsDataView,
    getWishListState,
} from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { wishListsParameter } from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishLists";
import addAllWishListLines from "@insite/client-framework/Store/Pages/MyLists/Handlers/AddAllWishListLines";
import addWishList from "@insite/client-framework/Store/Pages/MyLists/Handlers/AddWishList";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    onCancel: () => void;
    onSubmit: (name: string, wishListId: string) => void;
    enableCloseCopyListModalOnEsc: () => void;
    disableCloseCopyListModalOnEsc: () => void;
}

interface State {
    name: string;
    nameError?: React.ReactNode;
    wishListId?: string;
    destinationWishList?: WishListModel;
}

const mapStateToProps = (state: ApplicationState) => ({
    wishLists: getWishListsDataView(state, wishListsParameter).value,
    wishList: getWishListState(state, state.pages.myListDetails.wishListId).value,
    wishListLines: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter).value,
});

const mapDispatchToProps = {
    addAllWishListLines,
    addWishList,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface MyListsDetailsCopyListFormStyles {
    container?: GridContainerProps;
    nameGridItem?: GridItemProps;
    nameTextField?: TextFieldProps;
    wishListGridItem?: GridItemProps;
    wishListDynamicDropdown?: DynamicDropdownPresentationProps;
    descriptionGridItem?: GridItemProps;
    descriptionText?: TypographyProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    createButton?: ButtonPresentationProps;
}

export const copyListFormStyles: MyListsDetailsCopyListFormStyles = {
    nameGridItem: {
        width: 12,
    },
    nameTextField: {
        border: "rectangle",
    },
    wishListGridItem: {
        width: 12,
    },
    descriptionGridItem: {
        width: 12,
    },
    buttonsGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    cancelButton: {
        color: "secondary",
        css: css`
            margin-right: 10px;
        `,
    },
};

const styles = copyListFormStyles;

class MyListsDetailsCopyListForm extends React.Component<Props, State> {
    readonly CREATE_ID = "CREATE_ID";

    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            wishListId: this.CREATE_ID,
        };
    }

    submitHandler = () => {
        if (this.state.wishListId === this.CREATE_ID) {
            if (this.state.name === "") {
                this.setState({ nameError: siteMessage("Lists_Enter_New_Wishlist_Name") });
                return;
            }

            this.props.addWishList({
                apiParameter: { name: this.state.name },
                onSuccess: this.onCreateSuccess,
                onError: this.onCreateError,
                onComplete(resultProps) {
                    if (resultProps.result?.wishListModel) {
                        this.onSuccess?.(resultProps.result?.wishListModel);
                    } else if (resultProps.result?.errorMessage) {
                        this.onError?.(resultProps.result.errorMessage);
                    }
                },
            });
        } else if (this.props.wishLists) {
            const destinationWishList = this.props.wishLists.find(w => w.id === this.state.wishListId);
            if (destinationWishList) {
                this.setState({ destinationWishList });
                this.copyWishListTo(destinationWishList);
            }
        }
    };

    onCreateSuccess = (addedWishList: WishListModel) => {
        this.setState({ destinationWishList: addedWishList });
        this.copyWishListTo(addedWishList);
    };

    onCreateError = (errorMessage: string) => {
        this.setState({ nameError: errorMessage });
    };

    copyWishListTo = (destinationWishList: WishListModel) => {
        if (destinationWishList && this.props.wishList && this.props.wishListLines) {
            this.props.addAllWishListLines({
                apiParameter: {
                    wishList: destinationWishList,
                    copyFromWishListId: this.props.wishList.id,
                },
                onSuccess: () => {
                    this.props.toaster.addToast({
                        body: translate("Item(s) copied to ") + destinationWishList.name,
                        messageType: "success",
                    });
                },
                onComplete(resultProps) {
                    if (!resultProps?.apiResult?.error) {
                        this.onSuccess?.();
                    }
                },
            });
        }
        this.props.onSubmit(this.state.name, this.state.wishListId as string);
    };

    nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: event.target.value,
            nameError: "",
        });
    };

    wishListChangeHandler = (wishListId?: string) => {
        this.setState({ wishListId });
    };

    render() {
        let options: OptionObject[] = [{ optionText: translate("Create New List"), optionValue: this.CREATE_ID }];
        if (this.props.wishLists) {
            const filteredWishLists = this.props.wishLists.filter(o => o.id !== this.props.wishList?.id);
            options = options.concat(filteredWishLists.map(o => ({ optionText: o.name, optionValue: o.id })));
        }

        return (
            <GridContainer {...styles.container} data-test-selector="copyListForm">
                <GridItem {...styles.descriptionGridItem}>
                    <Typography {...styles.descriptionText}>
                        {translate("Copy items to a new or existing list.")}
                    </Typography>
                </GridItem>
                <GridItem {...styles.wishListGridItem}>
                    <DynamicDropdown
                        label={translate("Select List")}
                        {...styles.wishListDynamicDropdown}
                        onSelectionChange={this.wishListChangeHandler}
                        selected={this.CREATE_ID}
                        options={options}
                        data-test-selector="selectList"
                        onOpen={this.props.disableCloseCopyListModalOnEsc}
                        onClose={this.props.enableCloseCopyListModalOnEsc}
                    />
                </GridItem>
                {this.state.wishListId === this.CREATE_ID && (
                    <GridItem {...styles.nameGridItem}>
                        <TextField
                            label={translate("List Name")}
                            data-test-selector="tst_CopyList_ListName"
                            {...styles.nameTextField}
                            name="name"
                            error={this.state.nameError}
                            required
                            defaultValue={this.state.name}
                            onChange={this.nameChangeHandler}
                        ></TextField>
                    </GridItem>
                )}
                <GridItem {...styles.buttonsGridItem}>
                    <Button {...styles.cancelButton} onClick={this.props.onCancel}>
                        {translate("Cancel")}
                    </Button>
                    <Button
                        {...styles.createButton}
                        onClick={this.submitHandler}
                        data-test-selector="submitCopyListButton"
                    >
                        {translate("Copy to List")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(MyListsDetailsCopyListForm));
