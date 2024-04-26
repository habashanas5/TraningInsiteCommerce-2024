import { getCookie } from "@insite/client-framework/Common/Cookies";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import resetReCaptcha from "@insite/client-framework/Store/Components/ReCaptcha/Handlers/ResetReCaptcha";
import validateReCaptcha from "@insite/client-framework/Store/Components/ReCaptcha/Handlers/ValidateReCaptcha";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import ReCaptchaV2 from "@matt-block/react-recaptcha-v2";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    location: string;
}

const mapStateToProps = (state: ApplicationState, { location }: OwnProps) => {
    const { websiteSettings } = getSettingsCollection(state);
    const session = getSession(state);
    return {
        siteKey: websiteSettings.reCaptchaSiteKey,
        isEnabled: (websiteSettings as { [key: string]: any })[`reCaptchaEnabledFor${location}`],
        isAuthenticated: session && (session.isAuthenticated || session.rememberMe) && !session.isGuest,
        errorMessage: state.components.reCaptcha.errorMessage,
    };
};

const mapDispatchToProps = {
    validateReCaptcha,
    resetReCaptcha,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ReCaptchaStyles {
    wrapper?: InjectableCss;
    errorMessageText?: TypographyPresentationProps;
}

export const reCaptchaStyles: ReCaptchaStyles = {
    errorMessageText: {
        color: "danger",
        css: css`
            margin-top: 5px;
        `,
    },
};

const styles = reCaptchaStyles;

const ReCaptcha = ({ siteKey, isEnabled, isAuthenticated, errorMessage, validateReCaptcha, resetReCaptcha }: Props) => {
    const [firstRender, setFirstRender] = useState(true);
    useEffect(() => {
        setFirstRender(false);
        resetReCaptcha();
    }, []);

    const handleSuccess = () => {
        validateReCaptcha();
    };

    if (firstRender || !isEnabled || isAuthenticated || !!getCookie("g-recaptcha-verified")) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper} id="reCaptcha">
            <ReCaptchaV2 siteKey={siteKey} onSuccess={handleSuccess} />
            {errorMessage && (
                <Typography as="p" {...styles.errorMessageText}>
                    {errorMessage}
                </Typography>
            )}
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReCaptcha);
