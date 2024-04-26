import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { ImageModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import Img, { ImgProps } from "@insite/mobius/Img";
import { LazyImageProps } from "@insite/mobius/LazyImage";
import { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    product: ProductModel;
    image: ImageModel;
    useLargeImage?: boolean;
    onClick?: () => void;
    extendedStyles?: ProductPrimaryImageStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

export interface ProductPrimaryImageStyles {
    centeringWrapper?: InjectableCss;
    /**
     * @deprecated Not used anymore
     */
    hiddenWrapper?: InjectableCss;
    /**
     * @deprecated Not used anymore
     */
    spinner?: LoadingSpinnerProps;
    /**
     * @deprecated Use img instead
     */
    image?: LazyImageProps;
    img?: ImgProps;
}

export const productPrimaryImageStyles: ProductPrimaryImageStyles = {
    centeringWrapper: {
        css: css`
            min-height: 300px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                height: auto;
                max-width: 100%;
            }
        `,
    },
    image: {
        css: css`
            margin: auto;
            cursor: pointer;
        `,
    },
    img: {
        css: css`
            cursor: pointer;
        `,
    },
};

const ProductPrimaryImage = ({ productSettings, product, image, useLargeImage, onClick, extendedStyles }: Props) => {
    const [styles] = useState(() => mergeToNew(productPrimaryImageStyles, extendedStyles));

    if (!product) {
        return null;
    }

    useEffect(() => {
        if ((window as any).sirvScriptAdded) {
            return;
        }

        if (
            productSettings.imageProvider !== "SIRV" ||
            !product.images ||
            product.images.every(o => o.imageType !== "360")
        ) {
            return;
        }

        const script = document.createElement("script");
        script.src = "https://scripts.sirv.com/sirv.js";
        script.async = true;

        document.body.appendChild(script);
        (window as any).sirvScriptAdded = true;
    }, [productSettings.imageProvider, product]);

    const imageWrapperClickHandler = () => {
        onClick?.();
    };

    const imageWrapperKeyHandler: React.KeyboardEventHandler<HTMLImageElement> = event => {
        event.preventDefault();
        event.stopPropagation();
        if (event.key === "Enter") {
            onClick?.();
        }
    };

    const path = useLargeImage
        ? image.largeImagePath || image.mediumImagePath
        : image.mediumImagePath || image.largeImagePath;
    if (!path) {
        return null;
    }

    return (
        <>
            {image.imageType === "Static" && (
                <StyledWrapper {...styles.centeringWrapper} onClick={imageWrapperClickHandler}>
                    <Img
                        {...styles.img}
                        src={path}
                        altText={image.imageAltText}
                        loading="eager"
                        data-test-selector="productDetails_mainImage"
                        onKeyPress={imageWrapperKeyHandler}
                        tabIndex={0}
                    />
                </StyledWrapper>
            )}
            {image.imageType === "360" && productSettings.imageProvider === "SIRV" && (
                <div style={{ minHeight: 300 }} onClick={imageWrapperClickHandler}>
                    <div className="Sirv" key={image.id} data-src={image.mediumImagePath} />
                </div>
            )}
        </>
    );
};

export default connect(mapStateToProps)(ProductPrimaryImage);
