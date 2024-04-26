import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { BannerStyles } from "@insite/content-library/Widgets/Basic/Banner";
import { ButtonStyles } from "@insite/content-library/Widgets/Basic/Button";
import { ImageStyles } from "@insite/content-library/Widgets/Basic/Image";
import { ItemListStyles } from "@insite/content-library/Widgets/Basic/ItemList";
import { LinkListStyles } from "@insite/content-library/Widgets/Basic/LinkList";
import { LogoStyles } from "@insite/content-library/Widgets/Basic/Logo";
import { QuickOrderStyles } from "@insite/content-library/Widgets/Basic/QuickOrder";
import { RichContentStyles } from "@insite/content-library/Widgets/Basic/RichContent";
import { SlideshowStyles } from "@insite/content-library/Widgets/Basic/Slideshow";
import { LinkListStyles as SocialLinkListStyles } from "@insite/content-library/Widgets/Basic/SocialLinks";
import { SubscribeStyles } from "@insite/content-library/Widgets/Basic/Subscribe";
import { CurrencyMenuStyles } from "@insite/content-library/Widgets/Common/CurrencyMenu";
import { HeaderShipToAddressStyles } from "@insite/content-library/Widgets/Common/HeaderShipToAddress";
import { HeaderSignInStyles } from "@insite/content-library/Widgets/Common/HeaderSignIn";
import { LanguageMenuStyles } from "@insite/content-library/Widgets/Common/LanguageMenu";
import { HeaderLinkListStyles } from "@insite/content-library/Widgets/Header/HeaderLinkList";
import { HeaderSearchInputStyles } from "@insite/content-library/Widgets/Header/HeaderSearchInput";
import { MainNavigationStyles } from "@insite/content-library/Widgets/Header/MainNavigation";
import { SecondaryNavigationStyles } from "@insite/content-library/Widgets/Header/SecondaryNavigation";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";

export interface Styles {
    banner?: BannerStyles;
    button?: ButtonStyles;
    image?: ImageStyles;
    itemList?: ItemListStyles;
    linkList?: LinkListStyles;
    logo?: LogoStyles;
    quickOrder?: QuickOrderStyles;
    slideshow?: SlideshowStyles;
    socialLinks?: SocialLinkListStyles;
    subscribe?: Partial<SubscribeStyles>;
    secondaryNavigation?: SecondaryNavigationStyles;
    headerLinkList?: HeaderLinkListStyles;
    headerSearchInput?: HeaderSearchInputStyles;
    headerSignIn?: HeaderSignInStyles;
    headerShipToAddress?: HeaderShipToAddressStyles;
    currencyMenu?: CurrencyMenuStyles;
    languageMenu?: LanguageMenuStyles;
    link?: InjectableCss;
    richContent?: RichContentStyles;
    mainNavigation?: Partial<MainNavigationStyles>;
}

type ComponentStyles =
    | BannerStyles
    | ButtonStyles
    | ImageStyles
    | ItemListStyles
    | LinkListStyles
    | LogoStyles
    | QuickOrderStyles
    | SlideshowStyles
    | SocialLinkListStyles
    | Partial<SubscribeStyles>
    | SecondaryNavigationStyles
    | HeaderLinkListStyles
    | HeaderSearchInputStyles
    | HeaderSignInStyles
    | HeaderShipToAddressStyles
    | CurrencyMenuStyles
    | LanguageMenuStyles
    | InjectableCss
    | RichContentStyles
    | Partial<MainNavigationStyles>;

interface StylesContextType {
    styles?: Styles;
}

export const StylesContext = React.createContext<StylesContextType>({});

export const StylesProvider = (
    { styles, children }: { styles: Styles; children: JSX.Element | JSX.Element[] },
    index: number,
) => {
    return <StylesContext.Provider value={{ styles }}>{children}</StylesContext.Provider>;
};

export function useMergeStyles(
    componentKey: keyof Styles,
    componentStyles: ComponentStyles = {},
    extendedStyles: any = {},
) {
    const { styles } = React.useContext(StylesContext);

    return React.useMemo(() => {
        if (!styles || !componentKey) {
            return mergeToNew(componentStyles, extendedStyles);
        }
        const yourPassedInStyles = styles[componentKey] ?? {};

        return mergeToNew(mergeToNew(componentStyles, extendedStyles), yourPassedInStyles);
    }, [componentStyles, styles]);
}
