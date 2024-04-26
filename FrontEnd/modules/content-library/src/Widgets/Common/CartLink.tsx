import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Hidden from "@insite/mobius/Hidden";
import ShoppingBag from "@insite/mobius/Icons/ShoppingBag";
import ShoppingCart from "@insite/mobius/Icons/ShoppingCart";
import Truck from "@insite/mobius/Icons/Truck";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    visibilityState = "visibilityState",
    icon = "icon",
}

const mapStateToProps = (state: ApplicationState) => ({
    shouldLoadCart: !getCurrentCartState(state).value && !getCurrentCartState(state).isLoading,
    totalCountDisplay: getCurrentCartState(state).value?.totalCountDisplay,
    cartUrl: getPageLinkByPageType(state, "CartPage")?.url,
});

const mapDispatchToProps = {
    loadCurrentCart,
};

export interface CartLinkStyles {
    routerLink?: LinkPresentationProps;
    desktopCountText?: TypographyPresentationProps;
    mobileCountText?: TypographyPresentationProps;
}

export const cartLinkStyles: CartLinkStyles = {
    routerLink: {
        typographyProps: {
            variant: "headerSecondary",
        },
        icon: {
            iconProps: {
                size: 24,
            },
        },
        color: "secondary.contrast",
        css: css`
            height: 50px;
            padding: 0 4px 0 10px;
        `,
    },
};

const iconMap = {
    cart: ShoppingCart,
    truck: Truck,
    bag: ShoppingBag,
    none: undefined,
} as const;

interface OwnProps extends WidgetProps {
    fields: {
        [fields.visibilityState]: "both" | "label" | "icon";
        [fields.icon]: keyof typeof iconMap;
    };
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

/** Reloading the cart makes `totalCountDisplay` temporarily unavailable, so retain the previous value for better UX. */
let retainedTotalCountToDisplay: number | undefined;

const styles = cartLinkStyles;
const CartLink: FC<Props> = ({
    shouldLoadCart,
    cartUrl,
    totalCountDisplay,
    fields: { visibilityState, icon: selectedIcon },
    loadCurrentCart,
}) => {
    useEffect(() => {
        if (shouldLoadCart) {
            loadCurrentCart({ shouldLoadFullCart: false, replaceCart: false });
        }
    }, [shouldLoadCart]);

    const showIcon = visibilityState !== "label";
    const showLabel = visibilityState !== "icon";

    if (typeof totalCountDisplay !== "undefined") {
        retainedTotalCountToDisplay = totalCountDisplay;
    }

    const icon = iconMap[(showIcon && selectedIcon) || "none"];

    const { routerLink } = styles;

    return (
        <Link
            {...routerLink}
            href={cartUrl}
            icon={{ ...routerLink?.icon, iconProps: { src: icon, ...routerLink?.icon?.iconProps } }}
            data-test-selector="cartLink"
        >
            <Hidden below="lg" as="span">
                {showLabel && `${translate("Cart")} `}(
                <Typography as="span" {...styles.desktopCountText} data-test-selector="cartLinkQuantity">
                    {retainedTotalCountToDisplay}
                </Typography>
                )
            </Hidden>
            <Hidden above="md">
                <Typography as="span" {...styles.mobileCountText}>
                    {retainedTotalCountToDisplay}
                </Typography>
            </Hidden>
            <VisuallyHidden>{siteMessage("Header_CartCount")}</VisuallyHidden>
        </Link>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CartLink),
    definition: {
        displayName: "Cart",
        icon: "Link",
        fieldDefinitions: [
            {
                name: fields.visibilityState,
                displayName: "Settings",
                editorTemplate: "RadioButtonsField",
                options: [
                    {
                        displayName: "Show Both",
                        value: "both",
                    },
                    {
                        displayName: "Show Label Only",
                        value: "label",
                    },
                    {
                        displayName: "Show Icon Only",
                        value: "icon",
                    },
                ],
                defaultValue: "both",
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.icon,
                displayName: "Shopping Cart Icon",
                editorTemplate: "DropDownField",
                options: [
                    {
                        displayName: "None",
                        value: "none",
                    },
                    {
                        displayName: "Bag",
                        value: "bag",
                    },
                    {
                        displayName: "Cart",
                        value: "cart",
                    },
                    {
                        displayName: "Truck",
                        value: "truck",
                    },
                ],
                defaultValue: "cart",
                fieldType: "General",
                sortOrder: 2,
            },
        ],
        group: "Common",
    },
};

export default widgetModule;
