import { BrandStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BrandDetailsPageContext } from "@insite/content-library/Pages/BrandDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC, useContext } from "react";
import { css } from "styled-components";

interface Props extends WidgetProps {}

export interface BrandDetailsImageStyles {
    container?: GridContainerProps;
    imageItem?: GridItemProps;
    image?: LazyImageProps;
    imageMissingText?: TypographyPresentationProps;
    linksItem?: GridItemProps;
    linksContainer?: GridContainerProps;
    productLinkItem?: GridItemProps;
    productLink?: LinkPresentationProps;
    externalLinkItem?: GridItemProps;
    externalLink?: LinkPresentationProps;
}

export const imageStyles: BrandDetailsImageStyles = {
    container: {
        gap: 5,
        css: css`
            margin: 15px;
        `,
    },
    imageItem: {
        width: 12,
    },
    linksItem: {
        width: 12,
    },
    linksContainer: {
        gap: 20,
        css: css`
            padding-top: 15px;
        `,
    },
    image: {
        css: css`
            img {
                height: 100%;
            }
        `,
    },
    imageMissingText: {
        variant: "h3",
        css: css`
            width: 100%;
            overflow-wrap: break-word;
            word-wrap: break-word;
        `,
    },
    productLinkItem: {
        width: 12,
        css: css`
            justify-content: center;
            text-align: center;
        `,
    },
    externalLinkItem: {
        width: 12,
        css: css`
            justify-content: center;
            text-align: center;
        `,
    },
};

const styles = imageStyles;

const BrandDetailsImage: FC<Props> = () => {
    const { value: brand } = useContext(BrandStateContext);
    if (!brand) {
        return null;
    }

    return (
        <GridContainer data-test-selector="brandImage" {...styles.container}>
            <GridItem {...styles.imageItem}>
                {brand.featuredImagePath ? (
                    <LazyImage
                        data-test-selector="brandFeaturedImage"
                        altText={brand.featuredImageAltText}
                        src={brand.featuredImagePath}
                        {...styles.image}
                    />
                ) : (
                    <Typography data-test-selector="brandFeaturedImageMissingText" {...styles.imageMissingText}>
                        {brand.name}
                    </Typography>
                )}
            </GridItem>
            <GridItem {...styles.linksItem}>
                <GridContainer {...styles.linksContainer}>
                    <GridItem {...styles.productLinkItem}>
                        <Link
                            data-test-selector="brandToProductPageLink"
                            href={brand.productListPagePath}
                            {...styles.productLink}
                        >
                            {translate("Shop All {0} Products").replace("{0}", brand.name)}
                        </Link>
                    </GridItem>
                    {brand.externalUrl && (
                        <GridItem {...styles.externalLinkItem}>
                            <Link
                                data-test-selector="brandExternalUrlLink"
                                href={brand.externalUrl}
                                {...styles.externalLink}
                            >
                                {translate("Visit {0} Website").replace("{0}", brand.name)}
                            </Link>
                        </GridItem>
                    )}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

interface BrandDetailsLinkProps {
    path?: string;
    gridItemStyles?: GridItemProps;
    linkStyles?: LinkPresentationProps;
}

const BrandLink: FC<BrandDetailsLinkProps> = ({ path, gridItemStyles, linkStyles, children }) => {
    if (!path) {
        return null;
    }
    return (
        <GridItem {...gridItemStyles}>
            <Link data-test-selector="brandToProductPageLink" href={path} {...linkStyles}>
                {children}
            </Link>
        </GridItem>
    );
};

const widgetModule: WidgetModule = {
    component: BrandDetailsImage,
    definition: {
        group: "Brand Details",
        icon: "Image",
        displayName: "Brand Image",
        allowedContexts: [BrandDetailsPageContext],
    },
};

export default widgetModule;
