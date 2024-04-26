import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import { BrandDto } from "@insite/client-framework/Types/ApiModels";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    brand: BrandDto;
    /**
     * If true, the small brand logo will be displayed.
     * If false, the brand name will be displayed instead.
     * Default value: false */
    showLogo?: boolean;
    extendedStyles?: ProductBrandStyles;
}

type Props = OwnProps;

export interface ProductBrandStyles {
    logoImage?: LazyImageProps;
    nameLink?: LinkPresentationProps;
    nameText?: TypographyProps;
}

const nameText: TypographyProps = {
    css: css`
        width: 100%;
        ${wrapInContainerStyles}
    `,
    size: "13px",
    weight: 600,
};

export const productBrandStyles: ProductBrandStyles = {
    nameText,
    nameLink: {
        css: css`
            width: 100%;
        `,
        typographyProps: nameText,
    },
};

const ProductBrand: FC<Props> = ({ brand, showLogo = false, extendedStyles }) => {
    if (!brand) {
        return null;
    }

    const [styles] = React.useState(() => mergeToNew(productBrandStyles, extendedStyles));

    let brandDisplay;
    if (showLogo && brand.logoSmallImagePath) {
        const altText = brand.logoImageAltText || brand.name;
        brandDisplay = <LazyImage {...styles.logoImage} src={brand.logoSmallImagePath} altText={altText} />;
    } else {
        brandDisplay = brand.detailPagePath ? (
            brand.name
        ) : (
            <Typography {...styles.nameText} data-test-selector="brandName">
                {brand.name}
            </Typography>
        );
    }

    return brand.detailPagePath ? (
        <Link {...styles.nameLink} href={brand.detailPagePath} data-test-selector="brandLink">
            {brandDisplay}
        </Link>
    ) : (
        <>{brandDisplay}</>
    );
};

export default ProductBrand;
