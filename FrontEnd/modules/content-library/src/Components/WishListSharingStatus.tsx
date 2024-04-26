import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setManageShareListModalIsOpen from "@insite/client-framework/Store/Components/ManageShareListModal/Handlers/SetManageShareListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import HelpCircle from "@insite/mobius/Icons/HelpCircle";
import Users from "@insite/mobius/Icons/Users";
import Link from "@insite/mobius/Link";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: WishListSharingStatusStyles;
    /**
     * @deprecated Use the `wishList.id` property instead.
     */
    isSharedList?: boolean;
    /**
     * @deprecated Use the `wishList.id` property instead.
     */
    wishListSharesCount?: number;
    /**
     * @deprecated Use the `wishList.id` property instead.
     */
    sharedByDisplayName?: string;
    wishList?: WishListModel;
    showNoPermissionsTooltip?: boolean;
}

const mapDispatchToProps = {
    setManageShareListModalIsOpen,
};

const mapStateToProps = (state: ApplicationState) => ({
    wishListSettings: getSettingsCollection(state).wishListSettings,
});

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface WishListSharingStatusStyles {
    statusText?: TypographyProps;
    privateIcon?: IconPresentationProps;
    sharedIcon?: IconPresentationProps;
    privateTooltip?: TooltipPresentationProps;
}

export const wishListSharingStatusStyles: WishListSharingStatusStyles = {
    privateIcon: {
        src: HelpCircle,
        size: 15,
        css: css`
            margin-left: 5px;
        `,
    },
    sharedIcon: {
        src: Users,
        size: 15,
        css: css`
            margin-right: 5px;
        `,
    },
};

const WishListSharingStatus: FC<Props> = ({
    extendedStyles,
    isSharedList,
    wishListSharesCount,
    sharedByDisplayName,
    wishList,
    setManageShareListModalIsOpen,
    wishListSettings,
    showNoPermissionsTooltip,
}) => {
    const [styles] = React.useState(() => mergeToNew(wishListSharingStatusStyles, extendedStyles));

    if (!wishListSettings?.allowMultipleWishLists || !wishListSettings?.allowListSharing) {
        return null;
    }

    const manageShareListClickHandler = () => {
        setManageShareListModalIsOpen({ modalIsOpen: true, wishListId: wishList?.id });
    };

    const isSharedListInner = isSharedList || wishList?.isSharedList || false;
    const wishListSharesCountInner = wishListSharesCount || wishList?.wishListSharesCount || 0;
    const sharedByDisplayNameInner = sharedByDisplayName || wishList?.sharedByDisplayName;

    return (
        <>
            {!isSharedListInner && wishListSharesCountInner === 0 && (
                <Typography {...styles.statusText}>
                    {translate("Private")}
                    <Tooltip {...styles.privateTooltip} text={siteMessage("Lists_Share_List_Tooltip") as string} />
                </Typography>
            )}
            {!isSharedListInner && wishListSharesCountInner > 0 && (
                <>
                    <Link {...styles.statusText} onClick={() => manageShareListClickHandler()}>
                        <Icon {...styles.sharedIcon} />
                        {translate("Shared with")} {wishListSharesCountInner} {translate("others")}
                    </Link>
                </>
            )}
            {isSharedListInner && sharedByDisplayNameInner && (
                <Typography {...styles.statusText}>
                    <Icon {...styles.sharedIcon} />
                    {translate("Shared by")} {sharedByDisplayNameInner}
                    {!wishList?.allowEdit && showNoPermissionsTooltip && (
                        <Tooltip
                            {...styles.privateTooltip}
                            text={siteMessage("Lists_Share_List_No_Permissions_Tooltip") as string}
                        />
                    )}
                </Typography>
            )}
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(WishListSharingStatus);
