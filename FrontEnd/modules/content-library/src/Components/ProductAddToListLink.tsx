import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import translate from "@insite/client-framework/Translate";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    labelOverride?: string;
    extendedStyles?: ProductAddToListLinkStyles;
}

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasProductContext;

const mapStateToProps = (state: ApplicationState) => ({
    wishListSettings: getSettingsCollection(state).wishListSettings,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

export interface ProductAddToListLinkStyles {
    link?: LinkPresentationProps;
}

export const productAddToListLinkStyles: ProductAddToListLinkStyles = {};

/**
 * @deprecated Use productAddToListLinkStyles instead.
 */
export const productAddToListLink = productAddToListLinkStyles;

const ProductAddToListLink: React.FC<Props> = ({
    productContext: { product, productInfo },
    wishListSettings,
    labelOverride,
    setAddToListModalIsOpen,
    addToWishList,
    extendedStyles,
    ...otherProps
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(productAddToListLink, extendedStyles));

    if (!product.canAddToWishlist) {
        return null;
    }

    const addToListLinkClickHandler = () => {
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                productInfos: [productInfo],
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
                onComplete(resultProps) {
                    if (resultProps.result?.wishList) {
                        // "this" is targeting the object being created, not the parent SFC
                        // eslint-disable-next-line react/no-this-in-sfc
                        this.onSuccess?.(resultProps.result?.wishList);
                    } else if (resultProps.result?.errorMessage) {
                        toasterContext.addToast({ body: resultProps.result?.errorMessage, messageType: "danger" });
                    }
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos: [productInfo] });
    };

    return (
        <Link
            {...styles.link}
            onClick={addToListLinkClickHandler}
            disabled={productInfo.qtyOrdered <= 0}
            {...otherProps}
        >
            {labelOverride ?? translate("Add to List")}
        </Link>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withProductContext(ProductAddToListLink));
