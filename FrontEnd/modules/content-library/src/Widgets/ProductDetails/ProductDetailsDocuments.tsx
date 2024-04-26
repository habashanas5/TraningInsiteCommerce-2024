import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconMemo, IconProps } from "@insite/mobius/Icon";
import File from "@insite/mobius/Icons/File";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProduct;

export interface ProductDetailsDocumentsStyles {
    wrapper?: InjectableCss;
    container?: GridContainerProps;
    documentGridItem?: GridItemProps;
    documentLink?: LinkPresentationProps;
    documentIcon?: IconProps;
    documentNameText?: TypographyPresentationProps;
}

export const documentsStyles: ProductDetailsDocumentsStyles = {
    wrapper: {
        css: css`
            padding: 10px 15px 30px;
        `,
    },
    documentGridItem: {
        width: [12, 12, 6, 6, 6],
    },
    documentIcon: {
        src: File,
        color: "text.link",
        css: css`
            margin-right: 10px;
        `,
    },
    documentNameText: {
        css: css`
            vertical-align: super;
        `,
    },
};

const styles = documentsStyles;

const ProductDetailsDocuments: React.FC<OwnProps> = ({ product: { documents } }) => {
    if (!documents || documents.length === 0) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <GridContainer {...styles.container}>
                {documents.map(document => (
                    <GridItem key={document.id.toString()} {...styles.documentGridItem}>
                        <Link
                            href={document.filePath}
                            target="_new"
                            {...styles.documentLink}
                            data-test-selector={`productDetails_${document.id}`}
                        >
                            <IconMemo {...styles.documentIcon} />
                            <Typography {...styles.documentNameText}>{document.name}</Typography>
                        </Link>
                    </GridItem>
                ))}
            </GridContainer>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsDocuments),
    definition: {
        displayName: "Documents",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
