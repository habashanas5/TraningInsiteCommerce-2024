import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { AutocompleteItemModel, ProductAutocompleteItemModel } from "@insite/client-framework/Types/ApiModels";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { css } from "styled-components";

interface Props {
    products: ProductAutocompleteItemModel[];
    focusedItem?: AutocompleteItemModel;
    goToUrl: (url: string) => void;
    extendedStyles?: AutocompleteProductsStyles;
}

export interface AutocompleteProductsStyles {
    headerText?: TypographyPresentationProps;
    container?: GridContainerProps;
    focusedContainer?: GridContainerProps;
    imageGridItem?: GridItemProps;
    image?: LazyImageProps;
    infoGridItem?: GridItemProps;
    titleLink?: LinkPresentationProps;
    erpNumberText?: TypographyPresentationProps;
}

export const autocompleteProductsStyles: AutocompleteProductsStyles = {
    headerText: {
        weight: "bold",
        css: css`
            text-align: left;
            margin: 10px 0 5px 0;
        `,
    },
    container: {
        gap: 0,
        css: css`
            flex-grow: 0;
            margin: 5px 0;
            cursor: pointer;
        `,
    },
    focusedContainer: {
        gap: 0,
        css: css`
            flex-grow: 0;
            margin: 5px 0;
            cursor: pointer;
            background-color: lightgray;
        `,
    },
    imageGridItem: {
        width: 3,
        css: css`
            max-width: 65px;
            max-height: 50px;
            flex-basis: 65px;
        `,
    },
    image: {
        width: "50px",
        css: css`
            img {
                height: 100%;
            }
        `,
    },
    infoGridItem: {
        width: 9,
        css: css`
            flex-direction: column;
            max-width: calc(100% - 65px);
            flex-basis: calc(100% - 65px);
        `,
    },
    titleLink: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 0;
            `,
        },
        css: css`
            width: 270px;
        `,
    },
    erpNumberText: {
        ellipsis: true,
        css: css`
            width: 270px;
            text-align: left;
            margin: 5px 0 0 0;
        `,
    },
};

const styles = autocompleteProductsStyles;

class AutocompleteProducts extends React.Component<Props> {
    private readonly styles: AutocompleteProductsStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(styles, props.extendedStyles);
    }

    render() {
        const { products } = this.props;
        const styles = this.styles;
        return (
            <>
                <Typography {...styles.headerText}>{translate("Products")}</Typography>
                {products.map(product => (
                    <GridContainer
                        {...(this.props.focusedItem === product ? styles.focusedContainer : styles.container)}
                        key={product.id!}
                        onClick={() => {
                            this.props.goToUrl(product.url);
                        }}
                    >
                        <GridItem {...styles.imageGridItem}>
                            <LazyImage {...styles.image} src={product.image} />
                        </GridItem>
                        <GridItem {...styles.infoGridItem}>
                            <Link {...styles.titleLink}>{product.displayTitle}</Link>
                            <Typography {...styles.erpNumberText}>{product.displayErpNumber}</Typography>
                        </GridItem>
                    </GridContainer>
                ))}
            </>
        );
    }
}

export default AutocompleteProducts;
