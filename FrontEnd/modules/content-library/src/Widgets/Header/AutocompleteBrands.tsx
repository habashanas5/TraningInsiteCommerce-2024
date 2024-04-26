import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { AutocompleteItemModel, BrandAutocompleteModel } from "@insite/client-framework/Types/ApiModels";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { Fragment } from "react";
import { css } from "styled-components";

interface Props {
    brands: BrandAutocompleteModel[] | null;
    focusedItem?: AutocompleteItemModel;
    goToUrl: (url: string) => void;
    extendedStyles?: AutocompleteBrandsStyles;
}

export interface AutocompleteBrandsStyles {
    headerText?: TypographyPresentationProps;
    brandItemText?: TypographyPresentationProps;
    focusedBrandItemText?: TypographyPresentationProps;
    link?: LinkPresentationProps;
    focusedLink?: LinkPresentationProps;
}

export const autocompleteBrandsStyles: AutocompleteBrandsStyles = {
    headerText: {
        weight: "bold",
        css: css`
            text-align: left;
            margin: 10px 0 5px 0;
        `,
    },
    brandItemText: {
        ellipsis: true,
        css: css`
            width: 100%;
            text-align: left;
            cursor: pointer;
        `,
    },
    focusedBrandItemText: {
        ellipsis: true,
        css: css`
            width: 100%;
            text-align: left;
            cursor: pointer;
            background-color: lightgray;
        `,
    },
    link: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 5px 0;
            `,
        },
        css: css`
            width: auto;
            overflow: hidden;
        `,
    },
    focusedLink: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 5px 0;
            `,
        },
        css: css`
            width: auto;
            overflow: hidden;
            background-color: lightgray;
        `,
    },
};

const styles = autocompleteBrandsStyles;

class AutocompleteBrands extends React.Component<Props> {
    private readonly styles: AutocompleteBrandsStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(styles, props.extendedStyles);
    }

    render() {
        const { brands } = this.props;
        if (!brands || brands.length === 0) {
            return null;
        }

        const styles = this.styles;
        return (
            <>
                <Typography {...styles.headerText}>{translate("Brands")}</Typography>
                {brands.map(brand => (
                    <Fragment key={`${brand.id}_${brand.productLineId}`}>
                        {brand.productLineName && (
                            <Typography
                                {...(this.props.focusedItem === brand
                                    ? styles.focusedBrandItemText
                                    : styles.brandItemText)}
                                onClick={() => {
                                    this.props.goToUrl(brand.url);
                                }}
                            >
                                <Link {...styles.link}>{brand.displayProductLineName}</Link>
                                <>{` ${translate("in")}`}</> {brand.displayTitle}
                            </Typography>
                        )}
                        {!brand.productLineName && (
                            <Link
                                {...(this.props.focusedItem === brand ? styles.focusedLink : styles.link)}
                                onClick={() => {
                                    this.props.goToUrl(brand.url);
                                }}
                            >
                                {brand.displayTitle}
                            </Link>
                        )}
                    </Fragment>
                ))}
            </>
        );
    }
}

export default AutocompleteBrands;
