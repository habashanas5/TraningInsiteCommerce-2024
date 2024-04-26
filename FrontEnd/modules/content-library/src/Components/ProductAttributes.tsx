import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import { AttributeValueModel } from "@insite/client-framework/Types/ApiModels";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    maximumNumberAttributeTypes: number;
    extendedStyles?: ProductAttributesStyles;
}

type Props = OwnProps & HasProduct;

export interface ProductAttributesStyles {
    container?: GridContainerProps;
    attributeTypeGridItem?: GridItemProps;
    attributeValueGridItem?: GridItemProps;
    attributeTypeText?: TypographyPresentationProps;
    attributeValueText?: TypographyPresentationProps;
}

export const productAttributesStyles: ProductAttributesStyles = {
    container: {
        gap: 0,
    },
    attributeTypeGridItem: {
        width: [6, 6, 6, 4, 4],
        css: css`
            overflow: hidden;
        `,
    },
    attributeValueGridItem: {
        width: [6, 6, 6, 8, 8],
        css: css`
            overflow: hidden;
        `,
    },
    attributeTypeText: {
        weight: "bold",
    },
};

const ProductAttributes: FC<Props> = ({ product: { attributeTypes }, maximumNumberAttributeTypes, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(productAttributesStyles, extendedStyles));

    if (!attributeTypes || attributeTypes.length === 0) {
        return null;
    }

    const maximum = Math.min(maximumNumberAttributeTypes, 100);
    const limitedAttributeTypes = attributeTypes.slice(0, maximum);

    const displayAttributeValues = (attributeValues: AttributeValueModel[] | null) => {
        return (
            <Typography {...styles.attributeValueText}>
                {(attributeValues ?? []).map(a => a.valueDisplay).join(", ")}
            </Typography>
        );
    };

    return (
        <GridContainer {...styles.container}>
            {limitedAttributeTypes.map(attributeType => (
                <React.Fragment key={attributeType.id.toString()}>
                    <GridItem {...styles.attributeTypeGridItem}>
                        <Typography
                            {...styles.attributeTypeText}
                            data-test-selector={`attributeType${attributeType.id}`}
                        >
                            {attributeType.label || attributeType.name}
                        </Typography>
                    </GridItem>
                    <GridItem
                        {...styles.attributeValueGridItem}
                        data-test-selector={`attributeValuesFor${attributeType.id}`}
                    >
                        {displayAttributeValues(attributeType.attributeValues)}
                    </GridItem>
                </React.Fragment>
            ))}
        </GridContainer>
    );
};

export default withProduct(ProductAttributes);
