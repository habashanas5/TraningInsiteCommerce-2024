import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setSelectedImageIndex from "@insite/client-framework/Store/Pages/ProductDetails/Handlers/SetSelectedImageIndex";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductImageCarousel, {
    ProductImageCarouselStyles,
} from "@insite/content-library/Components/ProductImageCarousel";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import { ButtonProps } from "@insite/mobius/Button";
import { GridContainerProps } from "@insite/mobius/GridContainer";
import { GridItemProps } from "@insite/mobius/GridItem";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    selectedImageIndex: state.pages.productDetails.selectedImageIndex,
});

const mapDispatchToProps = {
    setSelectedImageIndex,
};

type Props = WidgetProps & HasProduct & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductDetailsImageCarouselStyles {
    imageCarousel?: ProductImageCarouselStyles;

    /**
     * @deprecated Use imageCarousel styles instead.
     */
    mainContainer?: GridContainerProps;
    prevArrowGridItem?: GridItemProps;
    prevArrowButton?: ButtonProps;
    carouselGridItem?: GridItemProps;
    carouselWrapper?: InjectableCss;
    carouselSlidesContainer?: InjectableCss;
    carouselSlide?: InjectableCss;
    carouselSlideInner?: InjectableCss;
    image?: LazyImageProps;
    selectedImage?: LazyImageProps;
    nextArrowGridItem?: GridItemProps;
    nextArrowButton?: ButtonProps;
}

export const productDetailsImageCarouselStyles: ProductDetailsImageCarouselStyles = {};

const styles = productDetailsImageCarouselStyles;

const ProductDetailsImageCarousel = ({ product, selectedImageIndex, setSelectedImageIndex }: Props) => {
    const selectImageHandler = (index: number) => {
        setSelectedImageIndex({ index });
    };

    if (!product || !product.images || product.images.length <= 1) {
        return null;
    }

    return (
        <ProductImageCarousel
            selectedIndex={selectedImageIndex}
            onSelectImage={selectImageHandler}
            extendedStyles={styles.imageCarousel}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductDetailsImageCarousel)),
    definition: {
        displayName: "Image Carousel",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
