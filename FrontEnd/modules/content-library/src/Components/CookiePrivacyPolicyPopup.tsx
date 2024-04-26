import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import useAppSelector from "@insite/client-framework/Common/Hooks/useAppSelector";
import useGetSetting from "@insite/client-framework/Common/Hooks/useGetSetting";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import Drawer, { DrawerPresentationProps } from "@insite/mobius/Drawer";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import X from "@insite/mobius/Icons/X";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { useEffect, useState } from "react";
import { css } from "styled-components";

export interface CookiePrivacyPolicyPopupStyles {
    drawer?: DrawerPresentationProps;
    container?: GridContainerProps;
    messageGridItem?: GridItemProps;
    messageText?: TypographyPresentationProps;
    acceptGridItem?: GridItemProps;
    acceptButton?: ButtonPresentationProps;
    closeGridItem?: GridItemProps;
    closeButton?: ButtonPresentationProps;
}

export const cookiePrivacyPolicyPopupStyles: CookiePrivacyPolicyPopupStyles = {
    drawer: {
        position: "bottom",
        size: 100,
        cssOverrides: {
            drawerTitle: css`
                display: none;
            `,
            drawerContent: css`
                padding: 15px;
                margin: 0 auto;
                width: 100%;
            `,
        },
        closeButtonProps: {
            css: css`
                display: none;
            `,
        },
        enableClickThrough: true,
    },
    container: {
        gap: 10,
        css: css`
            margin: 0 auto;
        `,
    },
    messageGridItem: {
        width: [12, 12, 7, 9, 9],
    },
    acceptGridItem: {
        width: [8, 9, 3, 2, 2],
    },
    acceptButton: {
        css: css`
            width: 100%;
        `,
    },
    closeGridItem: {
        width: [4, 3, 2, 1, 1],
    },
    closeButton: {
        css: css`
            width: 100%;
        `,
        variant: "secondary",
    },
};

const styles = cookiePrivacyPolicyPopupStyles;

const CookiePrivacyPolicyPopup = () => {
    const location = useAppSelector(o => getLocation(o));
    const enableCookiePrivacyPolicyPopup = useGetSetting(o => o.websiteSettings.enableCookiePrivacyPolicyPopup);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (enableCookiePrivacyPolicyPopup && !getCookie("acceptCookies")) {
            setIsOpen(true);
        }
    }, [location.pathname]);

    const acceptHandler = () => {
        setIsOpen(false);
        setCookie("acceptCookies", "true", { expires: 365 });
    };

    const closeHandler = () => {
        setIsOpen(false);
    };

    return (
        <Drawer isOpen={isOpen} {...styles.drawer}>
            <GridContainer {...styles.container}>
                <GridItem {...styles.messageGridItem}>
                    <Typography {...styles.messageText}>{siteMessage("Core_CookiePrivacyPolicy")}</Typography>
                </GridItem>
                <GridItem {...styles.acceptGridItem}>
                    <Button {...styles.acceptButton} onClick={acceptHandler}>
                        {siteMessage("Core_CookiePrivacyPolicyAccept")}
                    </Button>
                </GridItem>
                <GridItem {...styles.closeGridItem}>
                    <Button {...styles.closeButton} onClick={closeHandler}>
                        <ButtonIcon src={X} />
                    </Button>
                </GridItem>
            </GridContainer>
        </Drawer>
    );
};

export default CookiePrivacyPolicyPopup;
