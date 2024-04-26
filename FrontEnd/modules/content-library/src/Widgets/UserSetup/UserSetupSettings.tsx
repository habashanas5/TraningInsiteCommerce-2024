import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setUserFields from "@insite/client-framework/Store/Pages/UserSetup/Handlers/SetUserFields";
import { getCurrentEditingUser } from "@insite/client-framework/Store/Pages/UserSetup/UserSetupSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { UserSetupPageContext } from "@insite/content-library/Pages/UserSetupPage";
import Select, { SelectPresentationProps, SelectProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    editingUser: getCurrentEditingUser(state),
});

const mapDispatchToProps = {
    setUserFields,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface UserSetupSettingsStyles {
    title?: TypographyPresentationProps;
    fieldset?: InjectableCss;
    wrapper?: InjectableCss;
    userRoleSelect?: SelectPresentationProps;
    approverSelect?: SelectPresentationProps;
}

export const userSetupSettingsStyles: UserSetupSettingsStyles = {
    title: { variant: "h5" },
    fieldset: {
        css: css`
            margin: 0;
            padding: 0;
            border: 0;
        `,
    },
    wrapper: {
        css: css`
            padding-bottom: 15px;
            font-weight: 400;
        `,
    },
};

const styles = userSetupSettingsStyles;
const StyledFieldSet = getStyledWrapper("fieldset");

const UserSetupSettings = ({ editingUser, setUserFields }: Props) => {
    if (!editingUser) {
        return null;
    }

    const userRoleChangeHandler: SelectProps["onChange"] = event => {
        setUserFields({ role: event.target.value });
    };

    const approverChangeHandler: SelectProps["onChange"] = event => {
        setUserFields({ approver: event.target.value });
    };

    return (
        <>
            <Typography as="h2" {...styles.title} data-test-selector="tst_userSetupSetting_title">
                {translate("Settings")}
            </Typography>
            <StyledFieldSet {...styles.fieldset}>
                <StyledWrapper {...styles.wrapper}>
                    <Select
                        {...styles.userRoleSelect}
                        label={translate("User Role")}
                        value={editingUser.role}
                        onChange={userRoleChangeHandler}
                        data-test-selector="tst_userSetupSetting_userRole"
                    >
                        <option value="">{translate("Select User Role")}</option>
                        {editingUser.availableRoles?.map(role => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </Select>
                </StyledWrapper>
                <StyledWrapper {...styles.wrapper}>
                    <Select
                        {...styles.approverSelect}
                        label={translate("Assign Approver")}
                        value={editingUser.approver}
                        onChange={approverChangeHandler}
                        data-test-selector="tst_userSetupSetting_assignApprover"
                    >
                        <option value="">{translate("Select an Approver")}</option>
                        {editingUser.availableApprovers?.map(approver => (
                            <option key={approver} value={approver}>
                                {approver}
                            </option>
                        ))}
                    </Select>
                </StyledWrapper>
            </StyledFieldSet>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(UserSetupSettings),
    definition: {
        group: "User Setup",
        displayName: "Settings",
        allowedContexts: [UserSetupPageContext],
    },
};

export default widgetModule;
