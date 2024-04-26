import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setDrawerIsOpen from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetDrawerIsOpen";
import { getFulfillmentLabel, getIsPunchOutSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { useMergeStyles } from "@insite/content-library/additionalStyles";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Drawer, { DrawerPresentationProps, DrawerProps } from "@insite/mobius/Drawer";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon/Icon";
import MapPin from "@insite/mobius/Icons/MapPin";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    fulfillmentLabel: getFulfillmentLabel(state),
    isDrawerOpen: state.components.addressDrawer.isOpen,
    isPunchOutSession: getIsPunchOutSession(state),
});

const mapDispatchToProps = {
    setDrawerIsOpen,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasShellContext;

export interface HeaderShipToAddressStyles {
    shipToAddressWrapper?: InjectableCss;
    titleClickable?: ClickablePresentationProps;
    titleIcon?: IconPresentationProps;
    titleTypography?: TypographyPresentationProps;
    drawer?: DrawerPresentationProps;
    drawerInShell?: DrawerPresentationProps;
    drawerInPunchOut?: DrawerPresentationProps;
}

const baseDrawerStyles: DrawerPresentationProps = {
    closeButtonProps: {
        shape: "pill",
        buttonType: "solid",
        color: "common.background",
        size: 36,
    },
    closeButtonIconProps: {
        src: "X",
        size: 24,
    },
    cssOverrides: {
        drawerContent: css`
            height: 100%;
            margin: 0 45px;
            overflow-y: inherit;
        `,
        drawerBody: css`
            background: ${getColor("common.background")};
            height: auto;
            max-height: 500px;
            overflow-x: inherit;
            overflow-y: inherit;
        `,
        drawerTitle: css`
            background: ${getColor("common.background")};
        `,
    },
    headlineTypographyProps: {
        color: "text.main",
    },
};

export const headerShipToAddressStyles: HeaderShipToAddressStyles = {
    shipToAddressWrapper: {
        css: css`
            display: inline-flex;
            width: 100%;
        `,
    },
    titleClickable: {
        css: css`
            margin-left: 10px;
            width: calc(100% - 10px);
        `,
    },
    titleIcon: {
        size: 22,
    },
    titleTypography: {
        css: css`
            margin-left: 10px;
        `,
        ellipsis: true,
        transform: "uppercase",
    },
    drawer: baseDrawerStyles,
    drawerInShell: {
        ...baseDrawerStyles,
        cssOverrides: {
            ...baseDrawerStyles.cssOverrides,
            drawerBody: css`
                background: ${getColor("common.background")};
                height: auto;
                overflow-x: inherit;
                overflow-y: inherit;
            `,
        },
    },
    drawerInPunchOut: {
        ...baseDrawerStyles,
        cssOverrides: {
            ...baseDrawerStyles.cssOverrides,
            drawerBody: css`
                background: ${getColor("common.background")};
                overflow-x: inherit;
                overflow-y: show;
            `,
        },
    },
};

interface OwnProps extends WidgetProps {
    fields: {};
}

const HeaderShipToAddress: FC<Props> = ({
    id,
    fulfillmentLabel,
    isDrawerOpen,
    setDrawerIsOpen,
    shellContext,
    isPunchOutSession,
}) => {
    const handleClickAddress = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDrawerIsOpen({ isOpen: !isDrawerOpen });
    };

    const handleCloseDrawer = () => {
        setDrawerIsOpen({ isOpen: false });
    };

    const styles = useMergeStyles("headerShipToAddress", headerShipToAddressStyles);

    let drawerStyles: DrawerPresentationProps | undefined;
    if (shellContext.isInShell && shellContext.isEditing) {
        drawerStyles = styles.drawerInShell;
    } else if (isPunchOutSession) {
        drawerStyles = styles.drawerInPunchOut;
    } else {
        drawerStyles = styles.drawer;
    }

    return (
        <>
            <StyledWrapper {...styles.shipToAddressWrapper}>
                <Clickable
                    {...styles.titleClickable}
                    onClick={handleClickAddress}
                    data-test-selector="header_shipToButton"
                >
                    {/* As this doesn't look final, but is the pattern on which the mobile nav drawer was based,
                    please also make changes to `NavigationDrawer.tsx` when you change this. */}
                    <Icon {...styles.titleIcon} src={MapPin} />
                    <Typography {...styles.titleTypography} data-test-selector="header_shipToLabel">
                        {fulfillmentLabel}
                    </Typography>
                </Clickable>
            </StyledWrapper>
            <Drawer
                {...drawerStyles}
                position="top"
                isOpen={isDrawerOpen}
                headline={isPunchOutSession ? "" : translate("Change Customer")}
                handleClose={handleCloseDrawer}
                data-test-selector="addressDrawer"
            >
                <Zone zoneName="Container" contentId={id} />
            </Drawer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withIsInShell(HeaderShipToAddress)),
    definition: {
        displayName: "Header Ship To Address Menu",
        icon: "MapPin",
        group: "Common",
    },
};

export default widgetModule;
