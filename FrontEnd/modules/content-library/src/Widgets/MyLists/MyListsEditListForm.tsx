import siteMessage from "@insite/client-framework/SiteMessage";
import updateWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/UpdateWishList";
import addWishList from "@insite/client-framework/Store/Pages/MyLists/Handlers/AddWishList";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    wishList?: WishListModel;
    onCancel: () => void;
    onSubmit: () => void;
}

interface State {
    name: string;
    nameError?: React.ReactNode;
    description: string;
    descriptionError?: React.ReactNode;
}

const mapDispatchToProps = {
    addWishList,
    updateWishList,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsEditListFormStyles {
    container?: GridContainerProps;
    nameGridItem?: GridItemProps;
    nameTextField?: TextFieldProps;
    descriptionGridItem?: GridItemProps;
    descriptionTextField?: TextFieldProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    createButton?: ButtonPresentationProps;
}

export const myListsEditListFormStyles: MyListsEditListFormStyles = {
    nameGridItem: {
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

/**
 * @deprecated Use myListsEditListFormStyles instead.
 */
export const createListFormStyles = myListsEditListFormStyles;
const styles = myListsEditListFormStyles;

class MyListsEditListForm extends React.Component<Props, State> {
    static contextType = ToasterContext;
    context!: React.ContextType<typeof ToasterContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            name: props.wishList?.name || "",
            description: props.wishList?.description || "",
        };
    }

    submitHandler = (e: any) => {
        if (this.state.name === "") {
            this.setState({ nameError: siteMessage("Lists_List_Name_Required") });
            return;
        }

        if (this.props.wishList) {
            this.props.updateWishList({
                apiParameter: {
                    wishList: {
                        ...this.props.wishList,
                        name: this.state.name,
                        description: this.state.description,
                    },
                },
                onSuccess: this.onSubmitSuccess,
                onError: this.onSubmitError,
                onComplete(resultProps) {
                    if (resultProps.result?.wishList) {
                        this.onSuccess?.();
                    } else if (resultProps.result?.errorMessage) {
                        this.onError?.(resultProps.result.errorMessage);
                    }
                },
            });
        } else {
            this.props.addWishList({
                apiParameter: { name: this.state.name, description: this.state.description },
                onSuccess: this.onSubmitSuccess,
                onError: this.onSubmitError,
                onComplete(resultProps) {
                    if (resultProps.result?.wishListModel) {
                        this.onSuccess?.(resultProps.result?.wishListModel);
                    } else if (resultProps.result?.errorMessage) {
                        this.onError?.(resultProps.result.errorMessage);
                    }
                },
            });
        }
    };

    onSubmitSuccess = () => {
        this.context.addToast({
            body: translate(`List ${this.props.wishList ? "Updated" : "Created"}`),
            messageType: "success",
        });
        this.props.onSubmit();
    };

    onSubmitError = (errorMessage: string) => {
        this.setState({ nameError: errorMessage });
    };

    nameChangeHandler = (e: any) => {
        this.setState({
            name: e.target.value,
            nameError: e.target.value.length > 100 ? siteMessage("Lists_List_Name_Too_Long", "100") : "",
        });
    };

    descriptionChangeHandler = (e: any) => {
        this.setState({
            description: e.target.value,
            descriptionError: e.target.value.length > 300 ? siteMessage("Lists_List_Description_Too_Long", "300") : "",
        });
    };

    render() {
        const { name, nameError, description, descriptionError } = this.state;
        return (
            <GridContainer {...styles.container} data-test-selector="editListForm">
                <GridItem {...styles.nameGridItem}>
                    <TextField
                        data-test-selector="myListsEditListFormName"
                        label={translate("List Name")}
                        {...styles.nameTextField}
                        name="name"
                        error={nameError}
                        required
                        defaultValue={name}
                        onChange={this.nameChangeHandler}
                    ></TextField>
                </GridItem>
                <GridItem {...styles.descriptionGridItem}>
                    <TextField
                        data-test-selector="myListsEditListFormDescription"
                        label={translate("Description")}
                        {...styles.descriptionTextField}
                        name="description"
                        error={descriptionError}
                        defaultValue={description}
                        onChange={this.descriptionChangeHandler}
                    ></TextField>
                </GridItem>
                <GridItem {...styles.buttonsGridItem}>
                    <Button {...styles.cancelButton} onClick={this.props.onCancel}>
                        {translate("Cancel")}
                    </Button>
                    <Button
                        {...styles.createButton}
                        onClick={this.submitHandler}
                        disabled={name.length > 100 || description.length > 300}
                        data-test-selector="myListsEditListFormSubmit"
                    >
                        {translate(this.props.wishList ? "Save" : "Create List")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

export default connect(null, mapDispatchToProps)(MyListsEditListForm);
