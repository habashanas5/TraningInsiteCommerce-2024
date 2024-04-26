import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountState, getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadCurrentAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadCurrentAccount";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import displayUser from "@insite/client-framework/Store/Pages/UserSetup/Handlers/DisplayUser";
import saveUser from "@insite/client-framework/Store/Pages/UserSetup/Handlers/SaveUser";
import translate from "@insite/client-framework/Translate";
import PageModule from "@insite/client-framework/Types/PageModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Page from "@insite/mobius/Page";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    let userId;
    if (location && location.search) {
        const parsedQuery = parseQueryString<{ userId: string }>(location.search);
        userId = parsedQuery.userId;
    }

    const accountState = getAccountState(state, userId);

    return {
        userId,
        accountState,
        shouldLoadCurrentAccount: !getCurrentAccountState(state).value,
        userAdministrationPageLink: getPageLinkByPageType(state, "UserAdministrationPage"),
    };
};

const mapDispatchToProps = {
    displayUser,
    loadCurrentAccount,
    saveUser,
};

type Props = WidgetProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext &
    HasHistory;

export interface UserSetupPageStyles {
    form?: InjectableCss;
}

export const userSetupPageStyles: UserSetupPageStyles = {};

const styles = userSetupPageStyles;
const StyledForm = getStyledWrapper("form");

class UserSetupPage extends Component<Props> {
    componentDidMount(): void {
        if (this.props.userId) {
            this.props.displayUser({ userId: this.props.userId });
        }

        if (this.props.shouldLoadCurrentAccount) {
            this.props.loadCurrentAccount();
        }
    }

    handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.props.saveUser({
            onSuccess: () => {
                this.props.toaster.addToast({ body: translate("Changes saved."), messageType: "success" });
                this.props.userAdministrationPageLink &&
                    this.props.history.push(this.props.userAdministrationPageLink.url);
            },
            onError: (errorMessage: string) => {
                this.props.toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.successful) {
                    this.onSuccess?.();
                } else if (resultProps.apiResult?.errorMessage) {
                    this.onError?.(resultProps.apiResult.errorMessage);
                }
            },
        });
    };

    render() {
        return (
            <Page data-test-selector="userSetupPage">
                <StyledForm {...styles.form} id="userSetupForm" onSubmit={this.handleFormSubmit} noValidate>
                    <Zone zoneName="Content" contentId={this.props.id} />
                </StyledForm>
            </Page>
        );
    }
}

const page: PageModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(withToaster(UserSetupPage))),
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: true,
        pageType: "System",
    },
};

export const UserSetupPageContext = "UserSetupPage";
export default page;
