import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updatePassword from "@insite/client-framework/Store/Context/Handlers/UpdatePassword";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { AccountSettingsModel } from "@insite/client-framework/Types/ApiModels";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    password: string;
    newPassword: string;
    confirmNewPassword: string;
    error: boolean;
    showValidation: boolean;
    setShowValidation: (showValidation: boolean) => void;
}

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
    accountSettingsPageLink: getPageLinkByPageType(state, "AccountSettingsPage"),
});

const mapDispatchToProps = {
    updatePassword,
};

type Props = HasHistory & OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface ChangePasswordActionsStyles {
    headerGridContainer?: GridContainerProps;
    saveButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
    buttonGridContainer?: GridContainerProps;
    buttonGridItem?: GridItemProps;
}

export const changePasswordActionsStyles: ChangePasswordActionsStyles = {
    saveButton: {
        css: css`
            width: 100%;
        `,
    },
    cancelButton: {
        css: css`
            width: 100%;
        `,
    },
    buttonGridContainer: {
        gap: 5,
    },
    buttonGridItem: {
        width: 6,
    },
};

const styles = changePasswordActionsStyles;

const digitRegExp = /[0-9]/;
const lowerRegExp = /[a-z]/;
const upperRegExp = /[A-Z]/;
const specialRegExp = /\W/;

const validatePassword = (password: string, settings: AccountSettingsModel) => {
    let passwordError = "";
    const {
        passwordMinimumLength,
        passwordRequiresDigit,
        passwordRequiresLowercase,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
    } = settings;

    if (password.length > 0 && password.length < passwordMinimumLength) {
        passwordError = translate("Password must be at least {0} characters long", passwordMinimumLength.toString());
    }

    if (!passwordError && passwordRequiresDigit && !digitRegExp.test(password)) {
        passwordError = translate("Password must include at least one number");
    }

    if (!passwordError && passwordRequiresLowercase && !lowerRegExp.test(password)) {
        passwordError = translate("Password must include at least one lowercase character");
    }

    if (!passwordError && passwordRequiresUppercase && !upperRegExp.test(password)) {
        passwordError = translate("Password must include at least one uppercase character");
    }

    if (!passwordError && passwordRequiresSpecialCharacter && !specialRegExp.test(password)) {
        passwordError = translate("Password must include at least one non alphanumeric character");
    }

    return passwordError;
};

const ChangePasswordActions = ({
    accountSettings,
    accountSettingsPageLink,
    password,
    newPassword,
    confirmNewPassword,
    error,
    showValidation,
    setShowValidation,
    updatePassword,
    history,
}: Props) => {
    const toasterContext = useContext(ToasterContext);
    const onSaveClick = (error?: string) => {
        if (error) {
            toasterContext.addToast({
                body: error,
                messageType: "danger",
            });

            return;
        }

        toasterContext.addToast({
            body: translate("Password Updated"),
            messageType: "success",
        });

        history.push(accountSettingsPageLink!.url);
    };

    const updatePasswordHandler = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        onApiResponse: (error?: string) => void,
    ) => {
        e.preventDefault();
        if (error) {
            setShowValidation(true);
            return;
        }

        const errorMessage = validatePassword(newPassword, accountSettings);
        if (errorMessage) {
            toasterContext.addToast({
                body: errorMessage,
                messageType: "danger",
            });
            setShowValidation(true);
            return;
        }

        updatePassword({
            password,
            newPassword,
            onApiResponse,
        });
    };

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        history.push(accountSettingsPageLink!.url);
    };

    const disableSaveButton = !password || !newPassword || !confirmNewPassword || (error && showValidation);

    return (
        <GridContainer {...styles.buttonGridContainer}>
            <GridItem {...styles.buttonGridItem}>
                <Button {...styles.cancelButton} onClick={e => onCancelClick(e)}>
                    {translate("Cancel")}
                </Button>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Button
                    {...styles.saveButton}
                    onClick={event => {
                        updatePasswordHandler(event, onSaveClick);
                    }}
                    disabled={disableSaveButton}
                >
                    {translate("Save")}
                </Button>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(ChangePasswordActions));
