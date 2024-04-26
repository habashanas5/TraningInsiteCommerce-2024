import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentUserIsGuest, getIsPunchOutSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import cancelPunchOut from "@insite/client-framework/Store/Context/Handlers/CancelPunchOut";
import signOut from "@insite/client-framework/Store/Context/Handlers/SignOut";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import { ChangeCustomerPageContext } from "@insite/content-library/Pages/ChangeCustomerPage";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon/Icon";
import User from "@insite/mobius/Icons/User";
import Menu from "@insite/mobius/Menu";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    visibilityState = "visibilityState",
    icon = "icon",
    includeAccountMenu = "includeAccountMenu",
}

const mapStateToProps = (state: ApplicationState) => ({
    isSignInPage: getCurrentPage(state).type === "SignInPage",
    userName: state.context.session.userName,
    myAccountPageLink: getPageLinkByPageType(state, "MyAccountPage"),
    signInUrl: getPageLinkByPageType(state, "SignInPage")?.url,
    currentUserIsGuest: getCurrentUserIsGuest(state),
    isPunchOutSession: getIsPunchOutSession(state),
    currentLocation: getLocation(state),
    displayChangeCustomerLink: state.context.session?.displayChangeCustomerLink || false,
});

const mapDispatchToProps = {
    signOut,
    cancelPunchOut,
};

export interface HeaderSignInStyles {
    signOutWrapper?: InjectableCss;
    titleClickable?: ClickablePresentationProps;
    titleIcon?: IconPresentationProps;
    titleTypography?: TypographyPresentationProps;
    signOutClickable?: ClickablePresentationProps;
}

export const headerSignInStyles: HeaderSignInStyles = {
    signOutWrapper: {
        css: css`
            display: inline-flex;
        `,
    },
    titleClickable: {
        css: css`
            margin-left: 10px;
        `,
    },
    titleIcon: {
        size: 22,
    },
    titleTypography: {
        css: css`
            margin-left: 10px;
            max-width: 150px;
        `,
        ellipsis: true,
        transform: "uppercase",
    },
    signOutClickable: {
        css: css`
            flex: 0 0 auto;
            margin-left: 30px;
            text-transform: uppercase;
        `,
    },
};

interface OwnProps extends WidgetProps {
    fields: {
        [fields.visibilityState]: string;
        [fields.icon]: string;
        [fields.includeAccountMenu]: boolean;
    };
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

let icon: React.ComponentType;
export const HeaderSignIn = ({
    userName,
    isSignInPage,
    currentUserIsGuest,
    signOut,
    cancelPunchOut,
    fields,
    history,
    myAccountPageLink,
    signInUrl,
    isPunchOutSession,
    currentLocation,
    displayChangeCustomerLink,
}: Props) => {
    const showIcon = fields.visibilityState === "both" || fields.visibilityState === "icon";
    const showLabel = fields.visibilityState === "both" || fields.visibilityState === "label";

    if (fields.icon === "User") {
        icon = User;
    }

    const styles = useMergeStyles("headerSignIn", headerSignInStyles);

    const onSignInHandler = () => {
        if ((!userName || currentUserIsGuest) && !isSignInPage) {
            if (!signInUrl) {
                logger.warn("No url was found for SignInPage, defaulting to /SignIn");
                history.push("/MyAccount/SignIn");
            } else {
                const returnUrl = currentLocation.pathname + currentLocation.search;
                if (returnUrl === "/") {
                    history.push(`${signInUrl}`);
                } else {
                    history.push(`${signInUrl}?returnUrl=${encodeURIComponent(returnUrl)}`);
                }
            }
        }
    };

    const onSignOutHandler = () => {
        isPunchOutSession ? cancelPunchOut() : signOut();
    };

    let signInStatusText = translate("Sign In");
    if (userName && !currentUserIsGuest) {
        signInStatusText = userName;
    }

    return (
        <StyledWrapper {...styles.signOutWrapper}>
            {fields.includeAccountMenu && userName && !currentUserIsGuest && (
                <Menu
                    descriptionId="accountMenu"
                    menuItems={
                        myAccountPageLink?.children?.filter(
                            pageLink => !(pageLink.type === ChangeCustomerPageContext && !displayChangeCustomerLink),
                        ) ?? []
                    }
                    displayChangeCustomerLink={displayChangeCustomerLink}
                    maxDepth={1}
                    menuTrigger={
                        <Clickable {...styles.titleClickable} data-test-selector="header_signIn">
                            {showIcon && <Icon {...styles.titleIcon} src={icon} />}
                            {showLabel && (
                                <Typography {...styles.titleTypography} data-test-selector="header_userName">
                                    {userName}
                                </Typography>
                            )}
                        </Clickable>
                    }
                    cssOverrides={{
                        wrapper: css`
                            flex: 0 1 auto;
                            min-width: 0;
                        `,
                    }}
                    data-test-selector="header_accountMenu"
                />
            )}
            {(!fields.includeAccountMenu || !userName || (userName && currentUserIsGuest)) && (
                <Clickable {...styles.titleClickable} onClick={onSignInHandler} data-test-selector="header_signIn">
                    {showIcon && <Icon {...styles.titleIcon} src={icon} />}
                    {showLabel && <Typography {...styles.titleTypography}>{signInStatusText}</Typography>}
                </Clickable>
            )}
            {userName && !currentUserIsGuest && (
                <Clickable
                    {...styles.signOutClickable}
                    onClick={onSignOutHandler}
                    data-test-selector="headerSignOutLink"
                >
                    {isPunchOutSession ? translate("Cancel PunchOut") : translate("Sign Out")}
                </Clickable>
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(HeaderSignIn)),
    definition: {
        displayName: "Header Sign In",
        icon: "User",
        fieldDefinitions: [
            {
                name: fields.visibilityState,
                displayName: "Settings",
                editorTemplate: "RadioButtonsField",
                options: [
                    {
                        displayName: "Both",
                        value: "both",
                    },
                    {
                        displayName: "Show Label",
                        value: "label",
                    },
                    {
                        displayName: "Show Icon",
                        value: "icon",
                    },
                ],
                defaultValue: "both",
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.icon,
                displayName: "SignIn Icon",
                editorTemplate: "DropDownField",
                options: [
                    {
                        displayName: "User",
                        value: "User",
                    },
                ],
                defaultValue: "User",
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.includeAccountMenu,
                displayName: "Include My Account Menu",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
        ],
        group: "Common",
    },
};

export default widgetModule;
