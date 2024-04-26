import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import updateGetWishListsParameter from "@insite/client-framework/Store/Components/AddToListModal/Handlers/UpdateGetWishListsParameter";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import loadWishLists from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishLists";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import debounce from "lodash/debounce";
import React, { useContext, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: AddToListModalStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    modalIsOpen: state.components.addToListModal.isOpen,
    productInfos: state.components.addToListModal.productInfos,
    getWishListsParameter: state.components.addToListModal.getWishListsParameter,
    wishListsDataView: getWishListsDataView(state, state.components.addToListModal.getWishListsParameter),
    signInUrl: getPageLinkByPageType(state, "SignInPage")?.url,
    location: getLocation(state),
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
    updateGetWishListsParameter,
    loadWishLists,
};

export interface AddToListModalStyles {
    modal?: ModalPresentationProps;
    innerWrapper?: InjectableCss;
    signInMessageText?: TypographyProps;
    descriptionText?: TypographyProps;
    listsSelect?: DynamicDropdownPresentationProps;
    newListInput?: TextFieldProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    addButton?: ButtonPresentationProps;
}

export const addToListModalStyles: AddToListModalStyles = {
    modal: {
        size: 350,
        cssOverrides: {
            modalBody: css`
                overflow-y: visible;
            `,
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    descriptionText: {
        as: "p",
    },
    listsSelect: {
        cssOverrides: {
            formField: css`
                margin-top: 15px;
            `,
        },
    },
    newListInput: {
        cssOverrides: {
            formField: css`
                margin-top: 15px;
            `,
        },
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    addButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

export const LastUpdatedListIdCookieName = "LastUpdatedListId";

const AddToListModal = ({
    productInfos,
    session,
    modalIsOpen,
    getWishListsParameter,
    wishListsDataView,
    signInUrl,
    location,
    setAddToListModalIsOpen,
    addToWishList,
    updateGetWishListsParameter,
    loadWishLists,
    extendedStyles,
}: Props) => {
    const [styles] = useState(() => mergeToNew(addToListModalStyles, extendedStyles));

    const toasterContext = useContext(ToasterContext);

    const isAuthenticated = session && (session.isAuthenticated || session.rememberMe) && !session.isGuest;
    const [selectedWishListId, setSelectedWishListId] = useState("new");
    const [newListName, setNewListName] = useState("");
    const [selectListError, setSelectListError] = useState<React.ReactNode>("");
    const [newListNameError, setNewListNameError] = useState<React.ReactNode>("");
    const [options, setOptions] = useState<OptionObject[]>([]);
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        if (!modalIsOpen) {
            return;
        }

        const lastUpdatedListId = getCookie(LastUpdatedListIdCookieName) || "new";
        setSelectedWishListId(lastUpdatedListId);
    }, [modalIsOpen]);

    useEffect(() => {
        if (modalIsOpen && !wishListsDataView.value && !wishListsDataView.isLoading) {
            loadWishLists(getWishListsParameter);
        }
    }, [getWishListsParameter]);

    useEffect(() => {
        if (wishListsDataView.value) {
            let options: OptionObject[] = [{ optionText: translate("Create New List"), optionValue: "new" }];
            options = options.concat(wishListsDataView.value.map(o => ({ optionText: o.name, optionValue: o.id })));
            setOptions(options);
        }
    }, [wishListsDataView]);

    if (!productInfos) {
        return null;
    }

    const modalCloseHandler = () => {
        setNewListName("");
        setSelectListError("");
        setNewListNameError("");
        setInProgress(false);
        setAddToListModalIsOpen({ modalIsOpen: false });
    };

    const listChangeHandler = (value?: string) => {
        setSelectedWishListId(value || "new");
        setSelectListError("");
    };

    const debouncedUpdateParameter = debounce((value: string) => {
        updateGetWishListsParameter({
            ...getWishListsParameter,
            query: value || undefined,
        });
    }, 200);

    const listsInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedUpdateParameter(event.currentTarget.value);
    };

    const newListInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewListName(event.target.value);
        if (event.target.value) {
            setNewListNameError("");
        }
    };

    const addToListButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setNewListNameError("");
        setSelectListError("");

        if (!selectedWishListId || !options.some(o => o.optionValue === selectedWishListId)) {
            setSelectListError(siteMessage("Lists_Enter_New_Wishlist_Name"));
            return;
        }

        const isNewList = selectedWishListId === "new";
        if (isNewList && !newListName) {
            setNewListNameError(siteMessage("Lists_Enter_New_Wishlist_Name"));
            return;
        }

        setInProgress(true);

        addToWishList({
            productInfos,
            selectedWishList: isNewList ? undefined : wishListsDataView.value?.find(o => o.id === selectedWishListId),
            newListName,
            onSuccess: (wishList: WishListModel) => {
                modalCloseHandler();
                setCookie(LastUpdatedListIdCookieName, wishList.id);
                setSelectedWishListId(wishList.id);
                toasterContext.addToast({
                    body: siteMessage("Lists_ProductAdded"),
                    messageType: "success",
                    isFocusAfterMount: true,
                });
            },
            onError: errorMessage => {
                setInProgress(false);

                if (isNewList) {
                    setNewListNameError(errorMessage);
                } else {
                    modalCloseHandler();
                    toasterContext.addToast({ body: errorMessage, messageType: "danger" });
                }
            },
            onComplete(wishListProps) {
                if (wishListProps?.result?.wishList) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(wishListProps?.result?.wishList);
                } else if (wishListProps?.result?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(wishListProps?.result?.errorMessage);
                }
            },
        });
    };

    return (
        <Modal
            {...styles.modal}
            headline={isAuthenticated ? translate("Add to List") : translate("Please Sign In")}
            isOpen={modalIsOpen}
            handleClose={modalCloseHandler}
        >
            <StyledWrapper {...styles.innerWrapper} data-test-selector="productAddToListModal">
                {!isAuthenticated && (
                    <Typography data-test-selector="productAddToListModal_requireSignIn" {...styles.signInMessageText}>
                        {siteMessage(
                            "Lists_Must_Sign_In_Spire",
                            `${signInUrl}?returnUrl=${encodeURIComponent(location.pathname + location.search)}`,
                        )}
                    </Typography>
                )}
                {isAuthenticated && (
                    <>
                        <Typography {...styles.descriptionText}>
                            {translate("Add items to a new or existing list.")}
                        </Typography>
                        <DynamicDropdown
                            label={translate("Select List")}
                            {...styles.listsSelect}
                            isLoading={wishListsDataView.isLoading}
                            onInputChange={listsInputChangeHandler}
                            onSelectionChange={listChangeHandler}
                            selected={selectedWishListId}
                            options={options}
                            error={selectListError}
                            data-test-selector="productAddToListModal_listSelect"
                        />
                        {selectedWishListId === "new" && (
                            <TextField
                                label={translate("New List Name")}
                                value={newListName}
                                error={newListNameError}
                                onChange={newListInputChangeHandler}
                                {...styles.newListInput}
                                data-test-selector="productAddToListModal_newName"
                            />
                        )}
                        <StyledWrapper {...styles.buttonsWrapper}>
                            <Button {...styles.cancelButton} onClick={modalCloseHandler}>
                                {translate("Cancel")}
                            </Button>
                            <Button
                                {...styles.addButton}
                                onClick={e => addToListButtonClickHandler(e)}
                                data-test-selector="productAddToListModal_addButton"
                                disabled={inProgress}
                            >
                                {translate("Add to List")}
                            </Button>
                        </StyledWrapper>
                    </>
                )}
            </StyledWrapper>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToListModal);
