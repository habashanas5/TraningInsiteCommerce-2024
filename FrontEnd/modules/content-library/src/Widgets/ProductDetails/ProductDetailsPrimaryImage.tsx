import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setSelectedImageIndex from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/SetSelectedImageIndex";
import { getSelectedImage } from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsSelectors";
import { ImageModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductImageCarousel, {
    ProductImageCarouselStyles,
} from "@insite/content-library/Components/ProductImageCarousel";
import ProductPrimaryImage, { ProductPrimaryImageStyles } from "@insite/content-library/Components/ProductPrimaryImage";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState, ownProps: HasProduct) => ({
    selectedImage: getSelectedImage(state, ownProps.product),
    selectedImageIndex: state.pages.productDetails.selectedImageIndex,
});

const mapDispatchToProps = {
    setSelectedImageIndex,
};

export interface ProductDetailsPrimaryImageStyles {
    /**
     * @deprecated Use primaryImage styles instead.
     */
    centeringWrapper?: InjectableCss;
    hiddenWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    image?: LazyImageProps;

    primaryImage?: ProductPrimaryImageStyles;
    fullPrimaryImageModal?: ModalPresentationProps;
    fullPrimaryImage?: ProductPrimaryImageStyles;
    imageCarousel?: ProductImageCarouselStyles;
}

export const primaryImageStyles: ProductDetailsPrimaryImageStyles = {
    fullPrimaryImageModal: {
        cssOverrides: {
            modalContainer: css`
                width: auto;
            `,
            modalBody: css`
                width: auto;
                max-width: initial;
                max-height: initial !important;
            `,
            modalTitle: css`
                border-bottom: none;
                padding: 10px 10px 0;
            `,
            modalContent: css`
                text-align: center;
            `,
        },
    },
    fullPrimaryImage: {
        image: {
            css: css`
                img {
                    width: auto;
                    max-height: 70vh;
                }
            `,
        },
        img: {
            css: css`
                width: auto;
                max-height: 70vh;
            `,
        },
    },
};

const styles = primaryImageStyles;

const ProductDetailsPrimaryImage: React.FC<Props> = ({
    product,
    selectedImage,
    selectedImageIndex,
    setSelectedImageIndex,
}) => {
    const [fullPrimaryImageModalIsOpen, setFullImageModalIsOpen] = React.useState(false);
    const imageClickHandler = () => {
        setFullImageModalIsOpen(true);
    };
    const fullPrimaryImageModalCloseHandler = () => {
        setFullImageModalIsOpen(false);
    };

    const selectImageHandler = (index: number) => {
        setSelectedImageIndex({ index });
    };

    if (!product) {
        return null;
    }

    const image =
        selectedImage ??
        ({
            id: product.id,
            imageAltText: product.imageAltText,
            imageType: "Static",
            largeImagePath: product.largeImagePath,
            mediumImagePath: product.mediumImagePath,
            smallImagePath: product.smallImagePath,
        } as ImageModel);

    const path = image.mediumImagePath || image.largeImagePath;
    if (!path) {
        return null;
    }

    return (
        <>
            <ProductPrimaryImage
                product={product}
                image={image}
                onClick={imageClickHandler}
                extendedStyles={styles.primaryImage}
            />
            <Modal
                {...styles.fullPrimaryImageModal}
                isOpen={fullPrimaryImageModalIsOpen}
                handleClose={fullPrimaryImageModalCloseHandler}
            >
                <ProductPrimaryImage
                    product={product}
                    image={image}
                    useLargeImage={true}
                    extendedStyles={styles.fullPrimaryImage}
                />
                {product.images && product.images.length > 1 && (
                    <ProductImageCarousel
                        selectedIndex={selectedImageIndex}
                        onSelectImage={selectImageHandler}
                        extendedStyles={styles.imageCarousel}
                    />
                )}
            </Modal>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(connect(mapStateToProps, mapDispatchToProps)(ProductDetailsPrimaryImage)),
    definition: {
        displayName: "Primary Image",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
