import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import deleteWishList from "@insite/client-framework/Store/Pages/MyLists/Handlers/DeleteWishList";
import deleteWishListShare from "@insite/client-framework/Store/Pages/MyLists/Handlers/DeleteWishListShare";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import TwoButtonModal from "@insite/content-library/Components/TwoButtonModal";
import WishListCard from "@insite/content-library/Components/WishListCard";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { ModalPresentationProps } from "@insite/mobius/Modal";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}
interface State {
    wishListToAction?: WishListModel;
    deleteListModalIsOpen: boolean;
    leaveListModalIsOpen: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        wishLists: getWishListsDataView(state, state.pages.myLists.getWishListsParameter),
        getWishListsParameter: state.pages.myLists.getWishListsParameter,
    };
};

const mapDispatchToProps = {
    addWishListToCart,
    deleteWishList,
    deleteWishListShare,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface MyListsListStyles {
    cardList?: CardListStyles;
    cardContainer?: CardContainerStyles;
    deleteListModal?: ModalPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    messageText?: TypographyProps;
}

export const listStyles: MyListsListStyles = {
    deleteListModal: {
        sizeVariant: "small",
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    messageText: {
        variant: "h4",
        css: css`
            display: block;
            margin: auto;
        `,
    },
};

const styles = listStyles;

class MyListsList extends React.Component<Props, State> {
    static contextType = ToasterContext;
    context!: React.ContextType<typeof ToasterContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            deleteListModalIsOpen: false,
            leaveListModalIsOpen: false,
        };
    }

    deleteButtonClickHandler = (wishList: WishListModel) => {
        this.setState({
            wishListToAction: wishList,
            deleteListModalIsOpen: true,
        });
    };

    deleteCancelHandler = () => {
        this.setState({ deleteListModalIsOpen: false });
    };

    deleteSubmitHandler = () => {
        this.setState({ deleteListModalIsOpen: false });
        if (this.state.wishListToAction) {
            this.props.deleteWishList({
                wishListId: this.state.wishListToAction.id,
                onSuccess: this.onDeleteSuccess,
                onComplete(resultProps) {
                    if (!resultProps.error) {
                        this.onSuccess?.();
                    }
                },
            });
        }
    };

    onDeleteSuccess = () => {
        this.context.addToast({ body: translate("List Deleted"), messageType: "success" });
    };

    leaveButtonClickHandler = (wishList: WishListModel) => {
        this.setState({
            wishListToAction: wishList,
            leaveListModalIsOpen: true,
        });
    };

    leaveCancelHandler = () => {
        this.setState({ leaveListModalIsOpen: false });
    };

    leaveSubmitHandler = () => {
        this.setState({ leaveListModalIsOpen: false });
        if (this.state.wishListToAction) {
            this.props.deleteWishListShare({
                wishList: this.state.wishListToAction,
                onSuccess: this.onLeaveSuccess,
                onComplete() {
                    this.onSuccess?.();
                },
            });
        }
    };

    onLeaveSuccess = () => {
        this.context.addToast({ body: translate("You left the list"), messageType: "success" });
    };

    render() {
        if (!this.props.wishLists.value || this.props.wishLists.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} data-test-selector="myListsListSpinner"></LoadingSpinner>
                </StyledWrapper>
            );
        }

        if (this.props.wishLists.value.length === 0) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <Typography {...styles.messageText} data-test-selector="tst_MyList_NoListsFound">
                        {this.props.getWishListsParameter.query
                            ? siteMessage("Lists_NoResultsMessage")
                            : siteMessage("Lists_NoListsFound")}
                    </Typography>
                </StyledWrapper>
            );
        }

        return (
            <>
                <CardList extendedStyles={styles.cardList}>
                    {this.props.wishLists.value.map(wishList => (
                        <CardContainer key={wishList.id} extendedStyles={styles.cardContainer}>
                            <WishListCard
                                wishList={wishList}
                                addWishListToCart={this.props.addWishListToCart}
                                deleteWishList={() => this.deleteButtonClickHandler(wishList)}
                                leaveWishList={() => this.leaveButtonClickHandler(wishList)}
                            />
                        </CardContainer>
                    ))}
                </CardList>
                <TwoButtonModal
                    modalIsOpen={this.state.deleteListModalIsOpen}
                    headlineText={translate("Delete List")}
                    messageText={`${translate("Are you sure you want to delete")} ${
                        this.state.wishListToAction ? this.state.wishListToAction.name : ""
                    }?`}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Delete")}
                    onCancel={this.deleteCancelHandler}
                    onSubmit={this.deleteSubmitHandler}
                    submitTestSelector="myListsListSubmitDelete"
                ></TwoButtonModal>
                <TwoButtonModal
                    modalIsOpen={this.state.leaveListModalIsOpen}
                    headlineText={translate("Leave List")}
                    messageText={`${translate("Are you sure you want to leave")} ${
                        this.state.wishListToAction ? this.state.wishListToAction.name : ""
                    }?`}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Leave")}
                    onCancel={this.leaveCancelHandler}
                    onSubmit={this.leaveSubmitHandler}
                    submitTestSelector="myListsListSubmitLeave"
                ></TwoButtonModal>
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsList),
    definition: {
        group: "My Lists",
        displayName: "List",
        allowedContexts: [MyListsPageContext],
    },
};

export default widgetModule;
